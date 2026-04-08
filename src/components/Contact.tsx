"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TRUST_SIGNALS = [
  "GIA Certified Stones",
  "Insured Shipping",
  "Lifetime Warranty",
  "Handcrafted in California",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!aboutRef.current || !ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(aboutRef.current!.children, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: aboutRef.current, start: "top 75%", toggleActions: "play none none none" },
      });
      gsap.fromTo(ctaRef.current!.children, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 80%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  const scrollToContactForm = () => {
    setShowForm(true);
    setTimeout(() => { formSectionRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const data = {
      _source: "montaire-contact",
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("https://formspree.io/f/xpqodbdv", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/10 py-3 font-outfit text-[15px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors duration-300";

  const btnPrimary = "px-9 py-3.5 font-outfit text-[12px] uppercase border border-montaire-gold text-montaire-gold bg-transparent transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-montaire-gold-light active:scale-[0.98] text-center";

  const btnSecondary = "px-9 py-3.5 font-outfit text-[12px] uppercase border text-center transition-all duration-300 hover:border-montaire-gold hover:text-montaire-gold active:scale-[0.98]";

  return (
    <section ref={sectionRef} id="contact" className="relative" style={{ overflow: 'visible' }}>
      <div className="ambient-glow ambient-glow-gold" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }} />
      {/* About section merged in */}
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div ref={aboutRef} className="text-center max-w-2xl flex flex-col items-center">
          <p className="font-outfit text-[13px] md:text-[14px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>
            Montaire was founded on a simple belief:
          </p>
          <h2 className="font-bodoni text-[36px] md:text-[48px] font-normal mt-4" style={{ color: "#F5F5F0" }}>
            Fine jewelry should be personal.
          </h2>
          <p className="font-outfit text-[15px] md:text-[16px] font-light leading-[1.7] mt-6 max-w-xl" style={{ color: "rgba(255,255,255,0.4)" }}>
            Every piece we create begins with a conversation and ends with something extraordinary. Based in California, we work with clients worldwide to design and craft jewelry that tells their story.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12">
            {TRUST_SIGNALS.map((signal) => (
              <p key={signal} className="font-outfit text-[11px] md:text-[12px] uppercase" style={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>{signal}</p>
            ))}
          </div>

          {/* Gold divider */}
          <div className="mx-auto mt-16 mb-16" style={{ width: 80, height: 1, backgroundColor: "#C9A84C" }} />
        </div>
      </div>

      {/* Contact CTA */}
      <div className="flex flex-col items-center justify-center px-6 pb-20">
        <div ref={ctaRef} className="text-center flex flex-col items-center">
          <h3 className="font-bodoni text-[32px] md:text-[40px] font-normal" style={{ color: "#F5F5F0" }}>
            Let&apos;s create something extraordinary.
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="mailto:hello@montaire.com" className={btnPrimary} style={{ letterSpacing: "0.15em" }} data-cursor="pointer">
              Book a Consultation
            </a>
            <button onClick={scrollToContactForm} className={btnSecondary} style={{ letterSpacing: "0.15em", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }} data-cursor="pointer">
              Send a Message
            </button>
          </div>
        </div>
      </div>

      {/* Contact form */}
      {showForm && (
        <div ref={formSectionRef} className="max-w-lg mx-auto px-6 pb-24">
          {submitted ? (
            <div className="text-center py-12">
              <p className="font-bodoni text-[28px] font-normal" style={{ color: "#F5F5F0" }}>Message sent.</p>
              <p className="font-outfit text-[15px] mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <input type="text" name="name" placeholder="Name" required className={inputStyle} />
              <input type="email" name="email" placeholder="Email" required className={inputStyle} />
              <textarea name="message" rows={4} placeholder="Your message" required className={`${inputStyle} resize-none`} />
              <button
                type="submit"
                disabled={submitting}
                className={`w-full ${btnPrimary} disabled:opacity-50`}
                style={{ letterSpacing: "0.15em" }}
                data-cursor="pointer"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {error && <p className="font-outfit text-[14px] text-center" style={{ color: "#E57373" }}>{error}</p>}
            </form>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="py-16 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="font-bodoni text-[18px] uppercase" style={{ letterSpacing: "0.15em", color: "#C9A84C" }}>MONTAIRE</p>
        <div className="mx-auto mt-4 mb-4" style={{ width: 60, height: 1, backgroundColor: "rgba(201,168,76,0.3)" }} />
        <p className="font-outfit text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>&copy; 2026 Montaire. All rights reserved.</p>
        <a href="#" className="font-outfit text-[11px] mt-2 inline-block hover:underline" style={{ color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">Instagram</a>
      </footer>
    </section>
  );
}
