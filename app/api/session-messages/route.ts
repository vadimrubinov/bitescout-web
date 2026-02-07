import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { chatId } = await req.json();

  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!clerkUserId || !chatId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/session-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, clerkUserId }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Session messages API error:", error);
    return Response.json({ messages: [] });
  }
}
