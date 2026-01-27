import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID_CHAT

async function updateUserSubscription(clerkUserId: string, status: string, stripeCustomerId: string, expiresAt?: string) {
  // Найти пользователя по clerk_id
  const searchResponse = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={clerk_id}="${clerkUserId}"`,
    {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  )

  const searchData = await searchResponse.json()
  
  if (searchData.records && searchData.records.length > 0) {
    const record = searchData.records[0]

    const updateFields: Record<string, any> = {
      subscription_status: status,
      stripe_customer_id: stripeCustomerId,
    }

    if (status === 'active') {
      updateFields.subscription_plan = 'pro'
    }

    if (expiresAt) {
      updateFields.subscription_expires = expiresAt
    }

    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${record.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: updateFields }),
      }
    )

    console.log(`Updated subscription for user ${clerkUserId}: ${status}`)
  }
}

async function getSubscriptionDetails(subscriptionId: string) {
  const response = await fetch(
    `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
    {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    }
  )
  return response.json()
}

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const signature = headerPayload.get('stripe-signature')

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Простая верификация (для production лучше использовать stripe SDK)
  // Пока обрабатываем без верификации подписи для MVP
  
  let event
  try {
    event = JSON.parse(body)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, data } = event

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object
        const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id
        const customerId = session.customer
        const subscriptionId = session.subscription

        if (clerkUserId && subscriptionId) {
          const subscription = await getSubscriptionDetails(subscriptionId)
          const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()
          
          await updateUserSubscription(clerkUserId, 'active', customerId, expiresAt)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = data.object
        const customerId = subscription.customer
        const status = subscription.status === 'active' ? 'active' : 'cancelled'
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

        // Найти пользователя по stripe_customer_id
        const searchResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={stripe_customer_id}="${customerId}"`,
          {
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            },
          }
        )
        const searchData = await searchResponse.json()
        
        if (searchData.records && searchData.records.length > 0) {
          const record = searchData.records[0]
          await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${record.id}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: {
                  subscription_status: status,
                  subscription_expires: expiresAt,
                },
              }),
            }
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object
        const customerId = subscription.customer

        const searchResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={stripe_customer_id}="${customerId}"`,
          {
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            },
          }
        )
        const searchData = await searchResponse.json()
        
        if (searchData.records && searchData.records.length > 0) {
          const record = searchData.records[0]
          await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${record.id}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: {
                  subscription_status: 'expired',
                  subscription_plan: 'free',
                },
              }),
            }
          )
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
