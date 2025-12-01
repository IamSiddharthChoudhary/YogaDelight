"use client";

import Navbar from "@/src/components/navbar";
import { useEffect, useState } from "react";

export default function About() {
  const [activeSection, setActiveSection] = useState("mission");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    document
      .querySelectorAll("section")
      .forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      <div className="h-[10vh]">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
          <aside className="space-mono-bold lg:col-span-1 hidden lg:block">
            <div className="sticky top-32 space-y-10">
              <div className="pt-8">
                <h3 className="text-sm tracking-wider text-gray-400 mb-4">
                  SOCIAL
                </h3>
                <div className="flex gap-6">
                  <a
                    href="https://www.linkedin.com/in/siddharth-choudhary-a5a0a8229/"
                    className="text-gray-400 hover:text-indigo-300 transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-mono lg:col-span-2 space-y-24">
            <section id="mission" className="scroll-mt-32">
              <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
                Transforming Wellness Through{" "}
                <span className="logo bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
                  AI-Powered Yoga
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At Yoga Delight, we believe that personalized wellness is the
                future. Our mission is to make yoga accessible, engaging, and
                perfectly tailored to each individual's unique body, goals, and
                lifestyle.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                By combining cutting-edge artificial intelligence with ancient
                yoga wisdom, we’ve created a platform that understands your
                body, learns from your practice, and evolves with your journey
                toward better health and mindfulness.
              </p>
            </section>

            <section
              id="story"
              className="pt-12 border-t border-gray-800 scroll-mt-32"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-8">
                Our Story
              </h2>

              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  Founded in 2024, Yoga Delight was born from a simple
                  observation: traditional yoga classes don't account for
                  individual differences. Everyone deserves a personalized
                  experience that grows with them.
                </p>

                <p className="leading-relaxed">
                  Our team of yoga instructors, AI specialists, and wellness
                  experts came together to build something revolutionary—
                  analyzing thousands of yoga practices, body types, and fitness
                  levels to craft a system that truly understands you.
                </p>

                <p className="leading-relaxed">
                  Today, thousands trust Yoga Delight to guide them toward
                  stronger bodies, calmer minds, and deeper spiritual
                  connection. This isn’t just yoga—it’s the future of
                  personalized wellness.
                </p>
              </div>
            </section>

            <section
              id="values"
              className="pt-12 border-t border-gray-800 scroll-mt-32"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-10">
                Our Core Values
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Personalization",
                    text: "We use AI to craft truly customized practices for every individual.",
                  },
                  {
                    title: "Accessibility",
                    text: "Yoga should be welcoming to all—our platform ensures that.",
                  },
                  {
                    title: "Authenticity",
                    text: "Honoring ancient yoga roots while embracing innovation.",
                  },
                  {
                    title: "Community",
                    text: "A warm, uplifting community of practitioners learning together.",
                  },
                ].map((value, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                  >
                    <h3 className="text-lg font-semibold mb-3 text-indigo-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {value.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
