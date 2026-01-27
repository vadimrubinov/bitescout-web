import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress

    // Создаём Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'payment_method_types[0]': 'card',
        'line_items[0][price]': STRIPE_PRICE_ID!,
        'line_items[0][quantity]': '1',
        'success_url': 'https://bitescout.com/?success=true',
        'cancel_url': 'https://bitescout.com/?canceled=true',
        'customer_email': email || '',
        'client_reference_id': userId,
        'metadata[clerk_user_id]': userId,
      }),
    })

    const session = await response.json()

    if (session.error) {
      console.error('Stripe error:', session.error)
      return NextResponse.json({ error: session.error.message }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
