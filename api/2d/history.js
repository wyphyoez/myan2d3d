import { cors, json, readHistory } from "../_lib/market.js";
export default async function handler(request) {
  try { const url = new URL(request.url); const limit = Number(url.searchParams.get("limit") || 30); return cors(json({ results: await readHistory(Number.isFinite(limit) ? limit : 30) })); }
  catch (error) { return cors(json({ error: "API_UNAVAILABLE", message: error.message }, { status: 503 })); }
}
