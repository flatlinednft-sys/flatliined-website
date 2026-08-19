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

  const springConfig = { damping: 25, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Reduced mouse displacement range from [-20, 20] to [-8, 8]
  const mouseVideoX = useTransform(springX, [-0.5, 0.5], [-8, 8])
  const mouseVideoY = useTransform(springY, [-0.5, 0.5], [-8, 8])
  const mouseTextX = useTransform(springX, [-0.5, 0.5], [8, -8])
  const mouseTextY = useTransform(springY, [-0.5, 0.5], [8, -8])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 90,
    mass: 1,
  })

  const clampedProgress = useTransform(smoothScrollProgress, (v) =>
    Math.max(0, Math.min(1, v))
  )

  // Reduced scroll translation from -140 to -30 so video moves much slower
  const scrollVideoY = useTransform(clampedProgress, [0, 1], [0, -30])

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
      className="relative w-full aspect-video md:h-[90vh] overflow-hidden bg-black rounded-b-[20px] md:rounded-b-[40px]"
    >
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

      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        style={{ mixBlendMode: "exclusion" }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50 pointer-events-none"
      >
        <Image
          src="/images/flatlined.svg"
          alt="Flatlined"
          width={220}
          height={73}
          priority
          className="w-16 sm:w-24 md:w-32 lg:w-36 h-auto"
        />
      </motion.div>

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
          className="w-[70%] sm:w-[75%] md:w-[85%] max-w-[1100px] h-auto"
        />
      </motion.div>
    </div>
  )
}