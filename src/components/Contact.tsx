"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
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
    <section ref={sectionRef} id="contact">
      {/* CTA Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20 md:py-28">
        <div ref={ctaRef} className="text-center flex flex-col items-center">
          <p className="font-outfit text-[11px] uppercase mb-6" style={{ letterSpacing: "0.25em", color: "#C9A84C" }}>
            Ready to begin?
          </p>
          <h2 className="font-bodoni text-[32px] md:text-[40px] font-normal" style={{ color: "#F5F5F0" }}>
            Let&apos;s create something extraordinary.
          </h2>
          <p className="font-outfit text-[15px] font-light leading-[1.7] mt-6 max-w-xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            Every piece begins with a conversation. Tell us your vision — we&apos;ll handle the rest.
          </p>

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
      <footer className="px-6 md:px-10 pt-16 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Three column layout */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left */}
          <div className="text-center md:text-left">
            <p className="font-bodoni text-[16px] uppercase" style={{ letterSpacing: "0.15em", color: "#C9A84C" }}>MONTAIRE</p>
            <p className="font-outfit text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>Fine jewelry, made yours</p>
            <p className="font-outfit text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Handcrafted in California</p>
          </div>

          {/* Center */}
          <div className="text-center flex flex-col gap-2">
            {[
              { label: "Collection", href: "#collection" },
              { label: "Build Your Own", href: "#custom" },
              { label: "Diamonds", href: "#diamonds" },
              { label: "Process", href: "#process" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="font-outfit text-[12px] uppercase transition-colors duration-200 hover:text-[#C9A84C]" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="text-center md:text-right flex flex-col gap-2">
            <p className="font-outfit text-[12px] uppercase" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)" }}>Get in Touch</p>
            <a href="mailto:hello@montaire.com" className="font-outfit text-[12px] transition-colors duration-200 hover:text-[#C9A84C]" style={{ color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">hello@montaire.com</a>
            <a href="#" className="font-outfit text-[12px] transition-colors duration-200 hover:text-[#C9A84C]" style={{ color: "rgba(255,255,255,0.3)" }} data-cursor="pointer">Instagram</a>
            <p className="font-outfit text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>By Appointment Only</p>
            <p className="font-outfit text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Fresno, California</p>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1100px] mx-auto" style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }} />

        {/* Bottom bar */}
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <p className="font-outfit text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>&copy; 2026 Montaire. All rights reserved.</p>
          <p className="font-outfit text-[10px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>GIA Certified · Ethically Sourced · Insured Shipping · Lifetime Warranty</p>
          <a href="https://sark.agency" target="_blank" rel="noopener noreferrer" className="font-outfit text-[11px] transition-colors duration-200 hover:text-[#C9A84C]" style={{ color: "rgba(255,255,255,0.25)" }} data-cursor="pointer">Site by SARK Agency</a>
        </div>
      </footer>
    </section>
  );
}
