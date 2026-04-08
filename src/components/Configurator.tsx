"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import gsap from "gsap";
import BlueprintBackground from "./BlueprintBackground";

const PIECE_TYPES = ["Ring", "Necklace", "Bracelet", "Earrings", "Other"];
const PIECE_IMAGES: Record<string, string> = {
  Ring: "/images/configurator/ring.png",
  Necklace: "/images/configurator/necklace.png",
  Bracelet: "/images/configurator/bracelet.png",
  Earrings: "/images/configurator/earrings.png",
  Other: "/images/configurator/other.png",
};
const METALS = [
  { name: "14K Yellow Gold", gradient: "linear-gradient(135deg, #D4A437, #C9963C)" },
  { name: "18K Yellow Gold", gradient: "linear-gradient(135deg, #E8BF4A, #D4A437)" },
  { name: "14K White Gold", gradient: "linear-gradient(135deg, #C0C0C0, #E8E8E8)" },
  { name: "18K White Gold", gradient: "linear-gradient(135deg, #D8D8D8, #F0F0F0)" },
  { name: "14K Rose Gold", gradient: "linear-gradient(135deg, #D4948A, #E8A99F)" },
  { name: "18K Rose Gold", gradient: "linear-gradient(135deg, #C4786E, #D4948A)" },
  { name: "Platinum", gradient: "linear-gradient(135deg, #A8A8B0, #D0D0D8)" },
];
const STONE_SHAPES = ["Round", "Oval", "Emerald", "Cushion", "Pear", "Marquise", "Princess", "Radiant", "Asscher"];
const STONE_TYPES = ["Diamond", "Lab Diamond", "Moissanite", "Sapphire", "Emerald", "Ruby", "Other"];
const STONE_SIZES = ["0.5ct", "0.75ct", "1.0ct", "1.5ct", "2.0ct", "2.5ct", "3.0ct+"];
const SETTINGS = ["Solitaire", "Halo", "Three Stone", "Pavé Band", "Cathedral", "Vintage / Milgrain", "Totally Custom"];
const TIMELINES = ["No Rush — take your time", "1–2 Months", "I need it by..."];

interface Selections {
  type: string;
  metal: string;
  stoneType: string;
  stoneShape: string;
  stoneSize: string;
  settingStyle: string;
  ringSize: string;
  bandWidth: string;
  engraving: string;
  specialRequests: string;
  files: File[];
  links: string[];
  budget: number;
  timeline: string;
  date: string;
  name: string;
  email: string;
  phone: string;
}

interface AiResult {
  greeting: string;
  taste_compliment: string;
  design_summary: string;
  expert_recommendation: string;
  estimated_range: string;
  next_steps: string;
}

const TOTAL_STEPS = 9;

const btnPrimary =
  "px-9 py-3.5 font-outfit text-[12px] uppercase border border-montaire-gold text-montaire-gold bg-transparent transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-montaire-gold-light active:scale-[0.98]";
const btnSecondary =
  "px-9 py-3.5 font-outfit text-[12px] uppercase border transition-all duration-300 active:scale-[0.98]";
const inputClass =
  "w-full bg-transparent border-b border-white/10 py-3 font-outfit text-[15px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors duration-300";

