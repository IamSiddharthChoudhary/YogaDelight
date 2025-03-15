"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number>(0);
  const [vidIndex, setVidIndex] = useState<number>(0);
  const [fade, setFade] = useState(false);
  const [blur, setBlur] = useState(false);
  const router = useRouter();

  const vids = [
    "/back.mp4",
    "/back5.mp4",
    "/back2.mp4",
    "/back4.mp4",
    "/back3.mp4",
  ];

  const strings = [
    "TRANSFORM \nYOUR MIND,BODY \n& SOUL.",
    "AI-POWERED\n YOGA,TAILORED\n FOR YOU.",
    "PERFECT YOUR\n POSE. FIND \nYOUR FLOW.",
    "PERSONALIZED\n YOGA FOR \nEVERY BODY.",
    "PATH TO WELLNESS\n,ONE POSE \nAT A TIME.",
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoTransition = () => {
      setFade(true);
      setBlur(true);

      setTimeout(() => {
        setVidIndex((prevIndex) => (prevIndex + 1) % vids.length);

        if (video) {
          const canPlayHandler = () => {
            video
              .play()
              .then(() => {
                setTimeout(() => {
                  setFade(false);
                  setBlur(false);
                }, 100);
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                setFade(false);
                setBlur(false);
              });

            video.removeEventListener("canplay", canPlayHandler);
          };

          video.addEventListener("canplay", canPlayHandler);

          video.load();
        }
      }, 400);
    };

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 1) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        handleVideoTransition();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [vids, vidIndex]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    hero.innerHTML = strings[index].replace(/\n/g, "<br>");

    const startTextCycle = () => {
      let iterations = 0;
      const currentIndex = index;
      const nextIndex = (currentIndex + 1) % strings.length;
      const nextText = strings[nextIndex];
      const nextTextLines = nextText.split("\n");

      const interval = setInterval(() => {
        const animatedLines = nextTextLines.map((line, lineIndex) => {
          return line
            .split("")
            .map((letter, i) => {
              if (i < iterations) {
                return letter;
              }
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");
        });

        hero.innerHTML = animatedLines.join("<br>");

        iterations += 1;

        if (
          iterations > Math.max(...nextTextLines.map((line) => line.length))
        ) {
          clearInterval(interval);
          setIndex(nextIndex);
        }
      }, 50);
    };

    const initialTimeout = setTimeout(startTextCycle, 3000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [index, strings]);

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col bg-gradient-to-b from-black to-gray-900">
      <nav className="w-full flex justify-between items-center p-5 px-6 md:px-10 lg:px-16 z-20">
        <div className="flex items-center gap-8 md:gap-12">
          <h1 className="montserrat-bold text-base">Contact</h1>
          <h1 className="montserrat-bold text-base">Home</h1>
        </div>

        <h1 className="zain-extrabold text-4xl md:text-5xl lg:text-5xl absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
          Yoga Delight
        </h1>

        <div className="flex items-center gap-8 md:gap-12">
          <h1 className="montserrat-bold text-base">About</h1>
          <h1 className="montserrat-bold text-base">Contact Us</h1>
        </div>
      </nav>

      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[3rem] lg:rounded-t-[4rem]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            fade ? "opacity-0" : "opacity-60"
          } ${blur ? "blur-xl" : "blur-0"}`}
        >
          <source src={vids[vidIndex]} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
          <div className="flex items-center justify-center mb-16">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl space-mono-bold font-mono text-center whitespace-pre-line break-words leading-tight"
              ref={heroRef}
            >
              {strings[0].replace(/\n/g, "<br>")}
            </h1>
          </div>

          <button
            className="montserrat-bold border border-white text-xl md:text-3xl rounded-xl p-2 px-6 hover:border-indigo-300 hover:text-black hover:bg-gradient-to-r from-indigo-300 to-purple-100 active:scale-95 transition-transform"
            onClick={() => {
              router.push("/yoga-check");
            }}
          >
            Pose Now
          </button>
        </div>
      </div>
    </main>
  );
}
