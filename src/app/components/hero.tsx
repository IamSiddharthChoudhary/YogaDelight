"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

const vids = ["/back.mp4", "/back5.mp4", "/back2.mp4", "/back4.mp4", "/back3.mp4"]

const strings = [
  "TRANSFORM \nYOUR MIND,BODY \n& SOUL.",
  "AI-POWERED\n YOGA,TAILORED\n FOR YOU.",
  "PERFECT YOUR\n POSE. FIND \nYOUR FLOW.",
  "PERSONALIZED\n YOGA FOR \nEVERY BODY.",
  "PATH TO WELLNESS\n,ONE POSE \nAT A TIME.",
]

export default function Page() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLHeadingElement>(null)
  const [index, setIndex] = useState(0)
  const [vidIndex, setVidIndex] = useState(0)
  const [fade, setFade] = useState(false)
  const [blur, setBlur] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoTransition = () => {
      setFade(true)
      setBlur(true)

      setTimeout(() => {
        setVidIndex((prev) => (prev + 1) % vids.length)

        if (video) {
          const canPlayHandler = () => {
            video
              .play()
              .then(() => {
                setTimeout(() => {
                  setFade(false)
                  setBlur(false)
                }, 100)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setFade(false)
                setBlur(false)
              })

            video.removeEventListener("canplay", canPlayHandler)
          }

          video.addEventListener("canplay", canPlayHandler)
          video.load()
        }
      }, 400)
    }

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 1) {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        handleVideoTransition()
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [vidIndex]) // Added vidIndex dependency to re-attach listener for new video

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    hero.innerHTML = strings[index].replace(/\n/g, "<br>")

    const startTextCycle = () => {
      let iterations = 0
      const currentIndex = index
      const nextIndex = (currentIndex + 1) % strings.length
      const nextText = strings[nextIndex]
      const nextTextLines = nextText.split("\n")

      const interval = setInterval(() => {
        const animatedLines = nextTextLines.map((line) => {
          return line
            .split("")
            .map((letter, i) => {
              if (i < iterations) {
                return letter
              }
              return letters[Math.floor(Math.random() * letters.length)]
            })
            .join("")
        })

        if (hero) {
          hero.innerHTML = animatedLines.join("<br>")
        }

        iterations += 1

        if (iterations > Math.max(...nextTextLines.map((line) => line.length))) {
          clearInterval(interval)
          setIndex(nextIndex)
        }
      }, 50)
    }

    const initialTimeout = setTimeout(startTextCycle, 3000)

    // Set up recurring cycle
    const cycleInterval = setInterval(() => {
      startTextCycle()
    }, 8000) // Adjust timing as needed

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(cycleInterval)
    }
  }, [index])

  return (
    <main className="w-full min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 overflow-x-hidden">
      <nav className="w-full flex justify-between items-center p-5 px-6 md:px-10 lg:px-16 z-20 fixed top-0 left-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-8 md:gap-12">
          <h1 className="montserrat-bold text-base text-white cursor-pointer hover:text-indigo-300 transition-colors">
            Contact
          </h1>
          <h1 className="montserrat-bold text-base text-white cursor-pointer hover:text-indigo-300 transition-colors">
            Home
          </h1>
        </div>

        <h1 className="zain-extrabold text-4xl md:text-5xl lg:text-5xl absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
          Yoga Delight
        </h1>

        <div className="flex items-center gap-8 md:gap-12">
          <h1 className="montserrat-bold text-base text-white cursor-pointer hover:text-indigo-300 transition-colors">
            About
          </h1>
          <h1 className="montserrat-bold text-base text-white cursor-pointer hover:text-indigo-300 transition-colors">
            Contact Us
          </h1>
        </div>
      </nav>

      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[4rem]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          poster="/placeholder.svg?height=1080&width=1920"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            fade ? "opacity-0" : "opacity-60"
          } ${blur ? "blur-xl" : "blur-0"}`}
        >
          <source src={vids[vidIndex]} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pt-20">
          <div className="flex items-center justify-center mb-16 min-h-[300px]">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl space-mono-bold font-mono text-center whitespace-pre-line break-words leading-tight text-white drop-shadow-lg"
              ref={heroRef}
            >
              {strings[0].replace(/\n/g, "<br>")}
            </h1>
          </div>

          <button
            className="montserrat-bold border border-white text-white text-xl md:text-3xl rounded-xl p-2 px-6 hover:border-indigo-300 hover:text-black hover:bg-gradient-to-r from-indigo-300 to-purple-100 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            onClick={() => {
              router.push("/yoga-check")
            }}
          >
            Pose Now
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>

    </main>
  )
}
