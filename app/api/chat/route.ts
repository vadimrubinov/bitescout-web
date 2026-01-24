import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // TODO: Replace with actual bot API call
    // const botApiUrl = process.env.BOT_API_URL;
    // const response = await fetch(`${botApiUrl}/api/chat`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // });
    // const data = await response.json();
    // return NextResponse.json({ reply: data.reply });

    // Temporary mock response
    const mockReply = `Based on your request: "${message}"

Here are some top matches from our database:

**1. Salmon Eye Charters** (Ucluelet, BC)
★ 4.9 · Chinook & Halibut specialist · $1,200/day
Best for: Trophy fishing, experienced anglers

**2. Island West Resort** (Ucluelet, BC)  
★ 4.7 · Full-service lodge · $1,400/day
Best for: Groups wanting accommodation + fishing

**3. Bon Chovy Charters** (Vancouver, BC)
★ 4.8 · City departure · $1,100/day
Best for: Convenience, close to airport

Would you like more details on any of these operators, or should I search with different criteria?`;

    return NextResponse.json({ reply: mockReply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
