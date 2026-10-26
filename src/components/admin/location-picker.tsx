"use client";
import { useState, useTransition } from "react";
import { clearMapLocation, saveMapLocation, searchLocation, type Place } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mapEmbedUrl } from "@/lib/map";

/** Find the store on a map, preview it, and approve it. Only an approved location is shown on the public site. */
export function LocationPicker({ address, saved }: { address: string; saved: { lat: number; lon: number } | null }) {
  const [query, setQuery] = useState(address);
  const [results, setResults] = useState<Place[]>([]);
  const [picked, setPicked] = useState<Place | null>(null);
  const [live, setLive] = useState(saved);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const shown = picked ?? live;

  const find = () => start(async () => {
    setMsg("");
    const r = await searchLocation(query);
    setResults(r.places ?? []);
    setPicked(r.places?.[0] ?? null);
    if (r.error || !r.places?.length) setMsg(r.error ?? "No place found. Try adding the city and country.");
  });
  const approve = () => picked && start(async () => {
    const r = await saveMapLocation(picked.lat, picked.lon);
    if (r.error) return setMsg(r.error);
    setLive({ lat: picked.lat, lon: picked.lon });
    setPicked(null);
    setResults([]);
    setMsg("Approved. The map now shows on the Contact page.");
  });
  const remove = () => start(async () => {
    await clearMapLocation();
    setLive(null);
    setMsg("Map removed from the website.");
  });

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
      <h2 className="font-semibold">Store location on the map</h2>
      <p className="text-sm text-neutral-600">Type the store address, find it on the map, check the pin is right, then approve it. Only approved locations show on the website.</p>
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); find(); } }} placeholder="Street, city, country" aria-label="Store address" />
        <Button type="button" onClick={find} disabled={pending || query.trim().length < 3}>{pending ? "Working…" : "Find on map"}</Button>
      </div>
      {results.length > 1 && (
        <ul className="space-y-1 text-sm">
          {results.map((p) => <li key={`${p.lat},${p.lon}`}><button type="button" onClick={() => setPicked(p)} className={`text-left underline ${p === picked ? "font-semibold text-brand" : "text-neutral-600"}`}>{p.label}</button></li>)}
        </ul>
      )}
      {shown && (
        <div className="space-y-3">
          <iframe title="Store location" src={mapEmbedUrl(shown.lat, shown.lon)} className="h-64 w-full rounded-xl border" loading="lazy" />
          {picked ? (
            <div className="flex flex-wrap items-center gap-3"><p className="text-sm">{picked.label}</p><Button type="button" onClick={approve} disabled={pending}>Approve this location</Button></div>
          ) : <button type="button" onClick={remove} disabled={pending} className="text-xs text-red-600 underline">Remove map from the website</button>}
        </div>
      )}
      {msg && <p className="text-sm text-neutral-600" role="status">{msg}</p>}
    </section>
  );
}
