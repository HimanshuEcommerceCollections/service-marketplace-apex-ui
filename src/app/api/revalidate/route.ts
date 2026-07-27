import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Publish-triggered ISR bust (doc 07 §8). The API server pings this after an
// admin changes catalog pricing so the marketing cache refreshes immediately
// instead of waiting out the 300s TTL. Shared-secret guarded; body: { tags }.
export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: unknown };
  const tags =
    Array.isArray(body.tags) && body.tags.length
      ? (body.tags.filter((t): t is string => typeof t === "string"))
      : ["catalog"];

  // 'max' = stale-while-revalidate: serve stale immediately, refresh in the
  // background on next visit (the two-arg form; single-arg is deprecated in v16).
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ success: true, data: { revalidated: tags } });
}
