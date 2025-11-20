import Lenis from "@studio-freight/lenis"

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.1,
    lerp: 0.07,
    wheelMultiplier: 1,
    touchMultiplier: 1.1,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  return lenis
}
