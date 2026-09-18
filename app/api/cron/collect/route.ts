import { collectSetData } from "../../../../lib/set"
export const dynamic = "force-dynamic"
export async function GET(request: Request) { const auth = request.headers.get("authorization"); if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) return new Response("Unauthorized", { status: 401 }); try { return Response.json(await collectSetData()) } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Collector failed" }, { status: 502 }) } }
