import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Collection from "@/components/Collection";
import Configurator from "@/components/Configurator";
import DiamondSearch from "@/components/DiamondSearch";
import Contact from "@/components/Contact";
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

      <Collection />
      <section id="configure" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 50%, #0A0A0A 100%)' }}>
        <Configurator />
      </section>
      <section id="diamonds" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)' }}>
        <DiamondSearch />
      </section>
      <Contact />
    </>
  );
}
