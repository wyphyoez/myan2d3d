import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const MARKET_KEY = "myan2d:market:latest";
const HISTORY_KEY = "myan2d:results:history";

export const sessions = [
  { id: "morning", label: "11:00 AM", start: "11:00", cutoff: "12:00" },
  { id: "afternoon", label: "3:00 PM", start: "15:00", cutoff: "16:30" },
];

function minutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function marketStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: process.env.MARKET_TIME_ZONE || "Asia/Yangon",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const current = Number(parts.find((part) => part.type === "hour").value) * 60 + Number(parts.find((part) => part.type === "minute").value);
  const active = sessions.find((session) => current >= minutes(session.start) && current < minutes(session.cutoff));
  const next = sessions.find((session) => current < minutes(session.start));
  return {
    state: active ? "LIVE" : "WAITING",
    session: active || null,
    nextSession: next || sessions[0],
    checkedAt: now.toISOString(),
  };
}

export function calculateTwoD(setValue) {
  const digits = String(setValue ?? "").replace(/[^0-9]/g, "");
  return digits.length >= 2 ? digits.slice(-2).padStart(2, "0") : null;
}

export async function readLatest() {
  return (await redis.get(MARKET_KEY)) || { set: null, value: null, twoD: null, collectedAt: null };
}

export async function writeMarket(market) {
  const record = { ...market, collectedAt: new Date().toISOString() };
  await redis.set(MARKET_KEY, record);
  return record;
}

export async function saveResult(result) {
  await redis.lpush(HISTORY_KEY, result);
  await redis.ltrim(HISTORY_KEY, 0, 90);
}

export async function readHistory(limit = 30) {
  return (await redis.lrange(HISTORY_KEY, 0, Math.min(limit, 90) - 1)) || [];
}

export { redis };

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json", "cache-control": "no-store" }, ...init });
}

export function cors(response) {
  response.headers.set("access-control-allow-origin", "*");
  return response;
}
