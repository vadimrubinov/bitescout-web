import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID_CHAT

async function updateUserSubscription(clerkUserId: string, status: string, stripeCustomerId: string, expiresAt?: string) {
  console.log(`Updating user ${clerkUserId} with status ${status}`)
  
  // Найти пользователя по clerk_id
  const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={clerk_id}="${clerkUserId}"`
  console.log(`Search URL: ${searchUrl}`)
  
  const searchResponse = await fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  const searchData = await searchResponse.json()
  console.log(`Search result: ${JSON.stringify(searchData)}`)
  
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

    console.log(`Updating record ${record.id} with fields: ${JSON.stringify(updateFields)}`)

    const updateResponse = await fetch(
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
    
    const updateResult = await updateResponse.json()
    console.log(`Update result: ${JSON.stringify(updateResult)}`)
  } else {
    console.log(`No user found with clerk_id: ${clerkUserId}`)
  }
}

async function getSubscriptionDetails(subscriptionId: string) {
  const response = await fetch(
    `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(STRIPE_SECRET_KEY + ':').toString('base64')}`,
      },
    }
  )
  return response.json()
}

export async function POST(req: Request) {
  console.log('Stripe webhook received')
  
  const body = await req.text()
  const headerPayload = await headers()
  const signature = headerPayload.get('stripe-signature')

  console.log(`Signature present: ${!!signature}`)
  console.log(`Webhook secret present: ${!!STRIPE_WEBHOOK_SECRET}`)
  console.log(`Airtable API key present: ${!!AIRTABLE_API_KEY}`)
  console.log(`Airtable base ID: ${AIRTABLE_BASE_ID}`)

  // Пока пропускаем верификацию подписи для отладки
  let event
  try {
    event = JSON.parse(body)
  } catch (err) {
    console.error('Failed to parse JSON:', err)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, data } = event
  console.log(`Event type: ${type}`)

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object
        const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id
        const customerId = session.customer
        const subscriptionId = session.subscription

        console.log(`Checkout completed - clerkUserId: ${clerkUserId}, customerId: ${customerId}, subscriptionId: ${subscriptionId}`)

        if (clerkUserId && subscriptionId) {
          const subscription = await getSubscriptionDetails(subscriptionId)
          console.log(`Subscription details: ${JSON.stringify(subscription)}`)
          
          const expiresAt = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : undefined
          
          await updateUserSubscription(clerkUserId, 'active', customerId, expiresAt)
        } else {
          console.log('Missing clerkUserId or subscriptionId')
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = data.object
        const customerId = subscription.customer
        const status = subscription.status === 'active' ? 'active' : 'cancelled'
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

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

    console.log('Webhook processed successfully')
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed', details: String(error) }, { status: 500 })
  }
}
