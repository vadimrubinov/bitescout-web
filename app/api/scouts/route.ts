import { auth } from '@clerk/nextjs/server'

export async function POST() {
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    return Response.json({ scouts: [] });
  }

  if (!clerkUserId) {
    return Response.json({ scouts: [] });
  }

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/scouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Scouts API error:", error);
    return Response.json({ scouts: [] });
  }
}
