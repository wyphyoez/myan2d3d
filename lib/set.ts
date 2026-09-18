import { calculateTwoD, marketStatus, saveResult, writeMarket } from "./market"
const pick = (source: Record<string, unknown>, keys: string[]) => keys.map(k => source[k] ?? source[k.toLowerCase()]).find(v => v !== undefined && v !== null && v !== "") ?? null
export async function collectSetData() {
  const endpoint = process.env.SET_MARKET_ENDPOINT || "https://marketplace.set.or.th/api/public/realtime-data/index"
  if (!process.env.SET_API_KEY) throw new Error("SET_API_KEY is not configured")
  const response = await fetch(endpoint, { headers: { "api-key": process.env.SET_API_KEY, accept: "application/json" }, signal: AbortSignal.timeout(10000), cache: "no-store" })
  if (!response.ok) throw new Error(`SET returned ${response.status}`)
  const payload = await response.json() as Record<string, unknown> | unknown[]
  const rows = Array.isArray(payload) ? payload : (payload.data || payload.result || payload.results || [])
  const source = (Array.isArray(rows) ? rows[0] : rows) as Record<string, unknown>
  const set = pick(source || {}, ["index", "indexValue", "value", "last", "close", "SET"])
  const value = pick(source || {}, ["value", "change", "marketValue", "totalValue"])
  const twoD = calculateTwoD(set)
  const record = await writeMarket({ set, value, twoD, source: "SET SMART Marketplace" })
  const status = marketStatus()
  if (twoD && status.session) await saveResult({ date: record.collectedAt.slice(0, 10), session: status.session.id, set, value, twoD, collectedAt: record.collectedAt })
  return record
}
