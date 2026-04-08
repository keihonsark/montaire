"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import gsap from "gsap";

const PIECE_TYPES = ["Ring", "Necklace", "Bracelet", "Earrings", "Other"];
const PIECE_IMAGES: Record<string, string> = {
  Ring: "/images/configurator/ring.png",
  Necklace: "/images/configurator/necklace.png",
  Bracelet: "/images/configurator/bracelet.png",
  Earrings: "/images/configurator/earrings.png",
  Other: "/images/configurator/other.png",
};
const SETTING_IMAGES: Record<string, string> = {
  "Solitaire": "/images/settings/solitaire.png",
  "Halo": "/images/settings/halo.png",
  "Three Stone": "/images/settings/three-stone.png",
  "Pavé Band": "/images/settings/pave.png",
  "Cathedral": "/images/settings/cathedral.png",
  "Vintage / Milgrain": "/images/settings/vintage.png",
  "Totally Custom": "/images/settings/custom.png",
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
  firstName: string;
  lastName: string;
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

const TOTAL_STEPS = 11;

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function capitalizeName(raw: string): string {
  return raw.trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "friend";
}

function getDesignResponse(sel: Selections): AiResult {
  const name = sel.firstName ? capitalizeName(sel.firstName) : "friend";

  // Greetings
  const greetings: Record<string, string[]> = {
    Ring: [
      `Oh, ${name}... you're about to make someone very, very speechless.`,
      `${name}, darling — this ring is going to stop traffic.`,
      `Well, ${name}, someone clearly has impeccable taste.`,
    ],
    Necklace: [
      `${name}, this necklace is going to be the reason people forget how to make eye contact.`,
      `Darling ${name}, you just designed something museum-worthy.`,
      `${name} — necks were literally invented for pieces like this.`,
    ],
    Bracelet: [
      `${name}, this bracelet is going to make every other wrist in the room feel underdressed.`,
      `Oh ${name}... this is dangerously elegant.`,
      `${name}, I hope you're ready for the compliments. They won't stop.`,
    ],
    Earrings: [
      `${name}, these earrings are going to outshine chandeliers.`,
      `Darling ${name}, people are going to lean in just to get a closer look.`,
      `${name} — ears everywhere are jealous and they don't even know it yet.`,
    ],
  };
  const defaultGreetings = [
    `${name}, you're not designing jewelry — you're designing a legacy.`,
    `Oh, ${name}... this is going to be talked about.`,
    `${name}, I've seen a lot of custom work, and this? This is special.`,
  ];
  const greeting = pick(greetings[sel.type] || defaultGreetings);

  // Taste compliment
  const metalCompliments: Record<string, string> = {
    Platinum: "Platinum — the metal of royalty and rocket ships. You clearly don't do things halfway.",
    "Rose Gold": "Rose gold? You have that effortless European sensibility that most people spend years trying to fake.",
    "Yellow Gold": "Classic yellow gold. You understand that real luxury doesn't chase trends — it sets them.",
    "White Gold": "White gold — refined, understated, devastating. You clearly know the power of quiet confidence.",
  };
  let metalComp = "";
  for (const [key, val] of Object.entries(metalCompliments)) {
    if (sel.metal.includes(key)) { metalComp = val; break; }
  }

  const shapeCompliments: Record<string, string> = {
    Round: "A round brilliant — the most light, the most fire, the most everything. Maximalist in the best possible way.",
    Emerald: "An emerald cut. Hall-of-mirrors drama. You clearly appreciate architecture as much as sparkle.",
    Oval: "An oval — elongated, elegant, and just a little bit unexpected. Like you, I suspect.",
    Cushion: "A cushion cut — soft enough to be romantic, brilliant enough to blind. Perfect tension.",
    Pear: "A pear shape — bold, unconventional, unforgettable. This isn't your grandmother's jewelry. Well, maybe if your grandmother was Audrey Hepburn.",
    Marquise: "A marquise — the cut that literally means 'aristocrat.' You don't need me to tell you that.",
    Princess: "A princess cut — geometric precision meets unbridled brilliance. Modern royalty, basically.",
    Radiant: "A radiant cut — it's called 'radiant' for a reason. All the fire, all the time.",
    Asscher: "An Asscher cut — Art Deco perfection. You have a vintage soul with contemporary confidence.",
  };
  const shapeComp = shapeCompliments[sel.stoneShape] || "";
  const fallbackComp = "Your combination speaks volumes about your taste — bold where it matters, refined everywhere else.";
  const taste_compliment = [metalComp, shapeComp].filter(Boolean).join(" ") || fallbackComp;

  // Engraving note
  const engraving_note = sel.engraving
    ? `Engraved with '${sel.engraving}' — because the best details are the ones only you know about. `
    : "";

  // Design summary
  const summaryTemplates: Record<string, string> = {
    Ring: `Picture this: a ${sel.stoneSize || "stunning"} ${sel.stoneShape || "brilliant"} ${sel.stoneType || "diamond"} catching light from every conceivable angle, cradled in a ${sel.settingStyle || "custom"} setting, forged in ${sel.metal || "precious metal"}. The band — ${sel.bandWidth || "perfectly proportioned"} — sits perfectly, as if it was always meant to be there. ${engraving_note}This isn't just a ring. It's a declaration.`,
    Necklace: `Imagine a ${sel.stoneType || "diamond"} pendant suspended on ${sel.metal || "precious metal"}, catching light with every breath. The kind of piece that makes a little black dress feel like couture. ${engraving_note}We're not making jewelry here — we're making a centerpiece for your life.`,
    Bracelet: `A ${sel.metal || "precious metal"} bracelet designed to move with you — fluid, luminous, impossible to ignore. ${engraving_note}This is the piece that makes people ask, 'where did you get that?' — and the answer is better than they expect.`,
    Earrings: `A pair of ${sel.stoneType || "diamond"} earrings set in ${sel.metal || "precious metal"}, designed to frame your face like a Renaissance painting that also happens to sparkle. ${engraving_note}Subtle? No. Stunning? Absolutely.`,
  };
  const design_summary = summaryTemplates[sel.type] ||
    `A fully custom ${sel.metal || "precious metal"} piece, designed from scratch around your exact vision. ${engraving_note}No catalog. No template. Just you, our master jewelers, and something the world has never seen before.`;

  // Expert recommendation
  const expert_recommendation = sel.type === "Ring"
    ? "Our master jeweler recommends scheduling a virtual consultation to dial in your exact proportions — it makes a world of difference in how the piece sits on the hand. We'll also walk you through stone options side-by-side."
    : "Our design director suggests a brief consultation to explore finishing options and fine-tune proportions. The difference between great and extraordinary is always in the details we refine together.";

  // Estimated range
  let estimated_range: string;
  if (sel.budget < 2000) estimated_range = "$1,500 – $3,000";
  else if (sel.budget < 5000) estimated_range = "$3,000 – $7,500";
  else if (sel.budget < 10000) estimated_range = "$7,500 – $15,000";
  else if (sel.budget < 25000) estimated_range = "$12,000 – $30,000";
  else if (sel.budget < 50000) estimated_range = "$25,000 – $60,000";
  else estimated_range = "$50,000+";

  // Next steps
  const next_steps = pick([
    "Our design director will personally review your selections and reach out within 24 hours. Prepare to be impressed.",
    "A member of our atelier team will be in touch within 24 hours to begin bringing this to life. The fun part starts now.",
    "We'll have a senior designer reach out within 24 hours. Consider this the beginning of something extraordinary.",
  ]);

  return { greeting, taste_compliment, design_summary, expert_recommendation, estimated_range, next_steps };
}

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
  const resultRef = useRef<HTMLDivElement>(null);
  const [linkInput, setLinkInput] = useState("");
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [sel, setSel] = useState<Selections>({
    type: "", metal: "", stoneType: "", stoneShape: "", stoneSize: "", settingStyle: "",
    ringSize: "", bandWidth: "Medium", engraving: "", specialRequests: "",
    files: [], links: [], budget: 5000, timeline: "", date: "",
    firstName: "", lastName: "", email: "", phone: "",
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

  // Step 11 cinematic reveal animation
  useEffect(() => {
    if (step !== 11 || !aiResult || aiLoading || submitted || !resultRef.current) return;
    const container = resultRef.current;
    const els = container.querySelectorAll("[data-reveal]");
    const tags = container.querySelectorAll("[data-reveal-tag]");
    const buttons = container.querySelectorAll("[data-reveal-btn]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Sparkle burst
      const sparkles: HTMLDivElement[] = [];
      for (let i = 0; i < 14; i++) {
        const dot = document.createElement("div");
        const size = 3 + Math.random() * 4;
        Object.assign(dot.style, {
          position: "absolute", top: "50%", left: "50%",
          width: `${size}px`, height: `${size}px`,
          borderRadius: "50%", backgroundColor: "#C9A84C",
          zIndex: "0", pointerEvents: "none", opacity: "0",
        });
        container.appendChild(dot);
        sparkles.push(dot);
        const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
        const dist = 80 + Math.random() * 120;
        tl.to(dot, {
          x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
          opacity: 0.8, duration: 0.4, ease: "power2.out",
        }, 0).to(dot, { opacity: 0, duration: 1.0, ease: "power2.in" }, 0.4);
      }

      // Sequential reveal
      els.forEach((el) => {
        const delay = parseFloat((el as HTMLElement).dataset.reveal || "0");
        const fromY = parseFloat((el as HTMLElement).dataset.revealY || "0");
        const fromScale = parseFloat((el as HTMLElement).dataset.revealScale || "1");
        const isLine = (el as HTMLElement).dataset.revealLine === "true";
        if (isLine) {
          tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, delay);
        } else {
          tl.fromTo(el, { opacity: 0, y: fromY, scale: fromScale }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }, delay);
        }
      });

      // Tags stagger
      if (tags.length > 0) {
        tl.fromTo(tags, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.3, ease: "power2.out" }, 2.2);
      }

      // Buttons
      if (buttons.length > 0) {
        tl.fromTo(buttons, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }, 5.2);
      }

      return () => { sparkles.forEach((s) => s.remove()); };
    }, container);

    return () => ctx.revert();
  }, [step, aiResult, aiLoading, submitted]);

  const changeStep = useCallback((targetStep: number, dir: 1 | -1) => {
    if (!contentRef.current) { setStep(targetStep); return; }
    gsap.to(contentRef.current, {
      opacity: 0, x: dir * -20, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setStep(targetStep);
        setTimeout(() => {
          if (!contentRef.current) return;
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: dir * 20 },
            { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
          );
        }, 50);
      },
    });
  }, []);

  const next = () => {
    let n = step + 1;
    // Earrings/Other skip metal (step 2) and setting (step 6)
    if (step === 1 && (sel.type === "Earrings" || sel.type === "Other")) n = 3;
    if (step === 5 && (sel.type === "Earrings" || sel.type === "Other")) n = 7;
    if (step === 5 && (sel.type === "Necklace" || sel.type === "Bracelet")) n = 7;
    // Ring goes through all steps including 6
    changeStep(n, 1);
  };

  const back = () => {
    let p = step - 1;
    if (step === 3 && (sel.type === "Earrings" || sel.type === "Other")) p = 1;
    if (step === 7 && (sel.type === "Earrings" || sel.type === "Other")) p = 5;
    if (step === 7 && (sel.type === "Necklace" || sel.type === "Bracelet")) p = 5;
    if (p < 1) p = 1;
    changeStep(p, -1);
  };

  const generateDesignSummary = () => {
    setAiLoading(true);
    changeStep(11, 1);
    setTimeout(() => {
      const result = getDesignResponse(sel);
      setAiResult(result);
      setAiLoading(false);
    }, 2500);
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
      first_name: sel.firstName,
      last_name: sel.lastName,
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
    return (
      <section id="custom" className="relative flex flex-col items-center justify-center px-6 pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        {/* Subtle background image */}
        <img src="/images/process/sketch.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.06 }} />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 150, background: "linear-gradient(to bottom, transparent, #000000)", zIndex: 1 }} />

        <h2 className="relative z-10 font-bodoni text-[40px] md:text-[64px] font-normal text-center leading-tight" style={{ color: "#F5F5F0" }}>
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
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="relative z-10 font-outfit text-[13px] mt-4 transition-colors duration-200 hover:text-[#C9A84C]"
          style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none" }}
          data-cursor="pointer"
        >
          Or reach out directly
        </button>
      </section>
    );
  }

  const fullName = `${sel.firstName} ${sel.lastName}`.trim();

  // Fullscreen configurator overlay
  return (
    <>
      {/* Inline placeholder so page scroll IDs still work */}
      <section id="custom" className="h-0" />

      <div ref={overlayRef} data-lenis-prevent className="fixed inset-0 z-[500] overflow-y-auto" style={{ backgroundColor: "#000000" }}>
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

            {/* STEP 1: What are we creating */}
            {step === 1 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-12" style={{ color: "#F5F5F0" }}>What are we creating?</h2>
                <div className="flex flex-col items-center gap-6">
                  {/* Top row: 3 cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[800px]">
                    {PIECE_TYPES.slice(0, 3).map((type) => (
                      <button
                        key={type}
                        onClick={() => { update("type", type); setTimeout(() => { const target = (type === "Earrings" || type === "Other") ? 3 : 2; changeStep(target, 1); }, 400); }}
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
                        onClick={() => { update("type", type); setTimeout(() => { const target = (type === "Earrings" || type === "Other") ? 3 : 2; changeStep(target, 1); }, 400); }}
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
                  {METALS.map((m) => {
                    const selected = sel.metal === m.name;
                    return (
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
                            border: selected ? "3px solid #C9A84C" : "2px solid transparent",
                            boxShadow: selected ? "0 0 20px rgba(201,168,76,0.4)" : "none",
                          }}
                        />
                        <span className="font-outfit text-[11px]" style={{ color: selected ? "#C9A84C" : "rgba(255,255,255,0.4)" }}>
                          {m.name}
                        </span>
                        {selected && (
                          <span className="font-outfit text-[10px] uppercase" style={{ letterSpacing: "0.1em", color: "#C9A84C" }}>Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>Each metal has its own character. Not sure? Our designers will help you decide.</p>
              </div>
            )}

            {/* STEP 3: Stone Type */}
            {step === 3 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10" style={{ color: "#F5F5F0" }}>What kind of stone?</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {STONE_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => update("stoneType", t)}
                      className="flex items-center justify-center font-outfit text-[12px] transition-all duration-300 hover:scale-[1.05]"
                      style={{
                        width: 120, height: 70,
                        border: sel.stoneType === t ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                        backgroundColor: "transparent",
                        boxShadow: sel.stoneType === t ? "0 0 20px rgba(201,168,76,0.12)" : "none",
                        color: sel.stoneType === t ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      }}
                      data-cursor="pointer"
                    >{t}</button>
                  ))}
                </div>
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>Every stone tells a different story. Lab diamonds and moissanite offer exceptional brilliance at a different price point.</p>
              </div>
            )}

            {/* STEP 4: Stone Shape */}
            {step === 4 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10" style={{ color: "#F5F5F0" }}>Choose your shape</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
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
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>The shape defines the personality of your piece. Round is timeless, emerald is architectural, pear is bold. There&apos;s no wrong answer.</p>
              </div>
            )}

            {/* STEP 5: Stone Size */}
            {step === 5 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10" style={{ color: "#F5F5F0" }}>How big are we going?</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
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
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>This is a starting point — not a commitment. We&apos;ll walk you through exact carat options during your consultation.</p>
              </div>
            )}

            {/* STEP 6: Setting */}
            {step === 6 && (
              <div className="text-center">
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-12" style={{ color: "#F5F5F0" }}>Choose your setting</h2>
                <div className="flex flex-col items-center gap-6 max-w-[900px] mx-auto">
                  {/* Top row: 3 cards (Solitaire, Halo, Three Stone) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[680px]">
                    {SETTINGS.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => update("settingStyle", s)}
                        className="flex flex-col items-center justify-end p-5 transition-all duration-300 hover:scale-[1.04]"
                        style={{
                          aspectRatio: "3/4",
                          border: sel.settingStyle === s ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: sel.settingStyle === s ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <img src={SETTING_IMAGES[s]} alt={s} className="w-full flex-1 object-contain" />
                        <span className="font-outfit text-[12px] uppercase mt-3" style={{ letterSpacing: "0.15em", color: sel.settingStyle === s ? "#C9A84C" : "rgba(255,255,255,0.6)" }}>{s}</span>
                      </button>
                    ))}
                  </div>
                  {/* Middle row: 3 cards (Pavé Band, Cathedral, Vintage/Milgrain) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[680px]">
                    {SETTINGS.slice(3, 6).map((s) => (
                      <button
                        key={s}
                        onClick={() => update("settingStyle", s)}
                        className="flex flex-col items-center justify-end p-5 transition-all duration-300 hover:scale-[1.04]"
                        style={{
                          aspectRatio: "3/4",
                          border: sel.settingStyle === s ? "1px solid #C9A84C" : "1px solid rgba(201,168,76,0.15)",
                          backgroundColor: "transparent",
                          boxShadow: sel.settingStyle === s ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <img src={SETTING_IMAGES[s]} alt={s} className="w-full flex-1 object-contain" />
                        <span className="font-outfit text-[12px] uppercase mt-3" style={{ letterSpacing: "0.15em", color: sel.settingStyle === s ? "#C9A84C" : "rgba(255,255,255,0.6)" }}>{s}</span>
                      </button>
                    ))}
                  </div>
                  {/* Bottom row: Totally Custom alone at wider width */}
                  <div className="w-full max-w-[400px]">
                    {SETTINGS.slice(6).map((s) => (
                      <button
                        key={s}
                        onClick={() => update("settingStyle", s)}
                        className="flex flex-col items-center justify-end p-5 transition-all duration-300 hover:scale-[1.04] w-full"
                        style={{
                          aspectRatio: "3/4",
                          border: sel.settingStyle === s ? "1px solid #C9A84C" : "1px dashed rgba(201,168,76,0.3)",
                          backgroundColor: "transparent",
                          boxShadow: sel.settingStyle === s ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                        }}
                        data-cursor="pointer"
                      >
                        <img src={SETTING_IMAGES[s]} alt={s} className="w-full flex-1 object-contain" />
                        <span className="font-outfit text-[12px] uppercase mt-3" style={{ letterSpacing: "0.15em", color: sel.settingStyle === s ? "#C9A84C" : "rgba(255,255,255,0.6)" }}>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Inspiration */}
            {step === 7 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>Share your inspiration</h2>
                <div className="max-w-md mx-auto flex flex-col gap-8">
                  <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center" style={{ color: "rgba(255,255,255,0.25)" }}>This helps us understand your aesthetic. Pinterest boards, Instagram saves, even a napkin sketch — anything goes.</p>
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
              </div>
            )}

            {/* STEP 8: Details */}
            {step === 8 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>The details</h2>
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mb-8" style={{ color: "rgba(255,255,255,0.25)" }}>The more you share, the closer we get to perfection on the first try.</p>
                <div className="flex flex-col gap-8 max-w-md mx-auto">
                  <div>
                    <label className="font-outfit text-[12px] uppercase block mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Ring Size</label>
                    <input type="text" value={sel.ringSize} onChange={(e) => update("ringSize", e.target.value)} placeholder="e.g. 7, 5.25, 3.75" className={inputClass} />
                    <p className="font-outfit text-[12px] italic mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Not sure? No problem — we&apos;ll help you find your perfect fit during your consultation.</p>
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
                    <label className="font-outfit text-[12px] uppercase block mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>Describe Your Dream Piece</label>
                    <textarea value={sel.specialRequests} onChange={(e) => update("specialRequests", e.target.value)} rows={3} placeholder="Paint us a picture — what does your perfect piece look like? Any details, feelings, or must-haves we should know about?" className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Budget & Timeline */}
            {step === 9 && (
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
                    <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>This helps us select the right stones and materials. Every budget gets our full creative attention.</p>
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

            {/* STEP 10: Your Details */}
            {step === 10 && (
              <div>
                <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mb-10 text-center" style={{ color: "#F5F5F0" }}>Your details</h2>
                <p className="font-outfit text-[13px] italic max-w-[500px] mx-auto text-center mb-8" style={{ color: "rgba(255,255,255,0.25)" }}>We&apos;ll only use this to discuss your design. No spam, ever.</p>
                <div className="max-w-md mx-auto flex flex-col gap-6">
                  <div className="flex gap-4">
                    <input type="text" value={sel.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="First Name" required className={inputClass} />
                    <input type="text" value={sel.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Last Name" required className={inputClass} />
                  </div>
                  <input type="email" value={sel.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" required className={inputClass} />
                  <input type="tel" value={sel.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" className={inputClass} />
                </div>
                <div className="flex justify-center gap-4 mt-10">
                  <button onClick={back} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Back</button>
                  <button
                    onClick={generateDesignSummary}
                    className={btnPrimary}
                    style={{ letterSpacing: "0.15em" }}
                    data-cursor="pointer"
                  >
                    Reveal My Consultation
                  </button>
                </div>
              </div>
            )}

            {/* Shared bottom navigation for steps 2-9 */}
            {step >= 2 && step <= 9 && !submitted && (
              <div className="flex justify-center gap-4 mt-12">
                <button onClick={back} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Back</button>
                {step === 7 ? (
                  <div className="flex gap-4">
                    <button onClick={next} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Skip</button>
                    <button onClick={next} className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Continue</button>
                  </div>
                ) : (
                  <button onClick={next} className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Continue</button>
                )}
              </div>
            )}

            {/* STEP 11: AI Result */}
            {step === 11 && (
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
                    <h3 className="font-bodoni text-[32px] font-normal" style={{ color: "#F5F5F0" }}>Thank you, {sel.firstName ? capitalizeName(sel.firstName) : "friend"}.</h3>
                    <p className="font-outfit text-[15px] mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>Your vision is in excellent hands. We&apos;ll be in touch within 24 hours — prepare to be impressed.</p>
                    <button onClick={close} className={`${btnPrimary} mt-8`} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Close</button>
                  </div>
                )}

                {!aiLoading && !submitted && (
                  <div ref={resultRef} className="relative max-w-[650px] mx-auto text-center">

                    {aiResult ? (
                      <div className="flex flex-col items-center gap-0">
                        {/* Diamond accent */}
                        <p data-reveal="0.0" data-reveal-y="0" className="text-[8px] mb-6" style={{ opacity: 0, color: "#C9A84C" }}>&#9670;</p>

                        {/* Header label */}
                        <p data-reveal="0.0" data-reveal-y="0" className="font-outfit text-[11px] uppercase mb-10" style={{ opacity: 0, letterSpacing: "0.2em", color: "#C9A84C" }}>Your Design Consultation</p>

                        {/* Exclusive watermark */}
                        <p data-reveal="0.3" data-reveal-y="0" className="font-outfit text-[11px] uppercase mb-4" style={{ opacity: 0, letterSpacing: "0.3em", color: "rgba(201,168,76,0.2)" }}>Designed exclusively for {fullName ? capitalizeName(fullName) : "you"}</p>

                        {/* Greeting — hero text with shimmer */}
                        <p data-reveal="0.5" data-reveal-y="20" className="gradient-text font-bodoni text-[36px] md:text-[48px] lg:text-[56px] font-normal mb-12 md:mb-16" style={{ opacity: 0 }}>{aiResult.greeting}</p>

                        {/* Gold line 1 */}
                        <div data-reveal="1.0" data-reveal-line="true" className="mx-auto mb-12 md:mb-16" style={{ opacity: 1, width: 80, height: 1, backgroundColor: "#C9A84C", transformOrigin: "center" }} />

                        {/* Taste compliment */}
                        <p data-reveal="1.3" data-reveal-y="15" className="font-outfit text-[16px] md:text-[18px] mb-12 md:mb-16 max-w-[550px] mx-auto" style={{ opacity: 0, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{aiResult.taste_compliment}</p>

                        {/* Gold line 2 */}
                        <div data-reveal="1.8" data-reveal-line="true" className="mx-auto mb-12 md:mb-16" style={{ opacity: 1, width: 80, height: 1, backgroundColor: "#C9A84C", transformOrigin: "center" }} />

                        {/* Your Piece label */}
                        <p data-reveal="2.0" data-reveal-y="0" className="font-outfit text-[11px] uppercase mb-4" style={{ opacity: 0, letterSpacing: "0.15em", color: "#C9A84C" }}>Your Piece</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          {[sel.type, sel.metal, sel.stoneType, sel.stoneShape, sel.stoneSize, sel.settingStyle].filter(Boolean).map((tag, i) => (
                            <span key={i} data-reveal-tag className="px-3 py-1 font-outfit text-[11px] border" style={{ opacity: 0, borderColor: "rgba(201,168,76,0.2)", color: "#C9A84C", borderRadius: 12 }}>{tag}</span>
                          ))}
                        </div>

                        {/* Design summary */}
                        <p data-reveal="2.6" data-reveal-y="15" className="font-outfit text-[16px] md:text-[18px] mb-12 md:mb-16 text-left" style={{ opacity: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>{aiResult.design_summary}</p>

                        {/* Gold line 3 */}
                        <div data-reveal="3.0" data-reveal-line="true" className="mx-auto mb-12 md:mb-16" style={{ opacity: 1, width: 80, height: 1, backgroundColor: "#C9A84C", transformOrigin: "center" }} />

                        {/* Expert recommendation */}
                        <p data-reveal="3.2" data-reveal-y="0" className="font-outfit text-[11px] uppercase mb-3" style={{ opacity: 0, letterSpacing: "0.15em", color: "#C9A84C" }}>Expert Recommendation</p>
                        <p data-reveal="3.3" data-reveal-y="10" className="font-outfit text-[15px] md:text-[17px] italic leading-relaxed mb-12 md:mb-16" style={{ opacity: 0, color: "rgba(255,255,255,0.5)" }}>{aiResult.expert_recommendation}</p>

                        {/* Estimated investment */}
                        <p data-reveal="3.6" data-reveal-y="0" className="font-outfit text-[11px] uppercase mb-3" style={{ opacity: 0, letterSpacing: "0.15em", color: "#C9A84C" }}>Estimated Investment</p>
                        <p data-reveal="3.8" data-reveal-y="0" data-reveal-scale="0.95" className="font-bodoni text-[24px] md:text-[28px] mb-2" style={{ opacity: 0, color: "#C9A84C" }}>{aiResult.estimated_range}</p>
                        <p data-reveal="3.9" data-reveal-y="0" className="font-outfit text-[11px] italic mb-12 md:mb-16" style={{ opacity: 0, color: "rgba(255,255,255,0.35)" }}>Final pricing confirmed during your personal consultation</p>

                        {/* Gold line 4 */}
                        <div data-reveal="4.2" data-reveal-line="true" className="mx-auto mb-12 md:mb-16" style={{ opacity: 1, width: 80, height: 1, backgroundColor: "rgba(255,255,255,0.06)", transformOrigin: "center" }} />

                        {/* Next steps */}
                        <p data-reveal="4.4" data-reveal-y="10" className="font-outfit text-[14px] leading-relaxed mb-10" style={{ opacity: 0, color: "rgba(255,255,255,0.5)" }}>{aiResult.next_steps}</p>

                        {/* Personal sign-off */}
                        <p data-reveal="4.8" data-reveal-y="10" className="font-bodoni text-[20px] md:text-[24px] italic mb-12 md:mb-16" style={{ opacity: 0, color: "#C9A84C" }}>We can&apos;t wait to create this with you, {sel.firstName ? capitalizeName(sel.firstName) : "friend"}.</p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button data-reveal-btn onClick={submitToFormspree} className={btnPrimary} style={{ opacity: 0, letterSpacing: "0.15em" }} data-cursor="pointer">Submit &amp; Book Consultation</button>
                          <button data-reveal-btn onClick={() => { setAiResult(null); changeStep(1, -1); }} className={btnSecondary} style={{ opacity: 0, letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Refine My Choices</button>
                        </div>
                      </div>
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
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                          <button onClick={submitToFormspree} className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">Submit &amp; Book Consultation</button>
                          <button onClick={() => { setAiResult(null); changeStep(1, -1); }} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }} data-cursor="pointer">Refine My Choices</button>
                        </div>
                      </>
                    )}

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
