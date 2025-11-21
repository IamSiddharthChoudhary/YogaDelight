"use client"

import Navbar from "@/src/components/navbar"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">

      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div>
                <h2 className="montserrat-bold text-sm tracking-wider text-gray-400 mb-6">SECTIONS</h2>
                <div className="space-y-4">
                  <button className="block text-lg font-light text-white hover:text-indigo-300 transition-colors text-left">
                    Mission
                  </button>
                  <button className="block text-lg font-light text-gray-400 hover:text-indigo-300 transition-colors text-left">
                    Our Team
                  </button>
                  <button className="block text-lg font-light text-gray-400 hover:text-indigo-300 transition-colors text-left">
                    Values
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-700">
                <h3 className="montserrat-bold text-sm tracking-wider text-gray-400 mb-4">SOCIAL</h3>
                <div className="flex gap-6">
                  <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-16">
            {/* Mission Section */}
            <section>
              <h1 className="text-5xl md:text-6xl font-light mb-8">
                Transforming Wellness Through{" "}
                <span className="bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
                  AI-Powered Yoga
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At Yoga Delight, we believe that personalized wellness is the future. Our mission is to make yoga
                accessible, engaging, and perfectly tailored to each individual's unique body, goals, and lifestyle.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                By combining cutting-edge artificial intelligence with ancient yoga wisdom, we've created a platform
                that understands your body, learns from your practice, and evolves with your journey toward better
                health and mindfulness.
              </p>
            </section>

            {/* Our Story Section */}
            <section className="pt-12 border-t border-gray-800">
              <h2 className="text-3xl md:text-4xl font-light mb-6">Our Story</h2>

              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  Founded in 2024, Yoga Delight was born from a simple observation: traditional yoga classes don't
                  account for individual differences. Whether you're a beginner with tight hamstrings or an advanced
                  practitioner seeking new challenges, everyone deserves a personalized experience.
                </p>

                <p className="leading-relaxed">
                  Our team of yoga instructors, AI specialists, and wellness experts came together to build something
                  revolutionary. We analyzed thousands of yoga practices, body types, and fitness levels to create an
                  intelligent system that recommends poses and sequences optimized just for you.
                </p>

                <p className="leading-relaxed">
                  Today, thousands of practitioners trust Yoga Delight to guide them toward stronger bodies, calmer
                  minds, and deeper spiritual connection. We're not just teaching yoga—we're personalizing the path to
                  wellness.
                </p>
              </div>
            </section>

            {/* Values Section */}
            <section className="pt-12 border-t border-gray-800">
              <h2 className="text-3xl md:text-4xl font-light mb-8">Our Core Values</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">Personalization</h3>
                  <p className="text-gray-400">
                    Every body is unique. We use AI to create truly customized practices for each individual.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">Accessibility</h3>
                  <p className="text-gray-400">
                    Yoga should be for everyone. We make wellness guidance affordable and available to all.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">Authenticity</h3>
                  <p className="text-gray-400">
                    We respect yoga's ancient roots while embracing modern innovation to enhance practice.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">Community</h3>
                  <p className="text-gray-400">
                    We foster a supportive community where practitioners inspire and learn from each other.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
