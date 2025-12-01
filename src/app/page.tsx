"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "../components/hero";
import Desc from "../components/description";
import Feat from "../components/feat";
import { initLenis } from "../lib/lenis";
import { FAQ } from "../components/faq";
import { HowItWorks } from "../components/working";
import { Benefits } from "../components/benefits";

export default function Home() {
  useEffect(() => {
    const lenis = initLenis();
    return () => lenis.destroy();
  }, []);

  return (
    <div className="overflow-hidden bg-black">
      <Hero />
      <Desc />
      <Feat />
      <HowItWorks />
      <Benefits />
      <FAQ />
    </div>
  );
}
