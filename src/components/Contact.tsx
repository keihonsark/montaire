"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightCaustics from "./LightCaustics";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current!.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const scrollToContactForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-white/10 py-3 font-outfit text-[15px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors duration-300";

  return (
    <section ref={sectionRef} id="contact" className="relative">
      <LightCaustics opacity={0.4} />

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative" style={{ zIndex: 2 }}>
        <div ref={headingRef} className="text-center flex flex-col items-center">
          <h2
            className="font-cormorant text-[36px] md:text-[48px] font-normal"
            style={{ color: "#F5F5F0" }}
          >
            Let&apos;s create something extraordinary.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              href="mailto:hello@montaire.com"
              className="px-8 py-3.5 font-outfit text-[12px] uppercase transition-all duration-300 hover:brightness-110 text-center"
              style={{
                letterSpacing: "0.15em",
                backgroundColor: "#C9A84C",
                color: "#0A0A0A",
              }}
              data-cursor="pointer"
            >
              Book a Consultation
            </a>
            <button
              onClick={scrollToContactForm}
              className="px-8 py-3.5 font-outfit text-[12px] uppercase border transition-all duration-300 hover:bg-montaire-gold hover:text-black text-center"
              style={{
                letterSpacing: "0.15em",
                borderColor: "#C9A84C",
                color: "#C9A84C",
              }}
              data-cursor="pointer"
            >
              Send a Message
            </button>
          </div>
        </div>
      </div>

      {/* Inline contact form */}
      {showForm && (
        <div
          ref={formSectionRef}
          className="max-w-lg mx-auto px-6 pb-24 relative"
          style={{ zIndex: 2 }}
        >
          {submitted ? (
            <div className="text-center py-12">
              <p className="font-cormorant text-[28px] font-normal" style={{ color: "#F5F5F0" }}>
                Message sent.
              </p>
              <p className="font-outfit text-[15px] mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <input type="text" name="name" placeholder="Name" required className={inputStyle} />
              <input type="email" name="email" placeholder="Email" required className={inputStyle} />
              <textarea
                name="message"
                rows={4}
                placeholder="Your message"
                required
                className={`${inputStyle} resize-none`}
              />
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
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {error && (
                <p className="font-outfit text-[14px] text-center" style={{ color: "#E57373" }}>{error}</p>
              )}
            </form>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 text-center relative" style={{ zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p
          className="font-cormorant text-[18px] uppercase"
          style={{ letterSpacing: "0.15em", color: "#C9A84C" }}
        >
          MONTAIRE
        </p>
        <p
          className="font-outfit text-[11px] mt-3"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          &copy; 2026 Montaire. All rights reserved.
        </p>
        <a
          href="#"
          className="font-outfit text-[11px] mt-2 inline-block hover:underline"
          style={{ color: "rgba(255,255,255,0.3)" }}
          data-cursor="pointer"
        >
          Instagram
        </a>
      </footer>
    </section>
  );
}