export default function Configurator() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [linkInput, setLinkInput] = useState("");
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [sel, setSel] = useState<Selections>({
    type: "", metal: "", stoneType: "", stoneShape: "", stoneSize: "", settingStyle: "",
    ringSize: "", bandWidth: "Medium", engraving: "", specialRequests: "",
    files: [], links: [], budget: 5000, timeline: "", date: "",
    name: "", email: "", phone: "",
  });

  const update = (key: keyof Selections, value: string | number | File[] | string[]) => {
    setSel((prev) => ({ ...prev, [key]: value }));
  };

  const open = useCallback(() => {
    setIsOpen(true);
    setStep(1);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    document.body.style.overflow = "";
    setIsOpen(false);
    setStep(1);
    setAiResult(null);
    setAiLoading(false);
    setSubmitted(false);
  }, []);

  // Expose open function globally so CTAs can trigger it
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__openConfigurator = open;
    return () => { delete (window as unknown as Record<string, unknown>).__openConfigurator; };
  }, [open]);

  const animateStep = useCallback((dir: 1 | -1) => {
    if (!contentRef.current) return;
    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 0, x: dir * -30, duration: 0.2, ease: "power2.in" })
      .set(contentRef.current, { x: dir * 30 })
      .to(contentRef.current, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" });
  }, []);

  const next = () => {
    let nextStep = step + 1;
    if (step === 1 && (sel.type === "Earrings" || sel.type === "Other")) nextStep = 3;
    if (step === 2 && sel.type !== "Ring") nextStep = 3;
    if (step === 3 && sel.type !== "Ring") nextStep = 6;
    setStep(nextStep);
    animateStep(1);
  };

  const back = () => {
    let prevStep = step - 1;
    if (step === 3 && (sel.type === "Earrings" || sel.type === "Other")) prevStep = 1;
    if (step === 6 && sel.type !== "Ring") prevStep = 3;
    if (step === 3 && (sel.type === "Necklace" || sel.type === "Bracelet")) prevStep = 2;
    if (prevStep < 1) prevStep = 1;
    setStep(prevStep);
    animateStep(-1);
  };

  const generateAiSummary = async () => {
    setAiLoading(true);
    setAiError(false);

    const prompt = `You are a luxury jewelry concierge at Montaire, an exclusive custom jewelry house. A client has just completed their design consultation. Based on their selections below, generate a personalized design summary.

Your tone should be: warm, flattering, knowledgeable, and make the client feel like they have exquisite taste. Compliment their choices genuinely. Be specific about why their combination works well together.

Client selections:
- Piece type: ${sel.type}
- Metal: ${sel.metal || "Not specified"}
- Stone type: ${sel.stoneType || "Not specified"}
- Stone shape: ${sel.stoneShape || "Not specified"}
- Stone size: ${sel.stoneSize || "Not specified"}
- Setting style: ${sel.settingStyle || "Not specified"}
- Ring size: ${sel.ringSize || "Not specified"}
- Band width: ${sel.bandWidth}
- Engraving: ${sel.engraving || "None"}
- Budget range: $${sel.budget.toLocaleString()}
- Timeline: ${sel.timeline}
- Special requests: ${sel.specialRequests || "None"}
- Inspiration notes: ${sel.links.length > 0 ? sel.links.join(", ") : "None provided"}

Respond ONLY in JSON format with no markdown or backticks:
{"greeting":"A warm, personalized one-line greeting","taste_compliment":"A 2-3 sentence genuine compliment about their specific combination of choices.","design_summary":"A detailed 3-4 sentence description of their piece as if it already exists.","expert_recommendation":"A 2-sentence suggestion from our master jeweler.","estimated_range":"A price range string","next_steps":"A 1-2 sentence description of what happens next."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed: AiResult = JSON.parse(text);
      setAiResult(parsed);
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
      setStep(9);
      animateStep(1);
    }
  };

  const submitToFormspree = async () => {
    const body: Record<string, string> = {
      _source: "montaire-configurator",
      piece_type: sel.type,
      metal: sel.metal,
      stone_type: sel.stoneType,
      stone_shape: sel.stoneShape,
      stone_size: sel.stoneSize,
      setting_style: sel.settingStyle,
      ring_size: sel.ringSize,
      band_width: sel.bandWidth,
      engraving: sel.engraving,
      special_requests: sel.specialRequests,
      budget: `$${sel.budget.toLocaleString()}`,
      timeline: sel.timeline,
      date: sel.date,
      inspiration_links: sel.links.join(", "),
      name: sel.name,
      email: sel.email,
      phone: sel.phone,
    };
    if (aiResult) {
      body.ai_summary = aiResult.design_summary;
      body.ai_estimate = aiResult.estimated_range;
    }

    await fetch("https://formspree.io/f/xpqodbdv", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    setSubmitted(true);
  };

  const pill = (selected: boolean) => ({
    borderColor: selected ? "#C9A84C" : "rgba(255,255,255,0.1)",
    color: selected ? "#C9A84C" : "rgba(255,255,255,0.5)",
    backgroundColor: selected ? "rgba(201,168,76,0.08)" : "transparent",
  });

  if (!isOpen) {
    // Render the Build Your Own section inline
    return (
      <section id="custom" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* SVG blueprint background */}
        <BlueprintBackground />

        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#C9A84C]/15 pointer-events-none z-10" />
        <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[#C9A84C]/15 pointer-events-none z-10" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-[#C9A84C]/15 pointer-events-none z-10" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#C9A84C]/15 pointer-events-none z-10" />

        {/* Content */}
        <h2 className="relative z-10 font-bodoni text-[36px] md:text-[56px] font-normal text-center leading-tight" style={{ color: "#F5F5F0" }}>
          Your vision. Our craft.
        </h2>
        <p className="relative z-10 font-outfit text-[15px] md:text-[16px] font-light leading-relaxed mt-6 max-w-[500px] mx-auto text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
          From a sketch on a napkin to a Pinterest board to a dream you can&apos;t quite describe — we&apos;ll bring it to life.
        </p>
        <button
          onClick={open}
          className={`relative z-10 ${btnPrimary} mt-10`}
          style={{ letterSpacing: "0.15em" }}
          data-cursor="pointer"
        >
          Start Your Design
        </button>
        <p className="relative z-10 font-outfit text-[13px] mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          Or call us at (559) 555-0100
        </p>
      </section>
    );
  }

  // Fullscreen configurator overlay
  return (
    <>
      {/* Inline placeholder so page scroll IDs still work */}
      <section id="custom" className="h-0" />

      <div ref={overlayRef} className="fixed inset-0 z-[500] overflow-y-auto" style={{ backgroundColor: "#000000" }}>
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-end px-6 md:px-10 py-5" style={{ backgroundColor: "#000000" }}>
          <button onClick={close} className="font-outfit text-[12px] uppercase transition-colors duration-200 hover:text-white" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", padding: "8px 16px" }} data-cursor="pointer">
            Close
          </button>
        </div>

        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] z-20" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          <div className="h-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: "#C9A84C" }} />
        </div>

        {/* Content */}
        <div ref={contentRef} className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-2xl w-full">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-12" style={{ color: "#F5F5F0" }}>What are we creating?</h2>
                <div className="flex flex-col items-center gap-6">
                  {/* Top row: 3 cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[800px]">
                    {PIECE_TYPES.slice(0, 3).map((type) => (
                      <button
                        key={type}
                        onClick={() => { update("type", type); setTimeout(next, 400); }}
                        className="flex flex-col items-center justify-end p-6 transition-all duration-300 hover:scale-[1.04]"
                        style={{
                          aspectRatio: "3/4",
                          border: sel.type === type ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: sel.type === type ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <img src={PIECE_IMAGES[type]} alt={type} className="w-full flex-1 object-contain" />
                        <span className="font-outfit text-[13px] uppercase mt-4" style={{ letterSpacing: "0.15em", color: sel.type === type ? "#C9A84C" : "rgba(255,255,255,0.6)" }}>
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* Bottom row: 2 cards centered */}
                  <div className="grid grid-cols-2 gap-6 w-full max-w-[540px]">
                    {PIECE_TYPES.slice(3).map((type) => (
                      <button
                        key={type}
                        onClick={() => { update("type", type); setTimeout(next, 400); }}
                        className="flex flex-col items-center justify-end p-6 transition-all duration-300 hover:scale-[1.04]"
                        style={{
                          aspectRatio: "3/4",
                          border: sel.type === type ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: sel.type === type ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <img src={PIECE_IMAGES[type]} alt={type} className="w-full flex-1 object-contain" />
                        <span className="font-outfit text-[13px] uppercase mt-4" style={{ letterSpacing: "0.15em", color: sel.type === type ? "#C9A84C" : "rgba(255,255,255,0.6)" }}>
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Metal */}
            {step === 2 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-12" style={{ color: "#F5F5F0" }}>Choose your metal</h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {METALS.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => update("metal", m.name)}
                      className="flex flex-col items-center gap-3 transition-all duration-300"
                      data-cursor="pointer"
                    >
                      <div
                        className="w-16 h-16 rounded-full transition-all duration-300"
                        style={{
                          background: m.gradient,
                          border: sel.metal === m.name ? "2px solid #C9A84C" : "2px solid transparent",
                          boxShadow: sel.metal === m.name ? "0 0 12px rgba(201,168,76,0.3)" : "none",
                        }}
                      />
                      <span className="font-outfit text-[11px]" style={{ color: sel.metal === m.name ? "#C9A84C" : "rgba(255,255,255,0.4)" }}>
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Stone */}
            {step === 3 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10" style={{ color: "#F5F5F0" }}>Select your stone</h2>

                {/* Stone Type */}
                <p className="font-outfit text-[12px] uppercase mb-6" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Stone Type</p>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {STONE_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => update("stoneType", t)}
                      className="flex items-center justify-center font-outfit text-[12px] transition-all duration-300 hover:scale-[1.05]"
                      style={{
                        width: 110, height: 56,
                        border: sel.stoneType === t ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                        backgroundColor: "transparent",
                        boxShadow: sel.stoneType === t ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                        color: sel.stoneType === t ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      }}
                      data-cursor="pointer"
                    >{t}</button>
                  ))}
                </div>

                {/* Shape */}
                <p className="font-outfit text-[12px] uppercase mb-6" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Shape</p>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {STONE_SHAPES.map((s) => {
                    const selected = sel.stoneShape === s;
                    const strokeColor = selected ? "rgba(201,168,76,0.9)" : "rgba(201,168,76,0.5)";
                    const svgMap: Record<string, React.ReactNode> = {
                      Round: <circle cx="25" cy="25" r="20" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Oval: <ellipse cx="25" cy="25" rx="14" ry="22" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Emerald: <polygon points="10,5 40,5 45,15 45,35 40,45 10,45 5,35 5,15" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Cushion: <rect x="5" y="5" width="40" height="40" rx="10" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Pear: <path d="M25,3 C35,15 42,28 38,38 C34,46 16,46 12,38 C8,28 15,15 25,3Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Marquise: <ellipse cx="25" cy="25" rx="12" ry="24" stroke={strokeColor} strokeWidth="1.5" fill="none" transform="rotate(0,25,25)" />,
                      Princess: <><rect x="7" y="7" width="36" height="36" stroke={strokeColor} strokeWidth="1.5" fill="none" /><line x1="7" y1="7" x2="43" y2="43" stroke={strokeColor} strokeWidth="0.5" /><line x1="43" y1="7" x2="7" y2="43" stroke={strokeColor} strokeWidth="0.5" /></>,
                      Radiant: <polygon points="12,3 38,3 45,12 45,38 38,47 12,47 5,38 5,12" stroke={strokeColor} strokeWidth="1.5" fill="none" />,
                      Asscher: <><rect x="7" y="7" width="36" height="36" stroke={strokeColor} strokeWidth="1.5" fill="none" /><rect x="14" y="14" width="22" height="22" stroke={strokeColor} strokeWidth="0.5" fill="none" /><rect x="20" y="20" width="10" height="10" stroke={strokeColor} strokeWidth="0.5" fill="none" /></>,
                    };
                    return (
                      <button
                        key={s}
                        onClick={() => update("stoneShape", s)}
                        className="flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.05]"
                        style={{
                          width: 90, height: 110,
                          border: selected ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: selected ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <svg width="50" height="50" viewBox="0 0 50 50">{svgMap[s]}</svg>
                        <span className="font-outfit text-[10px]" style={{ color: selected ? "#C9A84C" : "rgba(255,255,255,0.5)" }}>{s}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Size */}
                <p className="font-outfit text-[12px] uppercase mb-6" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Size</p>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {STONE_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => update("stoneSize", s)}
                      className="flex items-center justify-center font-outfit text-[13px] transition-all duration-300 hover:scale-[1.05]"
                      style={{
                        width: 70, height: 70,
                        border: sel.stoneSize === s ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                        backgroundColor: "transparent",
                        boxShadow: sel.stoneSize === s ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                        color: sel.stoneSize === s ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      }}
                      data-cursor="pointer"
                    >{s}</button>
                  ))}
                </div>
                <p className="font-outfit text-[12px] italic mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>Don&apos;t worry — these are starting points. We&apos;ll refine every detail together during your consultation.</p>

              </div>
            )}

            {/* STEP 4: Setting */}
            {step === 4 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-12" style={{ color: "#F5F5F0" }}>Choose your setting</h2>
                <div className="flex flex-wrap justify-center gap-4 max-w-[700px] mx-auto">
                  {SETTINGS.map((s) => {
                    const selected = sel.settingStyle === s;
                    const sc = selected ? "#C9A84C" : "rgba(201,168,76,0.4)";
                    const settingSvg: Record<string, React.ReactNode> = {
                      "Solitaire": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" /><line x1="22" y1="35" x2="26" y2="18" stroke={sc} strokeWidth="1" /><line x1="38" y1="35" x2="34" y2="18" stroke={sc} strokeWidth="1" /><polygon points="26,18 30,10 34,18" stroke={sc} strokeWidth="1.5" fill="none" /></>,
                      "Halo": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" /><line x1="22" y1="35" x2="26" y2="18" stroke={sc} strokeWidth="1" /><line x1="38" y1="35" x2="34" y2="18" stroke={sc} strokeWidth="1" /><polygon points="26,18 30,10 34,18" stroke={sc} strokeWidth="1.5" fill="none" /><circle cx="23" cy="19" r="2" stroke={sc} strokeWidth="0.8" fill="none" /><circle cx="37" cy="19" r="2" stroke={sc} strokeWidth="0.8" fill="none" /><circle cx="30" cy="8" r="2" stroke={sc} strokeWidth="0.8" fill="none" /></>,
                      "Three Stone": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" /><polygon points="27,18 30,10 33,18" stroke={sc} strokeWidth="1.5" fill="none" /><line x1="23" y1="35" x2="27" y2="18" stroke={sc} strokeWidth="1" /><line x1="37" y1="35" x2="33" y2="18" stroke={sc} strokeWidth="1" /><polygon points="14,24 17,18 20,24" stroke={sc} strokeWidth="1" fill="none" /><line x1="12" y1="35" x2="14" y2="24" stroke={sc} strokeWidth="0.8" /><line x1="22" y1="35" x2="20" y2="24" stroke={sc} strokeWidth="0.8" /><polygon points="40,24 43,18 46,24" stroke={sc} strokeWidth="1" fill="none" /><line x1="38" y1="35" x2="40" y2="24" stroke={sc} strokeWidth="0.8" /><line x1="48" y1="35" x2="46" y2="24" stroke={sc} strokeWidth="0.8" /></>,
                      "Pavé Band": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" />{[10,16,22,28,34,40,46].map((cx) => <circle key={cx} cx={cx} cy="33" r="1.5" stroke={sc} strokeWidth="0.8" fill="none" />)}</>,
                      "Cathedral": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" /><path d="M22,35 C22,22 26,16 30,14" stroke={sc} strokeWidth="1.2" fill="none" /><path d="M38,35 C38,22 34,16 30,14" stroke={sc} strokeWidth="1.2" fill="none" /><polygon points="27,16 30,8 33,16" stroke={sc} strokeWidth="1.5" fill="none" /></>,
                      "Vintage / Milgrain": <><line x1="5" y1="35" x2="55" y2="35" stroke={sc} strokeWidth="1.5" />{[8,12,16,20,24,28,32,36,40,44,48,52].map((cx) => <circle key={cx} cx={cx} cy="37" r="0.8" fill={sc} />)}<polygon points="26,18 30,10 34,18" stroke={sc} strokeWidth="1.5" fill="none" /><line x1="22" y1="35" x2="26" y2="18" stroke={sc} strokeWidth="1" /><line x1="38" y1="35" x2="34" y2="18" stroke={sc} strokeWidth="1" /></>,
                      "Totally Custom": <><polygon points="30,5 33,18 46,18 35,26 39,39 30,30 21,39 25,26 14,18 27,18" stroke={sc} strokeWidth="1.5" fill="none" /></>,
                    };
                    return (
                      <button
                        key={s}
                        onClick={() => update("settingStyle", s)}
                        className="flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.05]"
                        style={{
                          width: 130, height: 110,
                          border: selected ? "1px solid #C9A84C" : s === "Totally Custom" ? "1px dashed rgba(201,168,76,0.3)" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: selected ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <svg width="60" height="40" viewBox="0 0 60 40">{settingSvg[s]}</svg>
                        <span className="font-outfit text-[10px]" style={{ color: selected ? "#C9A84C" : "rgba(255,255,255,0.5)" }}>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Details */}
            {step === 5 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>The details</h2>
                <div className="flex flex-col gap-8 max-w-md mx-auto">
                  <div>
                    <label className="font-outfit text-[12px] uppercase block mb-3" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Ring Size</label>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 19 }, (_, i) => String(4 + i * 0.5)).map((s) => (
                        <button
                          key={s}
                          onClick={() => update("ringSize", s)}
                          className="flex items-center justify-center font-outfit text-[12px] transition-all duration-300 hover:scale-[1.05]"
                          style={{
                            width: 55, height: 55,
                            border: sel.ringSize === s ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                            backgroundColor: "transparent",
                            boxShadow: sel.ringSize === s ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                            color: sel.ringSize === s ? "#C9A84C" : "rgba(255,255,255,0.5)",
                          }}
                          data-cursor="pointer"
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-outfit text-[12px] uppercase block mb-3" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Band Width</label>
                    <div className="flex gap-3">
                      {["Thin", "Medium", "Wide"].map((w) => (
                        <button key={w} onClick={() => update("bandWidth", w)} className="px-5 py-2.5 border rounded-full font-outfit text-[12px] transition-all duration-200" style={pill(sel.bandWidth === w)} data-cursor="pointer">{w}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-outfit text-[12px] uppercase block mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Engraving (optional)</label>
                    <input type="text" value={sel.engraving} onChange={(e) => update("engraving", e.target.value)} placeholder="Add a personal inscription" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-outfit text-[12px] uppercase block mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Special Requests</label>
                    <textarea value={sel.specialRequests} onChange={(e) => update("specialRequests", e.target.value)} rows={3} placeholder="Anything else we should know?" className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Inspiration */}
            {step === 6 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>Share your inspiration</h2>
                <div className="max-w-md mx-auto flex flex-col gap-8">
                  <div
                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) update("files", [...sel.files, ...Array.from(e.dataTransfer.files)]); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="border border-dashed py-10 text-center transition-colors duration-200 hover:border-montaire-gold/40"
                    style={{ borderColor: "rgba(201,168,76,0.2)" }}
                  >
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) update("files", [...sel.files, ...Array.from(e.target.files)]); }} />
                      <p className="font-outfit text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>Drop images or click to browse</p>
                    </label>
                  </div>
                  {sel.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sel.files.map((f, i) => (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 font-outfit text-[12px] border" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 12 }}>
                          {f.name}
                          <button type="button" onClick={() => update("files", sel.files.filter((_, j) => j !== i))} className="text-white/30 hover:text-white/60">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="url" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (linkInput.trim()) { update("links", [...sel.links, linkInput.trim()]); setLinkInput(""); } } }} placeholder="Paste Pinterest, Instagram, or website links" className={inputClass} />
                    <button type="button" onClick={() => { if (linkInput.trim()) { update("links", [...sel.links, linkInput.trim()]); setLinkInput(""); } }} className="px-3 font-outfit text-[18px] transition-colors hover:text-montaire-gold" style={{ color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">+</button>
                  </div>
                  {sel.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sel.links.map((link, i) => (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 font-outfit text-[12px] border" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 12 }}>
                          {link.length > 35 ? link.slice(0, 35) + "..." : link}
                          <button type="button" onClick={() => update("links", sel.links.filter((_, j) => j !== i))} className="text-white/30 hover:text-white/60">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center mt-6">
                  <button onClick={next} className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">Skip — my selections say it all</button>
                </div>
              </div>
            )}

            {/* STEP 7: Budget & Timeline */}
            {step === 7 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>Budget and timeline</h2>
                <div className="max-w-md mx-auto flex flex-col gap-10">
                  <div>
                    <p className="font-bodoni text-[32px] text-center mb-4" style={{ color: "#C9A84C" }}>${sel.budget.toLocaleString()}{sel.budget >= 50000 ? "+" : ""}</p>
                    <input
                      type="range" min={500} max={50000} step={500} value={sel.budget}
                      onChange={(e) => update("budget", Number(e.target.value))}
                      className="w-full accent-[#C9A84C]"
                      style={{ colorScheme: "dark" }}
                    />
                    <div className="flex justify-between font-outfit text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      <span>$500</span><span>$50,000+</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-outfit text-[12px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Timeline</p>
                    <div className="flex flex-col gap-3">
                      {TIMELINES.map((t) => (
                        <button
                          key={t}
                          onClick={() => update("timeline", t)}
                          className="px-5 py-3 border font-outfit text-[13px] text-left transition-all duration-200"
                          style={{
                            borderColor: sel.timeline === t ? "#C9A84C" : "rgba(255,255,255,0.06)",
                            color: sel.timeline === t ? "#C9A84C" : "rgba(255,255,255,0.5)",
                            backgroundColor: sel.timeline === t ? "rgba(201,168,76,0.05)" : "transparent",
                          }}
                          data-cursor="pointer"
                        >{t}</button>
                      ))}
                    </div>
                    {sel.timeline === "I need it by..." && (
                      <input type="date" value={sel.date} onChange={(e) => update("date", e.target.value)} className={`${inputClass} mt-4`} style={{ colorScheme: "dark" }} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Your Details */}
            {step === 8 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>Your details</h2>
                <div className="max-w-md mx-auto flex flex-col gap-6">
                  <input type="text" value={sel.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" required className={inputClass} />
                  <input type="email" value={sel.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" required className={inputClass} />
                  <input type="tel" value={sel.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" className={inputClass} />
                </div>
                <div className="flex justify-center gap-4 mt-10">
                  <button onClick={back} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Back</button>
                  <button
                    onClick={generateAiSummary}
                    className={btnPrimary}
                    style={{ letterSpacing: "0.15em" }}
                    data-cursor="pointer"
                  >
                    Generate My Design Summary
                  </button>
                </div>
              </div>
            )}

            {/* Shared bottom navigation for steps 2-7 */}
            {step >= 2 && step <= 7 && !submitted && (
              <div className="flex justify-center gap-4 mt-12">
                <button onClick={back} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Back</button>
                <button onClick={next} className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Continue</button>
              </div>
            )}

            {/* STEP 9: AI Result */}
            {step === 9 && (
              <div className="text-center">
                {aiLoading && (
                  <div className="py-20">
                    <div className="flex justify-center gap-2 mb-6">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-montaire-gold" style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                    <p className="font-outfit text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>Preparing your consultation...</p>
                    <style jsx>{`@keyframes pulse { 0%,100% { opacity:0.2;transform:scale(0.8) } 50% { opacity:1;transform:scale(1.2) } }`}</style>
                  </div>
                )}

                {submitted && (
                  <div className="py-20">
                    <h3 className="font-bodoni text-[32px] font-normal" style={{ color: "#F5F5F0" }}>Thank you.</h3>
                    <p className="font-outfit text-[15px] mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>We&apos;ll be in touch within 24 hours to discuss your vision.</p>
                    <button onClick={close} className={`${btnPrimary} mt-8`} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Close</button>
                  </div>
                )}

                {!aiLoading && !submitted && (
                  <div className="text-left max-w-xl mx-auto">
                    <p className="font-outfit text-[11px] uppercase text-center mb-8" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>Your Design Consultation</p>

                    {aiResult ? (
                      <>
                        <p className="font-bodoni text-[24px] md:text-[28px] text-center" style={{ color: "#C9A84C" }}>{aiResult.greeting}</p>
                        <p className="font-outfit text-[15px] leading-relaxed mt-4 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{aiResult.taste_compliment}</p>

                        <div className="w-16 h-[1px] mx-auto my-8" style={{ backgroundColor: "#C9A84C" }} />

                        <p className="font-outfit text-[11px] uppercase mb-3" style={{ letterSpacing: "0.15em", color: "#C9A84C" }}>Your Piece</p>
                        <p className="font-outfit text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.8)" }}>{aiResult.design_summary}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {[sel.type, sel.metal, sel.stoneType, sel.stoneShape, sel.stoneSize, sel.settingStyle].filter(Boolean).map((tag, i) => (
                            <span key={i} className="px-3 py-1 font-outfit text-[11px] border" style={{ borderColor: "rgba(201,168,76,0.2)", color: "#C9A84C", borderRadius: 12 }}>{tag}</span>
                          ))}
                        </div>

                        <p className="font-outfit text-[11px] uppercase mt-8 mb-3" style={{ letterSpacing: "0.15em", color: "#C9A84C" }}>Expert Recommendation</p>
                        <p className="font-outfit text-[15px] italic leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{aiResult.expert_recommendation}</p>

                        <p className="font-outfit text-[11px] uppercase mt-8 mb-3" style={{ letterSpacing: "0.15em", color: "#C9A84C" }}>Estimated Investment</p>
                        <p className="font-bodoni text-[28px] md:text-[32px]" style={{ color: "#C9A84C" }}>{aiResult.estimated_range}</p>

                        <div className="w-16 h-[1px] mx-auto my-8" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

                        <p className="font-outfit text-[14px] text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{aiResult.next_steps}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-outfit text-[15px] text-center mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                          Our team will review your selections and reach out within 24 hours.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[sel.type, sel.metal, sel.stoneType, sel.stoneShape, sel.stoneSize, sel.settingStyle, sel.bandWidth].filter(Boolean).map((tag, i) => (
                            <span key={i} className="px-3 py-1 font-outfit text-[11px] border" style={{ borderColor: "rgba(201,168,76,0.2)", color: "#C9A84C", borderRadius: 12 }}>{tag}</span>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                      <button onClick={submitToFormspree} className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Submit &amp; Book Consultation</button>
                      <button onClick={() => { setStep(1); setAiResult(null); animateStep(-1); }} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Refine My Choices</button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
