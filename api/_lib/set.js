import { calculateTwoD, marketStatus, saveResult, writeMarket } from "./market.js";

const SET_ENDPOINT = process.env.SET_MARKET_ENDPOINT || "https://marketplace.set.or.th/api/public/realtime-data/index";

function pick(source, keys) {
  for (const key of keys) {
    const value = source?.[key] ?? source?.[key.toLowerCase()];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

export async function collectSetData() {
  if (!process.env.SET_API_KEY) throw new Error("SET_API_KEY is not configured");
  const response = await fetch(SET_ENDPOINT, { headers: { "api-key": process.env.SET_API_KEY, accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`SET returned ${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.data || payload.result || payload.results || [];
  const source = Array.isArray(rows) ? rows[0] || {} : rows;
  const set = pick(source, ["index", "indexValue", "value", "last", "close", "SET"]);
  const value = pick(source, ["value", "change", "marketValue", "totalValue"]);
  const twoD = calculateTwoD(set);
  const market = await writeMarket({ set, value, twoD, source: "SET SMART Marketplace" });
  const status = marketStatus();
  if (twoD && status.session) {
    await saveResult({ date: new Date().toISOString().slice(0, 10), session: status.session.id, set, value, twoD, collectedAt: market.collectedAt });
  }
  return market;
}
