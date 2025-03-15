"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [mousemove, setMousemove] = useState<boolean>(false);
  const imageDivRef = useRef<HTMLDivElement>(null);
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
      setMousemove(true);
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
    return () => {
      window.removeEventListener("mousemove", handleOnMove);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
      <div
        className="absolute h-screen w-screen overflow-hidden opacity-40 pointer-events-none"
        ref={imageDivRef}
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

      <div className="absolute h-full w-full z-10 flex flex-col justify-center items-center text-center gap-12">
        <h1 className="font-extrabold text-5xl md:text-7xl text-gray-200 tracking-wide leading-tight drop-shadow-lg">
          Get a Personalized <br />
          <span className="bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
            Yoga Recommendation
          </span>
        </h1>

        <button
          className="text-xl md:text-3xl px-8 py-3 rounded-xl border border-white shadow-lg transition-all duration-300 hover:border-indigo-300 hover:bg-gradient-to-r from-indigo-300 to-purple-200 hover:text-black active:scale-95"
          onClick={() => router.push("/yoga-recc")}
        >
          Try Now
        </button>
      </div>
    </div>
  );
}
