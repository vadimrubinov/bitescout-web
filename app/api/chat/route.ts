import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { message, sessionId, chatId, scoutId } = await req.json();
  
  // Get clerk user ID if authenticated (returns null for guests)
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    // Not authenticated — guest user
  }

  // Extract real client IP to pass through to rng-ai-service
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/web-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Real-IP": clientIp,
      },
      body: JSON.stringify({ 
        message, 
        sessionId,
        chatId,
        scoutId,
        clerkUserId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Bot API error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json({ 
      reply: data.reply,
      sessionId: data.sessionId,
      chatId: data.chatId || null,
      scoutId: data.scoutId || null,
      plan: data.plan || "guest",
      isGuest: data.isGuest !== false,
      remainingMessages: data.remainingMessages ?? null,
      limitReached: data.limitReached || false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting right now. Please try again.",
      sessionId: "error"
    }, { status: 500 });
  }
}
