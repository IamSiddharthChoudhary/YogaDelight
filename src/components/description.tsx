"use client";

import {
  ArrowBigRight,
  ArrowLeftIcon,
  ArrowRightIcon,
  MoveLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const imageDivRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const imageUrls = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
    "/img6.jpg",
    "/img7.jpg",
    "/img8.jpg",
    "/img9.jpg",
    "/img10.jpg",
  ];

  useEffect(() => {
    let images: HTMLElement[] = [];
    if (imageDivRef.current) {
      images = Array.from(imageDivRef.current.children) as HTMLElement[];
    }

    let globalIndex = 0;
    let last = { x: 0, y: 0 };

    const distanceFromLast = (x: number, y: number) =>
      Math.hypot(x - last.x, y - last.y);

    const handleOnMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / 20) {
        const lead = images[globalIndex % images.length];

        if (lead) {
          lead.style.left = `${e.clientX}px`;
          lead.style.top = `${e.clientY}px`;
          lead.style.transform = `translate(-50%, -50%) scale(1.1)`;
          lead.style.opacity = "1";
          lead.style.transition =
            "opacity 0.4s ease-out, transform 0.4s ease-out";
          lead.dataset.status = "active";
        }

        last = { x: e.clientX, y: e.clientY };

        if (globalIndex > 5) {
          const tail = images[(globalIndex - 5) % images.length];
          tail.dataset.status = "inactive";
          tail.style.opacity = "0";
          tail.style.transform = `translate(-50%, -50%) scale(0.9)`;
        }

        globalIndex++;
      }
    };

    window.addEventListener("mousemove", handleOnMove);

    return () => window.removeEventListener("mousemove", handleOnMove);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col justify-end items-center w-screen h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white"
    >
      <div
        ref={imageDivRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
      >
        {imageUrls.map((img, idx) => (
          <div
            key={idx}
            className="opacity-0 absolute pointer-events-none transition-opacity duration-400"
            data-status="inactive"
            style={{
              width: "22vmin",
              height: "35vmin",
              transform: "translate(-50%, -50%) scale(1)",
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </div>

      <div className="space-mono-bold absolute h-full w-full z-10 flex flex-col justify-center items-center text-center gap-12">
        <h1 className="text-5xl md:text-7xl text-gray-200 tracking-wide leading-tight drop-shadow-lg">
          Get a Personalized <br />
          <span className="bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent p-3">
            <span className="logo inline-block leading-none pb-3">
              Yoga Recommendation
            </span>{" "}
            <span></span>
          </span>
        </h1>

        <button
          className="text-xl md:text-3xl px-8 py-3 rounded-xl border border-white shadow-lg transition-all duration-300 hover:border-indigo-300 hover:bg-gradient-to-r from-indigo-300 to-purple-200 hover:text-black active:scale-95"
          onClick={() => router.push("/yoga-recc")}
        >
          Try Now
        </button>
      </div>
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-sm md:text-base text-gray-400 opacity-70 animate-pulse">
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Move mouse for magic</span>
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </p>
    </div>
  );
}
