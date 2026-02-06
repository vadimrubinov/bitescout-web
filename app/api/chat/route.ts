import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { message, sessionId } = await req.json();
  
  // Get clerk user ID if authenticated (returns null for guests)
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    // Not authenticated — guest user
  }

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/web-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message, 
        sessionId,
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
