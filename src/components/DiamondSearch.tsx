"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import gsap from "gsap";

const SHAPES = ["Round", "Oval", "Emerald", "Cushion", "Pear", "Marquise", "Princess", "Radiant", "Asscher"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1"];
const CUTS = ["Any", "Ideal", "Excellent", "Very Good", "Good"];

interface Diamond {
  id: string | number;
  shape?: string;
  size?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  fluorescence_intensity?: string;
  depth_percent?: number;
  table_percent?: number;
  measurements?: string;
  lab?: string;
  total_sales_price?: number | null;
  price_per_carat?: number | null;
  image_url?: string | null;
  s3_image?: { url?: string | null } | null;
  cert_url?: string | null;
  video_url?: string | null;
  city?: string;
  country?: string;
  stock_num?: string;
}

interface ApiResponse {
  response?: {
    body?: {
      diamonds?: Diamond[];
      total_diamonds_found?: number;
    };
  };
  error?: string;
}

interface Filters {
  shapes: string[];
  sizeFrom: string;
  sizeTo: string;
  colorFrom: string;
  colorTo: string;
  clarityFrom: string;
  clarityTo: string;
  cut: string;
  priceFrom: string;
  priceTo: string;
  type: "Diamond" | "Lab_grown_Diamond";
}

function getDiamondImage(d: Diamond): string | null {
  return d.image_url || d.s3_image?.url || null;
}

function formatPrice(price: number | null | undefined): string {
  if (!price) return "Price on Request";
  return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const selectClass =
  "border-b border-white/15 py-2 font-outfit text-[13px] text-montaire-white focus:outline-none focus:border-montaire-gold transition-colors appearance-none [&>option]:bg-[#111] [&>option]:text-[#F5F5F0]";
const selectStyle = { backgroundColor: "#111", color: "#F5F5F0", colorScheme: "dark" as const };
const inputClass =
  "bg-transparent border-b border-white/15 py-2 font-outfit text-[13px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors w-full";

export default function DiamondSearch() {
  const [filters, setFilters] = useState<Filters>({
    shapes: [],
    sizeFrom: "",
    sizeTo: "",
    colorFrom: "",
    colorTo: "",
    clarityFrom: "",
    clarityTo: "",
    cut: "Any",
    priceFrom: "",
    priceTo: "",
    type: "Diamond",
  });

  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [detail, setDetail] = useState<Diamond | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileShowAll, setMobileShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchDiamonds = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    p.set("type", filters.type);
    p.set("page_size", "20");
    p.set("page_number", "1");
    if (filters.shapes.length > 0) p.set("shapes", filters.shapes.join(","));
    if (filters.sizeFrom) p.set("size_from", filters.sizeFrom);
    if (filters.sizeTo) p.set("size_to", filters.sizeTo);
    if (filters.colorFrom) p.set("color_from", filters.colorFrom);
    if (filters.colorTo) p.set("color_to", filters.colorTo);
    if (filters.clarityFrom) p.set("clarity_from", filters.clarityFrom);
    if (filters.clarityTo) p.set("clarity_to", filters.clarityTo);
    if (filters.cut !== "Any") p.set("cut_from", filters.cut);
    if (filters.priceFrom) p.set("price_total_from", filters.priceFrom);
    if (filters.priceTo) p.set("price_total_to", filters.priceTo);

    try {
      const res = await fetch(`/api/diamonds?${p.toString()}`);
      const data: ApiResponse = await res.json();
      const body = data.response?.body;
      setDiamonds(body?.diamonds || []);
      setTotalFound(body?.total_diamonds_found || 0);
      setHasSearched(true);
      setMobileShowAll(false);
    } catch {
      setDiamonds([]);
      setTotalFound(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchDiamonds(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchDiamonds]);

  useEffect(() => {
    if (!gridRef.current || diamonds.length === 0) return;
    const cards = gridRef.current.querySelectorAll(".diamond-card");
    gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: "power2.out" });
  }, [diamonds, mobileShowAll]);

  const toggleShape = (shape: string) => {
    setFilters((f) => ({
      ...f,
      shapes: f.shapes.includes(shape) ? f.shapes.filter((s) => s !== shape) : [...f.shapes, shape],
    }));
  };

  const resetFilters = () => {
    setFilters({ shapes: [], sizeFrom: "", sizeTo: "", colorFrom: "", colorTo: "", clarityFrom: "", clarityTo: "", cut: "Any", priceFrom: "", priceTo: "", type: filters.type });
  };

  // Mobile: limit to 8 diamonds unless "show all"
  const mobileLimit = 8;
  const visibleDiamondsMobile = mobileShowAll ? diamonds : diamonds.slice(0, mobileLimit);

  return (
    <>
    <div className="pt-8 md:pt-12 pb-12 md:pb-28 px-4 md:px-8" style={{ backgroundColor: "#000000" }}>
      <style jsx>{`
        .diamond-scroll::-webkit-scrollbar { display: none; }
        .shape-scroll::-webkit-scrollbar { display: none; }
        @keyframes loadSlide { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="gradient-text font-bodoni text-[28px] md:text-[48px] font-normal">
          Your Perfect Stone
        </h2>
        <p className="font-outfit text-[13px] md:text-[14px] mt-3 md:mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          Search our global inventory of certified diamonds
        </p>
      </div>

      {/* ===== MOBILE FILTER BAR ===== */}
      <div className="md:hidden sticky top-0 z-30 pb-3" style={{ backgroundColor: "#000000" }}>
        {/* Type toggle + Filters button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex gap-2">
            {(["Diamond", "Lab_grown_Diamond"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilters((f) => ({ ...f, type: t }))}
                className="px-3 py-1.5 font-outfit text-[11px] uppercase border transition-all duration-200"
                style={{
                  letterSpacing: "0.08em",
                  borderColor: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.15)",
                  color: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.5)",
                  backgroundColor: filters.type === t ? "rgba(201,168,76,0.08)" : "transparent",
                }}
              >
                {t === "Diamond" ? "Natural" : "Lab"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="px-4 py-1.5 font-outfit text-[11px] uppercase border transition-all duration-200"
            style={{
              letterSpacing: "0.1em",
              borderColor: filtersOpen ? "#C9A84C" : "rgba(255,255,255,0.15)",
              color: filtersOpen ? "#C9A84C" : "rgba(255,255,255,0.5)",
            }}
          >
            Filters {filtersOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Result count */}
        {hasSearched && !loading && (
          <p className="font-outfit text-[11px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            {totalFound.toLocaleString()} diamond{totalFound !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Collapsible filter panel */}
        {filtersOpen && (
          <div className="py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Shapes — horizontal scroll */}
            <div className="shape-scroll flex overflow-x-auto gap-2 mb-4 pb-1" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {SHAPES.map((shape) => {
                const active = filters.shapes.includes(shape);
                return (
                  <button key={shape} onClick={() => toggleShape(shape)} className="flex-shrink-0 px-3 py-1.5 font-outfit text-[11px] uppercase border transition-all duration-200" style={{ letterSpacing: "0.06em", borderColor: active ? "#C9A84C" : "rgba(255,255,255,0.12)", color: active ? "#C9A84C" : "rgba(255,255,255,0.45)", backgroundColor: active ? "rgba(201,168,76,0.06)" : "transparent" }}>
                    {shape}
                  </button>
                );
              })}
            </div>

            {/* Filter inputs — 3 column compact grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Carat Min</label>
                <input type="number" step="0.01" placeholder="0.5" value={filters.sizeFrom} onChange={(e) => setFilters((f) => ({ ...f, sizeFrom: e.target.value }))} className={inputClass} style={{ fontSize: 12 }} />
              </div>
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Carat Max</label>
                <input type="number" step="0.01" placeholder="5.0" value={filters.sizeTo} onChange={(e) => setFilters((f) => ({ ...f, sizeTo: e.target.value }))} className={inputClass} style={{ fontSize: 12 }} />
              </div>
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Cut</label>
                <select value={filters.cut} onChange={(e) => setFilters((f) => ({ ...f, cut: e.target.value }))} className={`${selectClass} w-full`} style={{ ...selectStyle, fontSize: 12 }}>
                  {CUTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Color</label>
                <select value={filters.colorFrom} onChange={(e) => setFilters((f) => ({ ...f, colorFrom: e.target.value }))} className={`${selectClass} w-full`} style={{ ...selectStyle, fontSize: 12 }}>
                  <option value="">Any</option>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Clarity</label>
                <select value={filters.clarityFrom} onChange={(e) => setFilters((f) => ({ ...f, clarityFrom: e.target.value }))} className={`${selectClass} w-full`} style={{ ...selectStyle, fontSize: 12 }}>
                  <option value="">Any</option>
                  {CLARITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-outfit text-[9px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Price Max</label>
                <input type="number" placeholder="50000" value={filters.priceTo} onChange={(e) => setFilters((f) => ({ ...f, priceTo: e.target.value }))} className={inputClass} style={{ fontSize: 12 }} />
              </div>
            </div>

            {/* Apply + Reset */}
            <div className="flex items-center justify-between">
              <button onClick={() => setFiltersOpen(false)} className="px-5 py-2 font-outfit text-[11px] uppercase border border-montaire-gold text-montaire-gold transition-all duration-200" style={{ letterSpacing: "0.1em" }}>
                Apply Filters
              </button>
              <button onClick={resetFilters} className="font-outfit text-[11px] uppercase transition-colors hover:text-montaire-gold" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== DESKTOP FILTER BAR ===== */}
      <div
        className="hidden md:block sticky top-0 z-30 py-6 px-6 mb-8 mx-auto max-w-6xl"
        style={{ backgroundColor: "#000000", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex justify-center gap-2 mb-6">
          {(["Diamond", "Lab_grown_Diamond"] as const).map((t) => (
            <button key={t} onClick={() => setFilters((f) => ({ ...f, type: t }))} className="px-5 py-2 font-outfit text-[12px] uppercase border transition-all duration-200" style={{ letterSpacing: "0.1em", borderColor: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.15)", color: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.5)", backgroundColor: filters.type === t ? "rgba(201,168,76,0.08)" : "transparent" }} data-cursor="pointer">
              {t === "Diamond" ? "Natural" : "Lab-Grown"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {SHAPES.map((shape) => {
            const active = filters.shapes.includes(shape);
            return (
              <button key={shape} onClick={() => toggleShape(shape)} className="px-3.5 py-1.5 font-outfit text-[11px] uppercase border transition-all duration-200" style={{ letterSpacing: "0.08em", borderColor: active ? "#C9A84C" : "rgba(255,255,255,0.12)", color: active ? "#C9A84C" : "rgba(255,255,255,0.45)", backgroundColor: active ? "rgba(201,168,76,0.06)" : "transparent" }} data-cursor="pointer">
                {shape}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-5 gap-x-4 gap-y-4 max-w-5xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Carat Min</label>
              <input type="number" step="0.01" placeholder="0.5" value={filters.sizeFrom} onChange={(e) => setFilters((f) => ({ ...f, sizeFrom: e.target.value }))} className={inputClass} />
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Max</label>
              <input type="number" step="0.01" placeholder="5.0" value={filters.sizeTo} onChange={(e) => setFilters((f) => ({ ...f, sizeTo: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Color</label>
              <select value={filters.colorFrom} onChange={(e) => setFilters((f) => ({ ...f, colorFrom: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}><option value="">Any</option>{COLORS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>To</label>
              <select value={filters.colorTo} onChange={(e) => setFilters((f) => ({ ...f, colorTo: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}><option value="">Any</option>{COLORS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Clarity</label>
              <select value={filters.clarityFrom} onChange={(e) => setFilters((f) => ({ ...f, clarityFrom: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}><option value="">Any</option>{CLARITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>To</label>
              <select value={filters.clarityTo} onChange={(e) => setFilters((f) => ({ ...f, clarityTo: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}><option value="">Any</option>{CLARITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
          <div>
            <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Cut</label>
            <select value={filters.cut} onChange={(e) => setFilters((f) => ({ ...f, cut: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>{CUTS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Price Min</label>
              <input type="number" placeholder="500" value={filters.priceFrom} onChange={(e) => setFilters((f) => ({ ...f, priceFrom: e.target.value }))} className={inputClass} />
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Max</label>
              <input type="number" placeholder="50000" value={filters.priceTo} onChange={(e) => setFilters((f) => ({ ...f, priceTo: e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        {/* Desktop count */}
        {hasSearched && !loading && (
          <p className="hidden md:block font-outfit text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
            {totalFound.toLocaleString()} diamond{totalFound !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading bar */}
        {loading && (
          <div className="h-[1px] mb-4 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div className="h-full w-1/3 bg-montaire-gold" style={{ animation: "loadSlide 1s ease-in-out infinite" }} />
          </div>
        )}

        {/* ===== MOBILE GRID (2 columns, compact cards) ===== */}
        {diamonds.length > 0 && (
          <div ref={gridRef}>
            {/* Mobile */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {visibleDiamondsMobile.map((d) => {
                const img = getDiamondImage(d);
                return (
                  <div
                    key={d.id}
                    className="diamond-card flex flex-col border transition-all duration-200 active:border-[rgba(201,168,76,0.3)]"
                    style={{ backgroundColor: "#0A0A0A", borderColor: "rgba(255,255,255,0.04)", borderWidth: "0.5px", opacity: 0 }}
                    onClick={() => setDetail(d)}
                  >
                    <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#050505" }}>
                      {img ? (
                        <img src={img} alt={`${d.shape || ""} ${d.size || ""}ct`} className="w-full h-full object-contain" />
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"><path d="M6 3h12l3 6-9 12L3 9l3-6z" /><path d="M3 9h18" /></svg>
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col gap-0.5">
                      <p className="font-outfit text-[12px]" style={{ color: "#F5F5F0" }}>{d.shape || "Diamond"} {d.size ? `${d.size}ct` : ""}</p>
                      <p className="font-outfit text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{[d.color, d.clarity].filter(Boolean).join(" · ") || "—"}</p>
                      {d.cut && <p className="font-outfit text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{d.cut}</p>}
                      {d.lab && <p className="font-outfit text-[9px] uppercase mt-0.5" style={{ color: "#C9A84C" }}>{d.lab}</p>}
                      <p className="font-bodoni text-[14px] mt-1" style={{ color: d.total_sales_price ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>{formatPrice(d.total_sales_price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Mobile load more */}
            {!mobileShowAll && diamonds.length > mobileLimit && (
              <div className="md:hidden text-center mt-6">
                <button
                  onClick={() => setMobileShowAll(true)}
                  className="px-6 py-2.5 font-outfit text-[11px] uppercase border border-montaire-gold text-montaire-gold transition-all duration-200"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Load More ({diamonds.length - mobileLimit} more)
                </button>
              </div>
            )}

            {/* Desktop — horizontal scroll */}
            <div className="hidden md:flex diamond-scroll flex-row gap-4 overflow-x-auto transition-opacity duration-300" style={{ opacity: loading ? 0.4 : 1, scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
              {diamonds.map((d) => {
                const img = getDiamondImage(d);
                return (
                  <div
                    key={d.id}
                    className="diamond-card group flex flex-col border transition-all duration-300 hover:scale-[1.02] hover:border-[rgba(201,168,76,0.2)] flex-shrink-0"
                    style={{ backgroundColor: "#111", borderColor: "rgba(255,255,255,0.04)", borderWidth: "0.5px", opacity: 0, width: 280 }}
                  >
                    <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
                      {img ? (
                        <img src={img} alt={`${d.shape || ""} ${d.size || ""}ct`} className="w-full h-full object-contain" />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"><path d="M6 3h12l3 6-9 12L3 9l3-6z" /><path d="M3 9h18" /><path d="M12 21L8 9l4-6 4 6-4 12z" /></svg>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <p className="font-bodoni text-[16px]" style={{ color: "#F5F5F0" }}>{d.shape || "Diamond"} {d.size ? `${d.size}ct` : ""}</p>
                      <p className="font-outfit text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>{[d.color, d.clarity].filter(Boolean).join(" · ") || "—"}</p>
                      <p className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>{[d.cut, d.polish].filter(Boolean).join(" · ") || ""}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {d.lab && <span className="px-2 py-0.5 font-outfit text-[9px] uppercase border" style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C", letterSpacing: "0.06em" }}>{d.lab}</span>}
                      </div>
                      <p className="font-bodoni text-[20px] mt-auto pt-2" style={{ color: d.total_sales_price ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>{formatPrice(d.total_sales_price)}</p>
                      <button onClick={() => setDetail(d)} className="mt-2 py-2 font-outfit text-[10px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold" style={{ letterSpacing: "0.12em", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">View Details</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && hasSearched && diamonds.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <p className="font-outfit text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              No diamonds match your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

    </div>

    {/* Detail Modal — rendered outside main container */}
    {detail && (
      <div data-lenis-prevent className="fixed inset-0 z-[500] overflow-y-auto" style={{ backgroundColor: "#000000" }}>
        <div className="relative max-w-2xl w-full mx-auto px-4 md:px-10 py-5 md:py-10" style={{ minHeight: "100dvh" }}>
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 font-outfit text-[12px] uppercase transition-colors hover:text-montaire-gold min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}
              data-cursor="pointer"
            >
              Close
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-12 md:pt-0 md:items-start">
              {/* Image */}
              <div className="w-full md:w-1/2 aspect-square flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
                {getDiamondImage(detail) ? (
                  <img src={getDiamondImage(detail)!} alt="" className="w-full h-full object-contain" />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"><path d="M6 3h12l3 6-9 12L3 9l3-6z" /><path d="M3 9h18" /><path d="M12 21L8 9l4-6 4 6-4 12z" /></svg>
                )}
              </div>

              {/* Specs */}
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <h3 className="font-bodoni text-[22px] md:text-[24px]" style={{ color: "#F5F5F0" }}>
                  {detail.shape || "Diamond"} {detail.size ? `${detail.size}ct` : ""}
                </h3>
                <p className="font-bodoni text-[20px] md:text-[22px]" style={{ color: "#C9A84C" }}>
                  {formatPrice(detail.total_sales_price)}
                </p>

                {detail.lab && (
                  <span className="w-fit px-3 py-1 font-outfit text-[10px] uppercase border" style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C", letterSpacing: "0.08em" }}>
                    {detail.lab} Certified
                  </span>
                )}

                <div className="mt-2 flex flex-col gap-2">
                  {[
                    ["Shape", detail.shape],
                    ["Carat", detail.size ? `${detail.size}ct` : null],
                    ["Color", detail.color],
                    ["Clarity", detail.clarity],
                    ["Cut", detail.cut],
                    ["Polish", detail.polish],
                    ["Symmetry", detail.symmetry],
                    ["Fluorescence", detail.fluorescence_intensity],
                    ["Measurements", detail.measurements],
                    ["Depth %", detail.depth_percent ? `${detail.depth_percent}%` : null],
                    ["Table %", detail.table_percent ? `${detail.table_percent}%` : null],
                    ["Stock #", detail.stock_num],
                    ["Location", [detail.city, detail.country].filter(Boolean).join(", ") || null],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label as string} className="flex justify-between py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                        <span className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.8)" }}>{value}</span>
                      </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  {detail.cert_url && (
                    <a href={detail.cert_url} target="_blank" rel="noopener noreferrer" className="py-2.5 text-center font-outfit text-[11px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold" style={{ letterSpacing: "0.1em", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">View Certificate</a>
                  )}
                  {detail.video_url && (
                    <a href={detail.video_url} target="_blank" rel="noopener noreferrer" className="py-2.5 text-center font-outfit text-[11px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold" style={{ letterSpacing: "0.1em", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">View Video</a>
                  )}
                  <a
                    href={`mailto:hello@montaire.com?subject=Inquiry: ${detail.shape || "Diamond"} ${detail.size || ""}ct ${detail.color || ""} ${detail.clarity || ""}&body=I'm interested in this diamond (Stock: ${detail.stock_num || detail.id}).`}
                    className="py-2.5 text-center font-outfit text-[11px] uppercase border border-montaire-gold text-montaire-gold transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)]"
                    style={{ letterSpacing: "0.12em" }}
                    data-cursor="pointer"
                  >
                    Inquire About This Diamond
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
