import { Redis } from "@upstash/redis"

export type MarketState = "WAITING" | "LIVE" | "CLOSED"
export const sessions = [
  { id: "morning", label: "11:00 AM", start: "11:00", cutoff: "12:00" },
  { id: "afternoon", label: "3:00 PM", start: "15:00", cutoff: "16:30" },
] as const
const redis = new Redis({ url: process.env.KV_REST_API_URL || process.env.REDIS_URL || "", token: process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || "" })
const LATEST = "myan2d:market:latest"
const HISTORY = "myan2d:results:history"
const mins = (v: string) => { const [h, m] = v.split(":").map(Number); return h * 60 + m }

export function marketStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: process.env.MARKET_TIME_ZONE || "Asia/Yangon", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now)
  const current = Number(parts.find(p => p.type === "hour")?.value) * 60 + Number(parts.find(p => p.type === "minute")?.value)
  const live = sessions.find(s => current >= mins(s.start) && current < mins(s.cutoff))
  const next = sessions.find(s => current < mins(s.start)) || sessions[0]
  return { state: (live ? "LIVE" : sessions.some(s => current >= mins(s.cutoff)) ? "CLOSED" : "WAITING") as MarketState, session: live || null, nextSession: next, checkedAt: now.toISOString() }
}
export const calculateTwoD = (value: unknown) => { const digits = String(value ?? "").replace(/[^0-9]/g, ""); return digits.length >= 2 ? digits.slice(-2).padStart(2, "0") : null }
export async function readLatest() { return await redis.get<Record<string, unknown>>(LATEST) || { set: null, value: null, twoD: null, collectedAt: null } }
export async function readHistory(limit = 30) { return await redis.lrange<Record<string, unknown>>(HISTORY, 0, Math.min(limit, 90) - 1) }
export async function writeMarket(data: Record<string, unknown>) { const record = { ...data, collectedAt: new Date().toISOString() }; await redis.set(LATEST, record); return record }
export async function saveResult(result: Record<string, unknown>) { await redis.lpush(HISTORY, result); await redis.ltrim(HISTORY, 0, 90) }
