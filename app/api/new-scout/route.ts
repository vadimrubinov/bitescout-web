import { auth } from '@clerk/nextjs/server'

export async function POST() {
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
    const response = await fetch("https://rng-ai-service.onrender.com/api/new-scout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("New scout API error:", error);
    return Response.json({ error: "Failed to create new scout" }, { status: 500 });
  }
}
