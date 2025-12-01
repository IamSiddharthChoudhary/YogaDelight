"use client";

import Navbar from "@/src/components/navbar";
import type React from "react";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-mono min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      <div className="h-[10vh]">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-12">
              <div>
                <h2 className="text-4xl font-light mb-2">Get in Touch</h2>
                <p className="text-gray-400 text-sm space-mono-boldtracking-wider">
                  Let's connect and transform your wellness journey
                </p>
              </div>

              <div>
                <h3 className="space-mono-boldtext-sm tracking-wider text-gray-400 mb-4">
                  EMAIL
                </h3>
                <a
                  href="mailto:hello@yogadelight.com"
                  className="text-lg hover:text-indigo-300 transition-colors"
                >
                  csiddharth380@gmail.com
                </a>
              </div>

              <div>
                <h3 className="space-mono-boldtext-sm tracking-wider text-gray-400 mb-4">
                  PHONE
                </h3>
                <a
                  href="tel:+1234567890"
                  className="text-lg hover:text-indigo-300 transition-colors"
                >
                  +91 8920938135
                </a>
              </div>

              <div className="pt-8 border-t border-gray-700">
                <h3 className="space-mono-boldtext-sm tracking-wider text-gray-400 mb-6">
                  SOCIAL MEDIA
                </h3>
                <div className="space-y-4">
                  <a
                    href="https://www.linkedin.com/in/siddharth-choudhary-a5a0a8229/"
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <span className="text-xs">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block space-mono-boldtext-sm tracking-wider text-gray-400 mb-2"
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block space-mono-boldtext-sm tracking-wider text-gray-400 mb-2"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block space-mono-boldtext-sm tracking-wider text-gray-400 mb-2"
                >
                  SUBJECT
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block space-mono-boldtext-sm tracking-wider text-gray-400 mb-2"
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 space-mono-boldtext-lg rounded-lg border border-indigo-300 text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-300 hover:to-purple-200 hover:text-black hover:border-transparent transition-all active:scale-95"
                >
                  Send Message
                </button>

                {submitted && (
                  <p className="text-green-400 text-sm">
                    ✓ Message sent successfully!
                  </p>
                )}
              </div>
            </form>

            <div className="mt-16 pt-16 border-t border-gray-800">
              <h2 className="text-3xl font-light mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                    How do I get started with Yoga Delight?
                  </h3>
                  <p className="text-gray-400">
                    Simply take our personalized yoga assessment, and our AI
                    will recommend poses tailored to your body and goals.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                    Do I need prior yoga experience?
                  </h3>
                  <p className="text-gray-400">
                    Not at all! Our platform adapts to all levels, from complete
                    beginners to advanced practitioners.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                    How does the AI personalization work?
                  </h3>
                  <p className="text-gray-400">
                    Our system analyzes your body type, flexibility, strength,
                    and practice history to create customized sequences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                    Can I practice offline?
                  </h3>
                  <p className="text-gray-400">
                    Yes, you can download recommended sequences and practice
                    them anytime, anywhere without an internet connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
