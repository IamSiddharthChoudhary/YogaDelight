"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "./components/hero";
import Desc from "./components/description";

export default function Home() {
  return (
    <div className="w-screen overflow-hidden bg-gray-950">
      <Hero />
      <Desc />
    </div>
  );
}
