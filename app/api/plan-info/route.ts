import { auth } from '@clerk/nextjs/server'

export async function POST() {
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    // Not authenticated
  }

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/plan-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Plan info error:", error);
    return Response.json({
      plan: "guest",
      isGuest: true,
      remainingMessages: null,
      dailyLimit: 5,
      limitReached: false,
    });
  }
}
