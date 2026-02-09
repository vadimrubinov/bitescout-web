import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  let clerkUserId: string | null = null;
  try {
    const { userId } = await auth();
    clerkUserId = userId;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!clerkUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { scoutId, newTitle } = await req.json();

    const response = await fetch("https://rng-ai-service.onrender.com/api/scout-rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scoutId, newTitle, clerkUserId }),
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json(err, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Scout rename API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
