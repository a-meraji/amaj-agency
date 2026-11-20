import "server-only";
import { connection } from "next/server";

export async function contentResponse(query: () => Promise<unknown>) {
  await connection();
  const headers = { "Cache-Control": "no-store" };

  try {
    const content = await query();
    return content === null
      ? Response.json({ error: "Content not found" }, { status: 404, headers })
      : Response.json({ data: content }, { headers });
  } catch (error) {
    console.error("Public content request failed.", error);
    return Response.json({ error: "Content is temporarily unavailable" }, { status: 503, headers });
  }
}
