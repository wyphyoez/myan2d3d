# Myan2D3D platform upgrade

## Architecture
- Removed browser calls to third-party result APIs. The React/Vite client now polls same-origin Vercel API routes.
- Added Vercel serverless endpoints for latest 2D data, history, market status, and a protected scheduled collector.
- Added Upstash Redis persistence for the latest market snapshot and a bounded result history list.
- Replaced Firebase Hosting configuration with `vercel.json`, including a once-per-minute cron schedule and baseline security headers.

## Market data
- The collector uses SET SMART Marketplace's verified JSON endpoint: `GET https://marketplace.set.or.th/api/public/realtime-data/index` with the `api-key` header.
- `SET_API_KEY` is required for the official SET SMART Marketplace endpoint. `SET_MARKET_ENDPOINT` can override the endpoint for an approved SET environment only; no third-party 2D/3D API is used. The collector uses the project's Vercel-provided `KV_REST_API_URL` and `KV_REST_API_TOKEN` when available.
- `MARKET_TIME_ZONE` defaults to `Asia/Yangon`. Sessions are 11:00–12:00 and 15:00–16:30 by default.

## Runtime behavior
- `WAITING` hides the live value outside configured sessions.
- `LIVE` calculates the 2D value from the last two digits of the collected SET index and updates through the server collector.
- The cutoff is enforced by the session status calculation; the last stored value remains available to history while the live display returns to `--`.
- Configure `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SET_API_KEY`, and `CRON_SECRET` in Vercel. The cron route accepts Vercel's bearer secret when configured.
