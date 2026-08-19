"use client"

/**
 * MagicBento
 * A bento-grid card with a mouse-tracked spotlight, glowing border,
 * subtle 3D tilt, magnetic pull toward the cursor, floating particles,
 * and a click ripple.
 *
 * Usage:
 *   <MagicBentoCard className="md:col-span-6" glowColor="#FFE600" clipShape="standard">
 *     ...content...
 *   </MagicBentoCard>
 *
 * Needs the companion stylesheet: import "./MagicBento.css" once, e.g. in layout.tsx
 */

import React, { useRef, useState, useCallback, useEffect, useMemo } from "react"

type ClipShape = "standard" | "inverted" | "flat"

interface MagicBentoCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  clipShape?: ClipShape
  glowColor?: string
  spotlightRadius?: number
  particleCount?: number
  enableTilt?: boolean
  enableMagnetism?: boolean
  enableParticles?: boolean
  enableBorderGlow?: boolean
  clickEffect?: boolean
  disableAnimations?: boolean
}

const clipPaths: Record<ClipShape, string> = {
  standard:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
  inverted:
    "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
  flat: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
}

export function MagicBentoCard({
  children,
  className = "",
  style,
  // Default to a true rectangle. "standard" / "inverted" clip corners on purpose —
  // only opt into those explicitly when you actually want the cut-corner look.
  clipShape = "flat",
  glowColor = "#FFE600",
  spotlightRadius = 350,
  particleCount = 8,
  enableTilt = true,
  enableMagnetism = true,
  enableParticles = true,
  enableBorderGlow = true,
  clickEffect = true,
  disableAnimations = false,
}: MagicBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const particleTimeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const isHoveredRef = useRef(false)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const rippleId = useRef(0)

  const glowRGB = useMemo(() => hexToRgb(glowColor), [glowColor])

  const clearParticles = useCallback(() => {
    particleTimeouts.current.forEach(clearTimeout)
    particleTimeouts.current = []
    particlesRef.current.forEach((p) => p.remove())
    particlesRef.current = []
  }, [])

  const spawnParticles = useCallback(() => {
    if (!cardRef.current || disableAnimations || !enableParticles) return
    const { width, height } = cardRef.current.getBoundingClientRect()

    for (let i = 0; i < particleCount; i++) {
      const timeout = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return
        const particle = document.createElement("div")
        particle.className = "magic-bento-particle"
        particle.style.background = glowColor
        particle.style.left = `${Math.random() * width}px`
        particle.style.top = `${Math.random() * height}px`
        cardRef.current.appendChild(particle)
        particlesRef.current.push(particle)

        requestAnimationFrame(() => {
          particle.style.opacity = "1"
          particle.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${
            -20 - Math.random() * 40
          }px) scale(1)`
        })

        const removeTimeout = setTimeout(() => {
          particle.style.opacity = "0"
          setTimeout(() => particle.remove(), 300)
        }, 1500 + Math.random() * 1000)
        particleTimeouts.current.push(removeTimeout)
      }, i * 100)
      particleTimeouts.current.push(timeout)
    }
  }, [disableAnimations, enableParticles, particleCount, glowColor])

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    spawnParticles()
  }, [spawnParticles])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    clearParticles()
    setSpotlight((s) => ({ ...s, opacity: 0 }))
    if (cardRef.current && enableTilt) {
      cardRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)"
    }
  }, [clearParticles, enableTilt])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (enableBorderGlow) setSpotlight({ x, y, opacity: 1 })

      if (enableTilt && !disableAnimations) {
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -6
        const rotateY = ((x - centerX) / centerX) * 6
        let transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.05
          const magnetY = (y - centerY) * 0.05
          transform += ` translate(${magnetX}px, ${magnetY}px)`
        }
        cardRef.current.style.transform = transform
      }
    },
    [enableBorderGlow, enableTilt, enableMagnetism, disableAnimations]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickEffect || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const size = Math.max(rect.width, rect.height) * 1.5
      const id = rippleId.current++
      setRipples((r) => [...r, { id, x, y, size }])
      setTimeout(() => {
        setRipples((r) => r.filter((rip) => rip.id !== id))
      }, 600)
    },
    [clickEffect]
  )

  useEffect(() => clearParticles, [clearParticles])

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      // "group" added so the corner-mark hover effect below actually triggers.
      // Base bg/border are only fallbacks — anything passed via `className`
      // (e.g. bg-[#FFE600] border-black) overrides them since it's appended last.
      // Base bg/border classes are only fallbacks for cards that don't pass their
      // own colors — but anything in `style` (below) always wins over Tailwind
      // classes since inline styles beat stylesheet rules regardless of build order.
      className={`magic-bento-card bento-card group relative overflow-hidden border border-[#FFE600]/30 bg-zinc-950/90 p-6 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_25px_rgba(255,230,0,0.15)] will-change-transform ${className}`}
      style={{ clipPath: clipPaths[clipShape], ...style }}
    >
      {/* Spotlight glow that follows the cursor */}
      {enableBorderGlow && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(${spotlightRadius}px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${glowRGB}, 0.18), transparent 80%)`,
          }}
        />
      )}

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] opacity-20" />

      {/* Corner marks, tinted to match glowColor so they work on any card color */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderColor: `rgba(${glowRGB}, 0.6)` }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderColor: `rgba(${glowRGB}, 0.6)` }}
      />

      {/* Click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="magic-bento-ripple"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: `radial-gradient(circle, rgba(${glowRGB},0.3) 0%, transparent 70%)`,
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "")
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16
  )
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
}

export default MagicBentoCard