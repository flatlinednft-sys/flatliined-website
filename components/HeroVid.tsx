"use client"

import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion"
import Image from "next/image"

export default function HeroVideo() {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const mouseVideoX = useTransform(springX, [-0.5, 0.5], [-20, 20])
  const mouseVideoY = useTransform(springY, [-0.5, 0.5], [-20, 20])
  const mouseTextX = useTransform(springX, [-0.5, 0.5], [20, -20])
  const mouseTextY = useTransform(springY, [-0.5, 0.5], [20, -20])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
    mass: 1.5,
  })

  const clampedProgress = useTransform(smoothScrollProgress, (v) =>
    Math.max(0, Math.min(1, v))
  )

  const scrollVideoY = useTransform(clampedProgress, [0, 1], [0, -140])

  const videoY = useTransform(
    [mouseVideoY, scrollVideoY],
    ([mY, sY]: number[]) => mY + sY
  )

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-video md:h-screen overflow-hidden bg-black rounded-b-[24px] md:rounded-b-[50px]"
    >
      {/* VIDEO BACKGROUND */}
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        style={{ x: mouseVideoX, y: videoY }}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      >
        <source src="/videos/output.mp4" type="video/mp4" />
      </motion.video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* STICKY TOP-LEFT LOGO */}
      <motion.div
        style={{
          mixBlendMode: "exclusion",
        }}
        className="fixed top-3 left-3 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50 pointer-events-none"
      >
        <Image
          src="/images/flatlined.svg"
          alt="Flatlined"
          width={220}
          height={73}
          priority
          className="w-16 sm:w-28 md:w-32 lg:w-36 h-auto"
        />
      </motion.div>

      {/* CENTER HERO LOGO */}
      <motion.div
        style={{
          x: mouseTextX,
          y: mouseTextY,
          mixBlendMode: "exclusion",
        }}
        className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none -rotate-[20deg]"
      >
        <Image
          src="/images/flatlined.svg"
          alt="Flatlined"
          width={1100}
          height={366}
          priority
          className="w-[70%] sm:w-[75%] md:w-[85%] max-w-[1200px] h-auto"
        />
      </motion.div>
    </div>
  )
}