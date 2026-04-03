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
    } catch {
      setDiamonds([]);
      setTotalFound(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Auto-search on any filter change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDiamonds();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDiamonds]);

  // Animate cards on load
  useEffect(() => {
    if (!gridRef.current || diamonds.length === 0) return;
    const cards = gridRef.current.querySelectorAll(".diamond-card");
    gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: "power2.out" });
  }, [diamonds]);

  const toggleShape = (shape: string) => {
    setFilters((f) => ({
      ...f,
      shapes: f.shapes.includes(shape) ? f.shapes.filter((s) => s !== shape) : [...f.shapes, shape],
    }));
  };


  return (
    <div className="py-20 md:py-28 px-4 md:px-8" style={{ backgroundColor: "#000000" }}>
      <style jsx>{`
        .diamond-scroll::-webkit-scrollbar { display: none; }
        @keyframes loadSlide { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
      `}</style>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="gradient-text font-bodoni text-[36px] md:text-[48px] font-normal">
          Your Perfect Stone
        </h2>
        <p className="font-outfit text-[14px] mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          Search our global inventory of certified diamonds
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="sticky top-0 z-30 py-6 px-4 md:px-6 mb-8 mx-auto max-w-6xl"
        style={{ backgroundColor: "#000000", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Type toggle */}
        <div className="flex justify-center gap-2 mb-6">
          {(["Diamond", "Lab_grown_Diamond"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilters((f) => ({ ...f, type: t }))}
              className="px-5 py-2 font-outfit text-[12px] uppercase border transition-all duration-200"
              style={{
                letterSpacing: "0.1em",
                borderColor: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.15)",
                color: filters.type === t ? "#C9A84C" : "rgba(255,255,255,0.5)",
                backgroundColor: filters.type === t ? "rgba(201,168,76,0.08)" : "transparent",
              }}
              data-cursor="pointer"
            >
              {t === "Diamond" ? "Natural" : "Lab-Grown"}
            </button>
          ))}
        </div>

        {/* Shapes */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {SHAPES.map((shape) => {
            const active = filters.shapes.includes(shape);
            return (
              <button
                key={shape}
                onClick={() => toggleShape(shape)}
                className="px-3.5 py-1.5 font-outfit text-[11px] uppercase border transition-all duration-200"
                style={{
                  letterSpacing: "0.08em",
                  borderColor: active ? "#C9A84C" : "rgba(255,255,255,0.12)",
                  color: active ? "#C9A84C" : "rgba(255,255,255,0.45)",
                  backgroundColor: active ? "rgba(201,168,76,0.06)" : "transparent",
                }}
                data-cursor="pointer"
              >
                {shape}
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-4 max-w-5xl mx-auto">
          {/* Carat */}
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

          {/* Color */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Color</label>
              <select value={filters.colorFrom} onChange={(e) => setFilters((f) => ({ ...f, colorFrom: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>
                <option value="">Any</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>To</label>
              <select value={filters.colorTo} onChange={(e) => setFilters((f) => ({ ...f, colorTo: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>
                <option value="">Any</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Clarity */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Clarity</label>
              <select value={filters.clarityFrom} onChange={(e) => setFilters((f) => ({ ...f, clarityFrom: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>
                <option value="">Any</option>
                {CLARITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>To</label>
              <select value={filters.clarityTo} onChange={(e) => setFilters((f) => ({ ...f, clarityTo: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>
                <option value="">Any</option>
                {CLARITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Cut */}
          <div>
            <label className="font-outfit text-[10px] uppercase block mb-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Cut</label>
            <select value={filters.cut} onChange={(e) => setFilters((f) => ({ ...f, cut: e.target.value }))} className={`${selectClass} w-full`} style={selectStyle}>
              {CUTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
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
        {/* Count */}
        {hasSearched && !loading && (
          <p className="font-outfit text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
            {totalFound.toLocaleString()} diamond{totalFound !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading bar */}
        {loading && (
          <div className="h-[1px] mb-4 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div className="h-full w-1/3 bg-montaire-gold" style={{ animation: "loadSlide 1s ease-in-out infinite" }} />
          </div>
        )}

        {/* Grid */}
        {diamonds.length > 0 && (
          <div
            ref={gridRef}
            className="diamond-scroll flex flex-row gap-4 overflow-x-auto transition-opacity duration-300"
            style={{ opacity: loading ? 0.4 : 1, scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {diamonds.map((d) => {
              const img = getDiamondImage(d);
              return (
                <div
                  key={d.id}
                  className="diamond-card group flex flex-col border transition-all duration-300 hover:scale-[1.02] hover:border-[rgba(201,168,76,0.2)] flex-shrink-0"
                  style={{ backgroundColor: "#111", borderColor: "rgba(255,255,255,0.04)", borderWidth: "0.5px", opacity: 0, width: 280 }}
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
                    {img ? (
                      <img src={img} alt={`${d.shape || ""} ${d.size || ""}ct`} className="w-full h-full object-contain" />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8">
                        <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
                        <path d="M3 9h18" />
                        <path d="M12 21L8 9l4-6 4 6-4 12z" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4 flex flex-col gap-1.5 flex-1">
                    <p className="font-bodoni text-[14px] md:text-[16px]" style={{ color: "#F5F5F0" }}>
                      {d.shape || "Diamond"} {d.size ? `${d.size}ct` : ""}
                    </p>
                    <p className="font-outfit text-[12px] md:text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {[d.color, d.clarity].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="font-outfit text-[11px] md:text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {[d.cut, d.polish].filter(Boolean).join(" · ") || ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {d.lab && (
                        <span className="px-2 py-0.5 font-outfit text-[9px] uppercase border" style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C", letterSpacing: "0.06em" }}>
                          {d.lab}
                        </span>
                      )}
                    </div>
                    <p className="font-bodoni text-[18px] md:text-[20px] mt-auto pt-2" style={{ color: d.total_sales_price ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>
                      {formatPrice(d.total_sales_price)}
                    </p>
                    <button
                      onClick={() => setDetail(d)}
                      className="mt-2 py-2 font-outfit text-[10px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold"
                      style={{ letterSpacing: "0.12em", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                      data-cursor="pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && hasSearched && diamonds.length === 0 && (
          <div className="text-center py-20">
            <p className="font-outfit text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              No diamonds match your criteria. Try adjusting your filters.
            </p>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10"
            style={{ backgroundColor: "#111", border: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 font-outfit text-[12px] uppercase transition-colors hover:text-montaire-gold"
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}
              data-cursor="pointer"
            >
              Close
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Image */}
              <div className="md:w-1/2 aspect-square flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
                {getDiamondImage(detail) ? (
                  <img src={getDiamondImage(detail)!} alt="" className="w-full h-full object-contain" />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8">
                    <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
                    <path d="M3 9h18" />
                    <path d="M12 21L8 9l4-6 4 6-4 12z" />
                  </svg>
                )}
              </div>

              {/* Specs */}
              <div className="md:w-1/2 flex flex-col gap-3">
                <h3 className="font-bodoni text-[24px]" style={{ color: "#F5F5F0" }}>
                  {detail.shape || "Diamond"} {detail.size ? `${detail.size}ct` : ""}
                </h3>
                <p className="font-bodoni text-[22px]" style={{ color: "#C9A84C" }}>
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
                    <a
                      href={detail.cert_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 text-center font-outfit text-[11px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold"
                      style={{ letterSpacing: "0.1em", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                      data-cursor="pointer"
                    >
                      View Certificate
                    </a>
                  )}
                  {detail.video_url && (
                    <a
                      href={detail.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 text-center font-outfit text-[11px] uppercase border transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold"
                      style={{ letterSpacing: "0.1em", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                      data-cursor="pointer"
                    >
                      View Video
                    </a>
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
    </div>
  );
}
