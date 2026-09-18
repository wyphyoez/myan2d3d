import { cors, json, marketStatus, readLatest } from "../_lib/market.js";
export default async function handler() {
  try { const latest = await readLatest(); return cors(json({ ...marketStatus(), collectedAt: latest.collectedAt })); }
  catch (error) { return cors(json({ error: "API_UNAVAILABLE", message: error.message }, { status: 503 })); }
}
