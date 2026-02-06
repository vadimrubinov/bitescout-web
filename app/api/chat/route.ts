export async function POST(req: Request) {
  const { message, sessionId } = await req.json();
  
  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/web-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });
    
    if (!response.ok) {
      throw new Error(`Bot API error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json({ 
      reply: data.reply,
      sessionId: data.sessionId
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting right now. Please try again.",
      sessionId: "error"
    }, { status: 500 });
  }
}
