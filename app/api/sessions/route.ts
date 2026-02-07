import { auth } from '@clerk/nextjs/server'

export async function POST() {
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    return Response.json({ sessions: [] });
  }

  if (!clerkUserId) {
    return Response.json({ sessions: [] });
  }

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Sessions API error:", error);
    return Response.json({ sessions: [] });
  }
}
