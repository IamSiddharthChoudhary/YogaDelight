"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "../components/hero";
import Desc from "../components/description";
import Feat from "../components/feat";
import { initLenis } from "../lib/lenis";

export default function Home() {

  useEffect(() => {
    const lenis = initLenis()
    return () => lenis.destroy()
  }, [])


  return (
    <div className="overflow-hidden bg-black">
      <Hero />
      <Desc />
      <Feat/>
    </div>
  );
}
