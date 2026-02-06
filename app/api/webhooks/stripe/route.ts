import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID_CHAT
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const stripe = new Stripe(STRIPE_SECRET_KEY || '')

export async function POST(req: Request) {
  // 1. Verify Stripe signature
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] Missing signature or webhook secret')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[Stripe Webhook] Verified event: ${event.type}, id: ${event.id}`)

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id
      const customerId = session.customer

      console.log(`[Stripe Webhook] Checkout completed - clerkUserId: ${clerkUserId ? 'present' : 'missing'}`)

      if (!clerkUserId) {
        return NextResponse.json({ received: true, note: 'no clerk user id' })
      }

      // Find user by clerk_id
      const escapedId = clerkUserId.replace(/"/g, '\\"')
      const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={clerk_id}="${escapedId}"`

      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      })

      const searchData = await searchResponse.json()
      const recordCount = searchData.records?.length || 0
      console.log(`[Stripe Webhook] User search: ${recordCount} record(s) found`)

      if (searchData.records && searchData.records.length > 0) {
        const record = searchData.records[0]

        // Update user subscription
        const updateResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${record.id}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: {
                subscription_status: 'active',
                subscription_plan: 'pro',
                stripe_customer_id: customerId,
              },
            }),
          }
        )

        if (updateResponse.ok) {
          console.log(`[Stripe Webhook] User ${record.id} updated to pro`)
        } else {
          console.error(`[Stripe Webhook] Failed to update user ${record.id}: ${updateResponse.status}`)
        }
      } else {
        console.log(`[Stripe Webhook] No user found for clerk_id`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Handler error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
