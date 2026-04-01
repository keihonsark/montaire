import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <Intro />
      <ScrollProgress />

      <section id="home">
        <Hero />
      </section>

      <section id="philosophy">
        <Philosophy />
      </section>

      {/* Placeholder sections for future phases */}
      <section
        id="collection"
        className="h-screen flex items-center justify-center"
      >
        <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-outfit">
          Collection — Coming Phase 2
        </p>
      </section>

      <section
        id="custom"
        className="h-screen flex items-center justify-center"
      >
        <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-outfit">
          Build Your Own — Coming Phase 2
        </p>
      </section>

      <section
        id="diamonds"
        className="h-screen flex items-center justify-center"
      >
        <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-outfit">
          Diamonds — Coming Phase 2
        </p>
      </section>

      <section
        id="about"
        className="h-screen flex items-center justify-center"
      >
        <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-outfit">
          About — Coming Phase 2
        </p>
      </section>

      <section
        id="contact"
        className="h-screen flex items-center justify-center"
      >
        <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-outfit">
          Contact — Coming Phase 2
        </p>
      </section>
    </>
  );
}
