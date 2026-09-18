import { marketStatus } from "../../../../lib/market"
export const dynamic = "force-dynamic"
export async function GET() { return Response.json(marketStatus(), { headers: { "Cache-Control": "no-store" } }) }
