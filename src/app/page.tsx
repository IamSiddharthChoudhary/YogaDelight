"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "./components/hero";
import Desc from "./components/description";
import Feat from "./components/feat";

export default function Home() {
  return (
    <div className="overflow-hidden bg-black">
      <Hero />
      <Desc />
      <Feat/>
    </div>
  );
}
