import { cors, json, marketStatus, readLatest } from "../_lib/market.js";
export default async function handler() {
  try { return cors(json({ ...await readLatest(), status: marketStatus() })); }
  catch (error) { return cors(json({ error: "API_UNAVAILABLE", message: error.message }, { status: 503 })); }
}
