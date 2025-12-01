"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Eye,
  Users,
  TrendingUp,
  Camera,
  Brain,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

export function Benefits() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Real-Time Corrections",
      description:
        "Get instant feedback on your posture and alignment as you practice, ensuring perfect form every time.",
    },
    {
      icon: <Eye className="w-12 h-12" />,
      title: "Pose Detection",
      description:
        "Advanced AI recognizes your body position and provides accurate guidance for each yoga pose.",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Personalized Recommendations",
      description:
        "Receive tailored yoga pose suggestions based on your preferences and wellness goals.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "For All Levels",
      description:
        "Whether beginner or advanced, our AI adapts to your skill level and helps you grow.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="space-mono w-full min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-6 md:px-12 lg:px-24"
    >
      <div
        className={`max-w-7xl w-full transition-all duration-1000 transform ${
          visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="space-mono-bold text-5xl md:text-6xl font-bold mb-4">
            Why Choose{" "}
            <span className="logo bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
              Yoga Delight
            </span>
          </h2>
          <p className="space-mono text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the future of yoga with AI-powered guidance that
            transforms your practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-indigo-400"
              style={{
                transitionDelay: visible ? `${idx * 100}ms` : "0ms",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="text-indigo-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
