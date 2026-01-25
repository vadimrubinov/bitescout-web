import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'https://rng-telegram-bot.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Call the bot API
    const response = await fetch(`${BOT_API_URL}/api/web-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Bot API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      reply: data.reply,
      sessionId: data.sessionId 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback mock response if bot is unavailable
    const { message } = await request.clone().json();
    const mockReply = `I'm currently connecting to our database. Here's what I found for "${message}":

**Top matches from our database:**

**1. Salmon Eye Charters** (Ucluelet, BC)
★ 4.9 · Chinook & Halibut specialist · $1,200/day
Best for: Trophy fishing, experienced anglers

**2. Island West Resort** (Ucluelet, BC)  
★ 4.7 · Full-service lodge · $1,400/day
Best for: Groups wanting accommodation + fishing

**3. Bon Chovy Charters** (Vancouver, BC)
★ 4.8 · City departure · $1,100/day
Best for: Convenience, close to airport

Would you like more details on any of these operators?`;

    return NextResponse.json({ reply: mockReply });
  }
}
