import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID_CHAT // appNrbeSioayXVhg8

async function createUserInAirtable(userData: {
  clerk_id: string
  email: string
  name: string
  created_at: string
  platform: string
}) {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              clerk_id: userData.clerk_id,
              email: userData.email,
              name: userData.name,
              created_at: userData.created_at,
              subscription_status: 'free',
              subscription_plan: 'free',
              last_login: userData.created_at,
              login_count: 1,
              platform: userData.platform,
            },
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Airtable error: ${error}`)
  }

  return response.json()
}

async function updateUserLogin(clerk_id: string) {
  // Сначала найдём пользователя
  const searchResponse = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={clerk_id}="${clerk_id}"`,
    {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  )

  const searchData = await searchResponse.json()
  
  if (searchData.records && searchData.records.length > 0) {
    const record = searchData.records[0]
    const currentCount = record.fields.login_count || 0

    // Обновляем last_login и login_count
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
            last_login: new Date().toISOString(),
            login_count: currentCount + 1,
          },
        }),
      }
    )
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Получаем заголовки
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Получаем тело запроса
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Верифицируем webhook
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Обрабатываем события
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, created_at } = evt.data
    
    const email = email_addresses?.[0]?.email_address || ''
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Unknown'

    try {
      await createUserInAirtable({
        clerk_id: id,
        email: email,
        name: name,
        created_at: new Date(created_at).toISOString(),
        platform: 'web',
      })
      console.log(`User created in Airtable: ${id}`)
    } catch (error) {
      console.error('Failed to create user in Airtable:', error)
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
    }
  }

  if (eventType === 'session.created') {
    const { user_id } = evt.data
    
    try {
      await updateUserLogin(user_id)
      console.log(`User login updated: ${user_id}`)
    } catch (error) {
      console.error('Failed to update user login:', error)
    }
  }

  return NextResponse.json({ success: true })
}
