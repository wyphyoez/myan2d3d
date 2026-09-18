import { marketStatus, readLatest } from "../../../../lib/market"
export const dynamic = "force-dynamic"
export async function GET() { try { return Response.json({ ...(await readLatest()), status: marketStatus() }, { headers: { "Cache-Control": "no-store" } }) } catch { return Response.json({ error: "API_UNAVAILABLE", message: "Market service is temporarily unavailable." }, { status: 503 }) } }
