import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Collection from "@/components/Collection";
import BuildYourOwn from "@/components/BuildYourOwn";
import Diamonds from "@/components/Diamonds";
import About from "@/components/About";
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
      <BuildYourOwn />
      <Diamonds />
      <About />
      <Contact />
    </>
  );
}
