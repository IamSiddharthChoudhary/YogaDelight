import { Brain, Camera, CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [visible]);

  const steps = [
    {
      icon: <Camera className="w-16 h-16" />,
      number: "01",
      title: "Set Up Your Camera",
      description:
        "Position yourself in front of your device camera. Make sure your full body is visible in the frame.",
      detail: "Works with any webcam or smartphone",
    },
    {
      icon: <Brain className="w-16 h-16" />,
      title: "AI Analyzes Your Pose",
      number: "02",
      description:
        "Our advanced AI detects your body keypoints and analyzes your pose in real-time with precision.",
      detail: "Powered by computer vision technology",
    },
    {
      icon: <CheckCircle className="w-16 h-16" />,
      number: "03",
      title: "Get Instant Feedback",
      description:
        "Receive immediate corrections and guidance to perfect your alignment and improve your practice.",
      detail: "Real-time posture correction",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="space-mono w-full min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] lg:rounded-t-[4rem]"
    >
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div
        className={`max-w-6xl w-full z-10 transition-all duration-1000 transform ${
          visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="text-center mb-24 md:mb-32">
          {/* <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <span className="text-sm text-indigo-300 uppercase tracking-wider">
              The Process
            </span>
          </div> */}

          <h2 className="space-mono-bold text-4xl md:text-6xl font-bold mb-8 leading-tight md:leading-snug">
            How{" "}
            <span className="logo bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              pose detection
            </span>{" "}
            <br />
            works
          </h2>
          <p className="space-mono text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your yoga practice with AI-powered
            precision
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20"></div>
            <div
              className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-1000"
              style={{
                transform: `translateX(${activeStep * 100}%)`,
              }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center text-center transition-all duration-700 ${
                  activeStep === idx ? "scale-105" : "scale-100"
                }`}
                style={{
                  transitionDelay: visible ? `${idx * 200}ms` : "0ms",
                }}
              >
                <div className="relative mb-8 group">
                  <div
                    className={`w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center relative z-10 transition-all duration-500 ${
                      activeStep === idx
                        ? "shadow-2xl shadow-indigo-500/50 scale-110"
                        : "shadow-lg"
                    }`}
                  >
                    <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center">
                      <div
                        className={`transition-all duration-500 ${
                          activeStep === idx
                            ? "text-indigo-300 scale-110"
                            : "text-indigo-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {activeStep === idx && (
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping"></div>
                  )}

                  <div className="absolute -top-6 -right-6 text-7xl font-bold text-white/5 space-mono-bold select-none">
                    {step.number}
                  </div>

                  <div className="absolute -top-2 -left-2 w-3 h-3 bg-indigo-400 rounded-full opacity-60 animate-pulse"></div>
                  <div
                    className="absolute -bottom-2 -right-2 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                <div
                  className={`transition-all duration-500 ${
                    activeStep === idx ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 space-mono-bold">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs mb-4 text-base md:text-lg">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-xs md:text-sm text-indigo-300">
                      {step.detail}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="md:hidden mt-10 mb-6">
                    <svg
                      className="w-6 h-6 text-indigo-400 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-20">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeStep === idx
                  ? "w-12 h-3 bg-gradient-to-r from-indigo-500 to-purple-500"
                  : "w-3 h-3 bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
