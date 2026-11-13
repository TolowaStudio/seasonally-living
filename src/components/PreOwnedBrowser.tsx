"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "./Icon";
import { SPA_FEATURES } from "@/content/pre-owned-checklist";
import type { PreOwnedSpa } from "@/content/types";
import { SEAT_BANDS, seatBandOf, specLine, statusLabel } from "@/lib/pre-owned-ui";

type Sort = "arrival" | "seats-desc" | "seats-asc" | "year-desc";
const SORTS: { id: Sort; label: string }[] = [
  { id: "arrival", label: "Newest arrivals" },
  { id: "seats-desc", label: "Most seats" },
  { id: "seats-asc", label: "Fewest seats" },
  { id: "year-desc", label: "Newest model year" },
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Filter + sort + card grid for the pre-owned floor. Prices are never shown ("Call for price"). */
export default function PreOwnedBrowser({ spas }: { spas: PreOwnedSpa[] }) {
  const [bands, setBands] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("arrival");

  const allBrands = useMemo(() => [...new Set(spas.map((s) => s.brand).filter((b): b is string => !!b))].sort(), [spas]);
  const allFeatures = useMemo(() => SPA_FEATURES.filter((f) => spas.some((s) => s.features?.includes(f))), [spas]);

  const shown = useMemo(() => {
    const out = spas.filter(
      (s) =>
        (!bands.length || bands.includes(seatBandOf(s.seats) ?? "")) &&
        (!brands.length || brands.includes(s.brand ?? "")) &&
        features.every((f) => s.features?.includes(f)),
    );
    const key = (s: PreOwnedSpa) => s.listedDate ?? "";
    const by: Record<Sort, (a: PreOwnedSpa, b: PreOwnedSpa) => number> = {
      arrival: (a, b) => key(b).localeCompare(key(a)),
      "seats-desc": (a, b) => (b.seats ?? 0) - (a.seats ?? 0),
      "seats-asc": (a, b) => (a.seats ?? 99) - (b.seats ?? 99),
      "year-desc": (a, b) => (b.year ?? 0) - (a.year ?? 0),
    };
    // Available first, then reserved; featured spas lead within each group, then the chosen sort.
    return [...out].sort((a, b) => Number(a.status === "reserved") - Number(b.status === "reserved") || Number(!!b.featured) - Number(!!a.featured) || by[sort](a, b));
  }, [spas, bands, brands, features, sort]);

  const active = bands.length + brands.length + features.length;
  const clear = () => {
    setBands([]);
    setBrands([]);
    setFeatures([]);
  };

  return (
    <div>
      <div className="po-filters" role="group" aria-label="Filter pre-owned spas">
        <div className="po-filter-row">
          <span className="field-label">Seats</span>
          <div className="po-chips">
            {SEAT_BANDS.map((b) => (
              <button key={b.id} type="button" className={`chip${bands.includes(b.id) ? " active" : ""}`} aria-pressed={bands.includes(b.id)} onClick={() => setBands(toggle(bands, b.id))}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
        {allBrands.length > 1 && (
          <div className="po-filter-row">
            <span className="field-label">Brand</span>
            <div className="po-chips">
              {allBrands.map((b) => (
                <button key={b} type="button" className={`chip${brands.includes(b) ? " active" : ""}`} aria-pressed={brands.includes(b)} onClick={() => setBrands(toggle(brands, b))}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
        {allFeatures.length > 0 && (
          <div className="po-filter-row">
            <span className="field-label">Features</span>
            <div className="po-chips">
              {allFeatures.map((f) => (
                <button key={f} type="button" className={`chip${features.includes(f) ? " active" : ""}`} aria-pressed={features.includes(f)} onClick={() => setFeatures(toggle(features, f))}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="po-filter-row po-sortbar">
          <label className="field-label" htmlFor="po-sort">Sort</label>
          <select id="po-sort" className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <span className="small body-muted" role="status" aria-live="polite">
            {shown.length} of {spas.length} {spas.length === 1 ? "spa" : "spas"}
          </span>
          {active > 0 && (
            <button type="button" className="po-clear" onClick={clear}>Clear filters</button>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card" style={{ padding: 28, marginTop: 28, maxWidth: 640 }}>
          <p className="lead">Nothing on the floor matches that right now.</p>
          <p className="body-muted" style={{ marginTop: 8 }}>Tell us what you&apos;re after below and we&apos;ll let you know when a tub like it arrives.</p>
          <a href="#alert" className="btn btn-primary" style={{ marginTop: 18 }}>
            Tell me when one arrives <Icon name="arrow" size={16} />
          </a>
        </div>
      ) : (
        <div className="po-grid">
          {shown.map((s, n) => {
            const photo = s.photos?.[0];
            return (
              <Link key={s.slug} href={`/pre-owned/${s.slug}`} className={`card hoverable po-card${s.status === "reserved" ? " po-card-reserved" : ""}`}>
                <div className="photo po-photo">
                  {photo && (
                    <Image src={photo.image} alt={photo.alt || s.title} fill priority={n < 3} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  )}
                  <span className="po-badges">
                    {s.justArrived && <span className="po-badge po-new">Just arrived</span>}
                    {s.status === "reserved" && <span className="po-badge po-reserved">{statusLabel(s.status)}</span>}
                  </span>
                </div>
                <div className="po-body">
                  <h3 className="h-md" style={{ fontSize: 22 }}>{s.title}</h3>
                  <p className="body-muted small" style={{ marginTop: 6 }}>{specLine(s)}</p>
                  {s.features && s.features.length > 0 && <p className="po-tags">{s.features.slice(0, 3).join(" · ")}</p>}
                  <span className="po-cta">{s.status === "reserved" ? "See details" : "Call for price"} <Icon name="arrow" size={16} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
