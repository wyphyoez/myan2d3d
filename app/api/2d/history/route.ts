import { readHistory } from "../../../../lib/market"
export const dynamic = "force-dynamic"
export async function GET() { try { return Response.json({ results: await readHistory() }, { headers: { "Cache-Control": "no-store" } }) } catch { return Response.json({ error: "API_UNAVAILABLE", message: "History is temporarily unavailable." }, { status: 503 }) } }
