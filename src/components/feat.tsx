"use client"

import { useEffect, useRef, useState } from "react"

export default function Feat() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="rounded-[2rem] md:rounded-[3rem] lg:rounded-t-[4rem]  w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-black opacity-50 pointer-events-none"></div>

      <div
        className={`max-w-6xl w-full z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24 transition-all duration-1000 transform ${
          visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Discover Your <br />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
              Inner Balance
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            Yoga Delight brings you a personalized yoga experience powered by AI. Whether you are a beginner or an
            advanced practitioner, our intelligent system adapts to your needs, helping you perfect your poses and find
            your flow.
          </p>
          <div className="flex gap-6 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-indigo-300">50+</span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">Poses</span>
            </div>
            <div className="w-px h-16 bg-gray-700"></div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-purple-300">AI</span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">Correction</span>
            </div>
            <div className="w-px h-16 bg-gray-700"></div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-indigo-300">24/7</span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">Access</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src="./portrait.jpg"
              alt="Yoga Pose"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/90 italic font-light text-lg">
                "Yoga is the journey of the self, through the self, to the self."
              </p>
              <p className="text-indigo-300 mt-2 font-medium">— The Bhagavad Gita</p>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}
