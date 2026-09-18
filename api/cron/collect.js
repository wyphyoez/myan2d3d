import { collectSetData } from "../_lib/set.js";
import { json, marketStatus } from "../_lib/market.js";
export default async function handler(request) {
  if (process.env.CRON_SECRET && request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const status = marketStatus();
    if (status.state !== "LIVE") return json({ ok: true, skipped: true, status });
    return json({ ok: true, market: await collectSetData(), status });
  }
  catch (error) { return json({ ok: false, error: error.message }, { status: 502 }); }
}
