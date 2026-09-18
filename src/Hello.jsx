import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import TwoDitem from "./components/TwoDitem";

const slots = [
  ["11:00 AM", "morning"],
  ["12:00 PM", "morning-close"],
  ["3:00 PM", "afternoon"],
  ["4:30 PM", "afternoon-close"],
];

export default function Hello() {
  const [market, setMarket] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/2d/latest", { cache: "no-store" });
        if (!response.ok) throw new Error("Our market service is unavailable.");
        const payload = await response.json();
        if (active) { setMarket(payload); setStatus(payload.status); setError(""); }
      } catch (err) { if (active) setError(err.message); }
    };
    load();
    const timer = setInterval(load, 15000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const state = status?.state || "WAITING";
  return <main className="HelloL px-3 pb-5">
    <Helmet><title>Live 2D Results | Myan2D3D</title><meta name="description" content="Official SET-powered Myanmar 2D live results." /></Helmet>
    <header className="pt-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#806b43]">Myanmar 2D / 3D</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${state === "LIVE" ? "bg-green-100 text-green-800" : "bg-black/10 text-[#66583d]"}`}>{state}</span>
        {market?.collectedAt && <span className="text-xs text-[#806b43]">Updated {new Date(market.collectedAt).toLocaleTimeString()}</span>}
      </div>
      <h1 className="txet-sh mt-2 text-8xl font-semibold">{state === "LIVE" ? (market?.twoD || "--") : "--"}</h1>
      <p className="text-sm text-[#66583d]">{state === "LIVE" ? "Live from SET market data" : "Next session starts at " + (status?.nextSession?.label || "11:00 AM")}</p>
    </header>
    {error && <div role="alert" className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-800">{error}</div>}
    {!error && !market && <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-center text-sm text-[#66583d]">Loading latest market data…</div>}
    {market?.collectedAt && Date.now() - new Date(market.collectedAt).getTime() > 120000 && <div role="status" className="mt-4 rounded-xl bg-amber-100 px-4 py-3 text-center text-sm text-amber-900">Data is stale. Waiting for the next SET update.</div>}
    <nav className="mt-5 grid grid-cols-2 gap-2 text-center text-sm">
      <Link className="rounded-xl bg-white/75 px-3 py-3 font-semibold" to="/2d-results">2D History</Link>
      <Link className="rounded-xl bg-white/75 px-3 py-3 font-semibold" to="/3d-results">3D Results</Link>
    </nav>
    <section className="mt-3" aria-label="Today's sessions">
      {slots.map(([time, key]) => <TwoDitem key={key} time={time} set={key === "morning" || key === "afternoon" ? (market?.set || "--") : "--"} val={market?.value || "--"} result={key === "morning" || key === "afternoon" ? (market?.twoD || "--") : "--"} />)}
    </section>
  </main>;
}
