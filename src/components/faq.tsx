import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FAQ() {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const faqs = [
    {
      question: "Do I need any special equipment?",
      answer:
        "No special equipment required! Just a device with a camera, a yoga mat, and enough space to move freely. Our AI works with any standard webcam or smartphone camera.",
    },
    {
      question: "Is my camera data stored or shared?",
      answer:
        "Your privacy is our priority. All pose detection happens in real-time and no video footage is stored or shared. We only process the data needed to provide feedback during your session.",
    },
    {
      question: "What yoga poses are supported?",
      answer:
        "We currently support 5+ essential yoga poses including Tree Pose, Warrior Pose, Downward Dog, and more. We're constantly adding new poses based on user feedback and requests.",
    },
    {
      question: "Can beginners use this app?",
      answer:
        "Absolutely! Yoga Delight is designed for all levels. Our AI adapts to your skill level and provides appropriate guidance whether you're just starting or have years of experience.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "Our AI uses advanced computer vision and machine learning models trained on thousands of yoga poses. It provides accurate keypoint detection and alignment feedback comparable to having a personal instructor.",
    },
    {
      question: "Can I use this on mobile devices?",
      answer:
        "Yes! Yoga Delight works seamlessly on smartphones, tablets, and desktop computers. Just make sure you have a stable internet connection and camera access enabled.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-6 md:px-12 lg:px-24"
    >
      <div
        className={`max-w-4xl w-full transition-all duration-1000 transform ${
          visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="space-mono-bold text-5xl md:text-6xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="logo bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="space-mono text-xl text-gray-400">
            Everything you need to know about Yoga Delight
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-indigo-400"
              style={{
                transitionDelay: visible ? `${idx * 50}ms` : "0ms",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors duration-200"
              >
                <span className="text-lg md:text-xl font-semibold space-mono pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-indigo-300 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
