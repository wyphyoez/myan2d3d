import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function TwoDresults({ title }) {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/2d/history").then((response) => { if (!response.ok) throw new Error("History is temporarily unavailable."); return response.json(); }).then((data) => setResults(data.results || [])).catch((err) => setError(err.message)); }, []);
  return <>
    <Helmet><title>{title} | Myan2D3D</title></Helmet>
    <section className="px-3 py-4" aria-labelledby="history-heading">
      <h1 id="history-heading" className="text-xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-[#806b43]">Collected from our server-side SET collector.</p>
      {error && <div role="alert" className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">{error}</div>}
      {!error && results.length === 0 && <div className="mt-4 rounded-xl bg-white/70 px-4 py-6 text-center text-sm text-[#66583d]">No collected results yet.</div>}
      <div className="mt-4 flex flex-col gap-2">{results.map((item, index) => <article className="filter-div rounded-xl bg-white px-4 py-3" key={`${item.collectedAt}-${index}`}><div className="flex items-center justify-between"><span className="text-sm text-[#806b43]">{item.date}</span><span className="text-xs text-[#806b43]">{item.session}</span></div><div className="mt-1 flex items-center justify-between"><span>SET {item.set ?? "--"}</span><strong className="text-2xl text-[#433b24]">{item.twoD ?? "--"}</strong></div></article>)}</div>
    </section>
  </>;
}
