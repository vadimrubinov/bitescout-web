import { NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID_CHAT

export async function POST(req: Request) {
  console.log('Stripe webhook received')
  
  let event
  try {
    const body = await req.text()
    event = JSON.parse(body)
  } catch (err) {
    console.error('Failed to parse JSON:', err)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, data } = event
  console.log(`Event type: ${type}`)

  try {
    if (type === 'checkout.session.completed') {
      const session = data.object
      const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id
      const customerId = session.customer

      console.log(`Processing checkout - clerkUserId: ${clerkUserId}, customerId: ${customerId}`)

      if (!clerkUserId) {
        console.log('No clerkUserId found')
        return NextResponse.json({ received: true, note: 'no clerk user id' })
      }

      // Найти пользователя по clerk_id
      const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={clerk_id}="${clerkUserId}"`
      console.log(`Searching: ${searchUrl}`)
      
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      })

      const searchData = await searchResponse.json()
      console.log(`Search result: ${JSON.stringify(searchData)}`)
      
      if (searchData.records && searchData.records.length > 0) {
        const record = searchData.records[0]
        
        // Обновляем пользователя
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
        
        const updateResult = await updateResponse.json()
        console.log(`Update result: ${JSON.stringify(updateResult)}`)
      } else {
        console.log(`No user found with clerk_id: ${clerkUserId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed', details: String(error) }, { status: 500 })
  }
}
