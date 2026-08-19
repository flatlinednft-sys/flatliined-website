"use client"

import { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

interface ScrollVelocityProps {
  svgSrc?: string
  svgAlt?: string
  baseVelocity?: number
  direction?: 1 | -1
  className?: string
  numCopies?: number
  heightClass?: string
  /** Gap between repeating items, e.g. "pr-16 md:pr-32" or "mr-24" */
  gapClass?: string
  /** Hex/rgb color to recolor the SVG via CSS mask, e.g. "#FFE600" or "#000000" */
  color?: string
}

export default function ScrollVelocity({
  svgSrc = "/images/velocity.svg",
  svgAlt = "Stats Banner",
  baseVelocity = 5,
  direction = 1,
  className = "",
  numCopies = 6,
  heightClass = "h-8 md:h-16",
  gapClass = "pr-80 md:pr-160", // Large gap between instances
  color,
}: ScrollVelocityProps) {
  const signedVelocity = baseVelocity * direction

  const baseX = useMotionValue(0)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 300,
  })

  const velocityFactor = useTransform(smoothVelocity, [-1200, 1200], [-6, 6], {
    clamp: false,
  })

  const spanPercent = 100 / numCopies
  const x = useTransform(baseX, (v) => `${wrap(-spanPercent, 0, v)}%`)

  const directionFactor = useRef(1)

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * signedVelocity * (delta / 1000)

    const vf = velocityFactor.get()

    if (vf < 0) directionFactor.current = -1
    else if (vf > 0) directionFactor.current = 1

    moveBy += directionFactor.current * moveBy * vf

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={`w-full overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex items-center whitespace-nowrap w-max" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) =>
          color ? (
            // Recolored via CSS mask — the SVG is used purely as the shape stencil,
            // filled with `color` instead of whatever's baked into the SVG file.
            <div
              key={i}
              className={`shrink-0 box-content ${gapClass} ${heightClass}`}
              style={{
                aspectRatio: "2500 / 500", // match your svg's actual viewBox ratio
                backgroundColor: color,
                WebkitMaskImage: `url(${svgSrc})`,
                maskImage: `url(${svgSrc})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
              }}
              role="img"
              aria-label={svgAlt}
            />
          ) : (
            <div key={i} className={`shrink-0 flex items-center ${gapClass} ${heightClass}`}>
              <img
                src={svgSrc}
                alt={svgAlt}
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </div>
          )
        )}
      </motion.div>
    </div>
  )
}