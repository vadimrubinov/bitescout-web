import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    // Not authenticated
  }

  // Extract real client IP to pass through to rng-ai-service
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  try {
    const response = await fetch("https://rng-ai-service.onrender.com/api/plan-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Real-IP": clientIp,
      },
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
