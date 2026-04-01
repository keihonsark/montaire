"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightCaustics from "./LightCaustics";

gsap.registerPlugin(ScrollTrigger);

const JEWELRY_TYPES = ["Ring", "Necklace", "Bracelet", "Earrings", "Other"];
const BUDGET_RANGES = ["Under $1K", "$1K–$3K", "$3K–$5K", "$5K–$10K", "$10K+"];
const TIMELINE_OPTIONS = ["No Rush", "1–2 Months", "Need by Specific Date"];

const STEPS = [
  { num: "01", title: "INSPIRE", desc: "Share photos, links, or just describe your dream piece" },
  { num: "02", title: "DESIGN", desc: "Our designers create detailed CAD renderings for your approval" },
  { num: "03", title: "CRAFT", desc: "Master jewelers handcraft your piece with precision" },
  { num: "04", title: "DELIVER", desc: "Your one-of-a-kind piece, finished and certified" },
];

export default function BuildYourOwn() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLSpanElement>(null);
  const craftRef = useRef<HTMLSpanElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [jewelryType, setJewelryType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Headline scroll animation
  useEffect(() => {
    if (!headlineRef.current || !visionRef.current || !craftRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        visionRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        craftRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Steps staggered animation
  useEffect(() => {
    if (!stepsRef.current) return;
    const ctx = gsap.context(() => {
      const stepEls = stepsRef.current!.querySelectorAll(".step-item");
      const lines = stepsRef.current!.querySelectorAll(".step-line");

      gsap.fromTo(
        stepEls,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        lines,
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const addLink = () => {
    if (linkInput.trim()) {
      setLinks((prev) => [...prev, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeLink = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("_source", "montaire-custom-design");
    formData.append("jewelry_type", jewelryType);
    formData.append("inspiration_links", links.join(", "));
    formData.append("budget", budget);
    formData.append("timeline", timeline);

    const form = e.target as HTMLFormElement;
    formData.append("vision", (form.elements.namedItem("vision") as HTMLTextAreaElement).value);
    formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("email", (form.elements.namedItem("email") as HTMLInputElement).value);
    formData.append("phone", (form.elements.namedItem("phone") as HTMLInputElement).value);

    const dateInput = form.elements.namedItem("date") as HTMLInputElement | null;
    if (dateInput?.value) formData.append("needed_by_date", dateInput.value);

    files.forEach((file) => formData.append("files", file));

    if (files.length > 0) {
      formData.append("files_count", String(files.length));
    }

    try {
      const res = await fetch("https://formspree.io/f/xpqodbdv", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-white/10 py-3 font-outfit text-[15px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors duration-300";

  return (
    <section ref={sectionRef} id="custom" className="relative">
      <LightCaustics opacity={0.5} />

      {/* ---- The Pitch ---- */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative" style={{ zIndex: 2 }}>
        <div ref={headlineRef} className="text-center">
          <h2 className="font-cormorant text-[36px] md:text-[56px] font-normal leading-tight">
            <span ref={visionRef} className="inline-block" style={{ opacity: 0 }}>
              Your vision.
            </span>{" "}
            <span ref={craftRef} className="inline-block" style={{ opacity: 0 }}>
              Our craft.
            </span>
          </h2>
          <p
            className="font-outfit text-[15px] md:text-[16px] font-light leading-relaxed mt-6 max-w-[500px] mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            From a sketch on a napkin to a Pinterest board to a dream you can&apos;t quite
            describe — we&apos;ll bring it to life.
          </p>
        </div>
      </div>

      {/* ---- Process Steps ---- */}
      <div
        ref={stepsRef}
        className="max-w-5xl mx-auto px-6 py-20 md:py-28 relative"
        style={{ zIndex: 2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex md:flex-col items-start md:items-center text-center relative">
              <div className="step-item flex flex-col items-center" style={{ opacity: 0 }}>
                <span
                  className="font-cormorant text-[48px] font-normal"
                  style={{ color: "#C9A84C", opacity: 0.2 }}
                >
                  {step.num}
                </span>
                <p
                  className="font-outfit text-[13px] uppercase mt-2"
                  style={{ letterSpacing: "0.2em", color: "#C9A84C" }}
                >
                  {step.title}
                </p>
                <p
                  className="font-outfit text-[14px] font-light mt-2 max-w-[200px]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {step.desc}
                </p>
              </div>
              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <>
                  {/* Desktop horizontal line */}
                  <div
                    className="step-line hidden md:block absolute top-[28px] right-0 h-[1px] w-[calc(100%-60px)]"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.2)",
                      left: "calc(50% + 30px)",
                      transformOrigin: "left",
                    }}
                  />
                  {/* Mobile vertical line */}
                  <div
                    className="step-line md:hidden absolute left-1/2 -translate-x-1/2 w-[1px] h-8"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.2)",
                      bottom: -32,
                      transformOrigin: "top",
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---- CTA ---- */}
      <div className="text-center py-16 relative" style={{ zIndex: 2 }}>
        <button
          onClick={scrollToForm}
          className="px-10 py-4 font-outfit text-[13px] uppercase transition-all duration-300 hover:brightness-110"
          style={{
            letterSpacing: "0.15em",
            backgroundColor: "#C9A84C",
            color: "#0A0A0A",
          }}
          data-cursor="pointer"
        >
          Start Your Design
        </button>
        <p className="font-outfit text-[13px] mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          Or call us at (559) 555-0100
        </p>
      </div>

      {/* ---- The Form ---- */}
      <div ref={formRef} className="max-w-2xl mx-auto px-6 py-20 md:py-28 relative" style={{ zIndex: 2 }}>
        {submitted ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-[28px] md:text-[36px] font-normal" style={{ color: "#F5F5F0" }}>
              Thank you.
            </p>
            <p className="font-outfit text-[15px] mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              We&apos;ll be in touch within 24 hours to discuss your vision.
            </p>
          </div>
        ) : (
          <>
            <h3
              className="font-cormorant text-[28px] md:text-[32px] font-normal text-center mb-12"
              style={{ color: "#F5F5F0" }}
            >
              Tell us about your vision
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* 1. Jewelry type */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  What are you looking for?
                </p>
                <div className="flex flex-wrap gap-2">
                  {JEWELRY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJewelryType(type)}
                      className="px-5 py-2 font-outfit text-[13px] border transition-all duration-200"
                      style={{
                        borderColor: jewelryType === type ? "#C9A84C" : "rgba(255,255,255,0.1)",
                        color: jewelryType === type ? "#C9A84C" : "rgba(255,255,255,0.5)",
                        backgroundColor: jewelryType === type ? "rgba(201,168,76,0.08)" : "transparent",
                        borderRadius: 20,
                      }}
                      data-cursor="pointer"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Upload inspiration */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Upload inspiration
                </p>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border border-dashed py-8 text-center transition-colors duration-200 hover:border-montaire-gold/40"
                  style={{ borderColor: "rgba(201,168,76,0.2)", cursor: "pointer" }}
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFiles}
                    />
                    <p className="font-outfit text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Drop images here or click to browse
                    </p>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {files.map((file, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 font-outfit text-[12px] border"
                        style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 12 }}
                      >
                        {file.name}
                        <button type="button" onClick={() => removeFile(i)} className="text-white/30 hover:text-white/60">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Inspiration links */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Inspiration links
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}
                    placeholder="Paste Pinterest, Instagram, or website links"
                    className={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-3 font-outfit text-[18px] transition-colors hover:text-montaire-gold"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    data-cursor="pointer"
                  >
                    +
                  </button>
                </div>
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {links.map((link, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 font-outfit text-[12px] border"
                        style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 12 }}
                      >
                        {link.length > 40 ? link.slice(0, 40) + "..." : link}
                        <button type="button" onClick={() => removeLink(i)} className="text-white/30 hover:text-white/60">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Describe your vision */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Describe your vision
                </p>
                <textarea
                  name="vision"
                  rows={4}
                  placeholder="Tell us everything — style, stones, metals, meaning behind the piece..."
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* 5. Budget */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Budget range
                </p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setBudget(range)}
                      className="px-5 py-2 font-outfit text-[13px] border transition-all duration-200"
                      style={{
                        borderColor: budget === range ? "#C9A84C" : "rgba(255,255,255,0.1)",
                        color: budget === range ? "#C9A84C" : "rgba(255,255,255,0.5)",
                        backgroundColor: budget === range ? "rgba(201,168,76,0.08)" : "transparent",
                        borderRadius: 20,
                      }}
                      data-cursor="pointer"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Timeline */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Timeline
                </p>
                <div className="flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTimeline(opt)}
                      className="px-5 py-2 font-outfit text-[13px] border transition-all duration-200"
                      style={{
                        borderColor: timeline === opt ? "#C9A84C" : "rgba(255,255,255,0.1)",
                        color: timeline === opt ? "#C9A84C" : "rgba(255,255,255,0.5)",
                        backgroundColor: timeline === opt ? "rgba(201,168,76,0.08)" : "transparent",
                        borderRadius: 20,
                      }}
                      data-cursor="pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {/* Date picker — smooth reveal */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: timeline === "Need by Specific Date" ? 80 : 0,
                    opacity: timeline === "Need by Specific Date" ? 1 : 0,
                  }}
                >
                  <input
                    type="date"
                    name="date"
                    className={`${inputStyle} mt-4`}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* 7. Your details */}
              <div>
                <p className="font-outfit text-[13px] uppercase mb-4" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
                  Your details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="text" name="name" placeholder="Name" required className={inputStyle} />
                  <input type="email" name="email" placeholder="Email" required className={inputStyle} />
                  <input type="tel" name="phone" placeholder="Phone" className={inputStyle} />
                </div>
              </div>

              {/* 8. Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 font-outfit text-[13px] uppercase transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                style={{
                  letterSpacing: "0.15em",
                  backgroundColor: "#C9A84C",
                  color: "#0A0A0A",
                }}
                data-cursor="pointer"
              >
                {submitting ? "Submitting..." : "Submit Your Design Request"}
              </button>

              {error && (
                <p className="font-outfit text-[14px] text-center" style={{ color: "#E57373" }}>
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
