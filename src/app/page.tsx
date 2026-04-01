import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Collection from "@/components/Collection";
import Configurator from "@/components/Configurator";
import Diamonds from "@/components/Diamonds";
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
      <Configurator />
      <Diamonds />
      <Contact />
    </>
  );
}
