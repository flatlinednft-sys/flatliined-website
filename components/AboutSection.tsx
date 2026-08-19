"use client"

import React, { useRef, useState, useEffect } from "react"

import MagicBentoCard from "./MagicBento"
import ScrollVelocity from "./ScrollVelocity"
import ScrollReveal from "./ScrollReveal"
import { useTheme } from "./ThemeContext"

const tiers = [
  { name: "Basic", pct: "60%", count: "3,333" },
  { name: "Rare", pct: "25%", count: "1,388" },
  { name: "Epic", pct: "12%", count: "666" },
  { name: "Legendary", pct: "3%", count: "168" },
]

const MAX_SUPPLY = Number(
  process.env.NEXT_PUBLIC_MAX_SUPPLY ?? 5555
)

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { isLight, accent } = useTheme()

  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!showToast) return

    const timer = setTimeout(() => {
      setShowToast(false)
    }, 3200)

    return () => clearTimeout(timer)
  }, [showToast])

  const handleOpenSeaClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault()
    setShowToast(true)
  }

  /* =========================================================
     COLORS
     ========================================================= */

  const cardBgColor = isLight ? "#000000" : "#d4ff00"
  const cardTextColor = isLight ? "#FFFFFF" : "#000000"
  const cardBorderColor = isLight ? "#FFFFFF" : "#000000"
  const cardGlowColor = isLight ? "#FFFFFF" : "#000000"

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBgColor,
    color: cardTextColor,
    borderColor: cardBorderColor,
  }

  const cardClass = "rounded-none overflow-hidden border"

  const textMuted = isLight ? "text-white/60" : "text-black/60"
  const textSubtle = isLight ? "text-white/75" : "text-black/75"
  const divider = isLight ? "border-white/25" : "border-black/25"
  const panelBg = isLight ? "bg-white/10" : "bg-black/10"

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-fit p-4 sm:p-6 md:p-16 pt-20 pb-16 rounded-none overflow-hidden ${
        isLight ? "bg-white text-black" : "bg-black text-white"
      }`}
    >

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}

        <ScrollReveal delay={0.1} amount={0.2}>
          <div className="flex items-center gap-2 mb-6">
            <span
              className="w-2 h-2 rounded-none"
              style={{ background: accent }}
            />

            <span
              className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase ${
                isLight ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              The Collection // System Overview
            </span>
          </div>
        </ScrollReveal>

        {/* STATS SVG */}

        <ScrollReveal delay={0.2} amount={0.2}>
          <div
            className="w-full max-w-4xl"
            style={{
              aspectRatio: "3000 / 500",
              backgroundColor: isLight ? "#000000" : "#d4ff00",
              WebkitMaskImage: "url(/images/stats.svg)",
              maskImage: "url(/images/stats.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
            }}
            role="img"
            aria-label="About Flatlined stats"
          />
        </ScrollReveal>

        <div className="h-6 md:h-10" />

        {/* DESCRIPTION */}

        <ScrollReveal delay={0.3} amount={0.2}>
          <div
            className="border-l-2 pl-4 max-w-3xl ml-auto mb-8 md:mb-12"
            style={{ borderColor: `${accent}66` }}
          >
            <p
              className={`font-mono text-[10px] md:text-sm lg:text-lg leading-relaxed uppercase tracking-wide text-justify ${
                isLight ? "text-zinc-600" : "text-zinc-300"
              }`}
            >
              5,555 operatives, handmade and pulled straight from the ground
              up. Built to survive, each unit carries its own identity, rank,
              and history. Distinct by design—no two flatline the same way.
            </p>
          </div>
        </ScrollReveal>

        {/* GRID */}

        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-5 auto-rows-[minmax(140px,auto)] grid-flow-dense">
          {/* =====================================================
              MINT CARD
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-6 lg:col-span-12"
            delay={0.1}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className="rounded-none overflow-hidden border-2 p-5 md:p-10 w-full"
              style={cardStyle}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="space-y-1 md:space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span
                      className="w-2 h-2 rounded-none"
                      style={{ background: cardTextColor }}
                    />

                    <span
                      className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold"
                      style={{ color: cardTextColor }}
                    >
                      [Execution // 01] Direct Secondary Protocol
                    </span>
                  </div>

                  <h3 className="font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight">
                    Acquire Flatlines
                  </h3>

                  <p
                    className="font-mono text-[10px] sm:text-xs uppercase max-w-xl"
                    style={{ color: cardTextColor, opacity: 0.7 }}
                  >
                    Access the primary market grid on OpenSea to recruit
                    flatlined operatives directly to your wallet.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:pr-2">
                  <div className="font-mono text-right hidden lg:block">
                    <span
                      className="text-[10px] block uppercase"
                      style={{ color: cardTextColor, opacity: 0.6 }}
                    >
                      Network Protocol
                    </span>

                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: cardTextColor }}
                    >
                      OPENSEA.IO // LIVE
                    </span>
                  </div>

                  <a
                    href="https://opensea.io/collection/your_collection"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenSeaClick}
                    className="opensea-btn relative group inline-flex items-center justify-center gap-2 pl-6 pr-5 py-3 md:py-4 rounded-none font-black text-sm md:text-lg uppercase tracking-wider w-full sm:w-auto border-2"
                    style={{
                      backgroundColor: cardTextColor,
                      color: cardBgColor,
                      borderColor: cardTextColor,
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                      Minting Soon
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </MagicBentoCard>
          </ScrollReveal>

          {/* =====================================================
              SYSTEM REGISTRATION
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-6 lg:col-span-8 row-span-1"
            delay={0.15}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className={`${cardClass} h-full flex flex-col justify-between p-5 md:p-8`}
              style={cardStyle}
            >
              <div className="flex justify-between items-start">
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest"
                  style={{ color: cardTextColor }}
                >
                  [System Reg // 02]
                </span>

                <span
                  className={`font-mono text-[9px] sm:text-[10px] uppercase ${textMuted}`}
                >
                  Status: Active
                </span>
              </div>

              <div className="my-4 md:my-6">
                <h3 className="font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter">
                  {MAX_SUPPLY.toLocaleString()}
                </h3>

                <p
                  className="font-mono text-[10px] sm:text-xs uppercase mt-1"
                  style={{ color: cardTextColor, opacity: 0.7 }}
                >
                  TOTAL OPERATIVES GENERATED
                </p>
              </div>

              <div
                className={`flex items-center justify-between border-t pt-3 md:pt-4 font-mono text-[9px] sm:text-[10px] ${divider} ${textMuted}`}
              >
                <span>MAX SUPPLY BOUND</span>
                <span>UNLINKED ASSETS</span>
              </div>
            </MagicBentoCard>
          </ScrollReveal>

          {/* =====================================================
              HARDWARE
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2"
            delay={0.2}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className={`${cardClass} h-full flex flex-col justify-between p-5 md:p-8`}
              style={cardStyle}
            >
              <div>
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest block mb-3 md:mb-6"
                  style={{ color: cardTextColor }}
                >
                  [Equipment Rigs // 03]
                </span>

                <h4 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6">
                  Hardware Stack
                </h4>

                <div className="space-y-4 md:space-y-6">
                  <div className={`border-b pb-2 md:pb-3 ${divider}`}>
                    <span
                      className={`font-mono text-[10px] sm:text-xs uppercase block mb-1 ${textMuted}`}
                    >
                      Base Rigs
                    </span>

                    <span className="text-lg md:text-2xl font-bold">
                      To Be Revealed
                    </span>
                  </div>

                  <div className={`border-b pb-2 md:pb-3 ${divider}`}>
                    <span
                      className={`font-mono text-[10px] sm:text-xs uppercase block mb-1 ${textMuted}`}
                    >
                      Jackets & Outerwear
                    </span>

                    <span
                      className="text-lg md:text-2xl font-bold"
                      style={{ color: cardTextColor }}
                    >
                      To Be Revealed
                    </span>
                  </div>

                  <div className={`border-b pb-2 md:pb-3 ${divider}`}>
                    <span
                      className={`font-mono text-[10px] sm:text-xs uppercase block mb-1 ${textMuted}`}
                    >
                      Mouth Traits
                    </span>

                    <span className="text-lg md:text-2xl font-bold">
                      To Be Revealed
                    </span>
                  </div>

                  <div>
                    <span
                      className={`font-mono text-[10px] sm:text-xs uppercase block mb-1 ${textMuted}`}
                    >
                      Hairstyles
                    </span>

                    <span
                      className={`text-lg md:text-2xl font-bold ${textSubtle}`}
                    >
                      To Be Revealed
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`font-mono text-[9px] sm:text-[10px] uppercase mt-6 block ${textMuted}`}
              >
                // Fully randomized trait combinations
              </span>
            </MagicBentoCard>
          </ScrollReveal>

          {/* =====================================================
              TELEMETRY
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2"
            delay={0.25}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className={`${cardClass} h-full flex flex-col justify-between p-5 md:p-8`}
              style={cardStyle}
            >
              <div>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-2 h-2 rounded-none bg-red-600" />

                  <span
                    className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-widest ${textSubtle}`}
                  >
                    [Grid Telemetry // 04]
                  </span>
                </div>

                <p
                  className={`font-mono text-[10px] sm:text-xs uppercase leading-relaxed tracking-wider mb-4 md:mb-6 ${textSubtle}`}
                >
                  &gt; NO TWO FLATLINE THE SAME WAY. OPERATIVES ARE STACKED
                  WITH RANDOMIZED HARDWARE, VISUAL IMPLANTS, AND COMBAT-READY
                  RIGS DIRECTLY FROM NIGHT CITY HARD DRIVE LOGS.
                </p>
              </div>

              <div
                className={`${panelBg} rounded-none p-3 md:p-4 border font-mono text-[9px] sm:text-[10px] space-y-2 ${divider} ${textMuted}`}
              >
                <div className="flex justify-between">
                  <span>ENCRYPTION:</span>
                  <span className={textSubtle}>256-BIT</span>
                </div>

                <div className="flex justify-between">
                  <span>CHAIN ID:</span>
                  <span className={textSubtle}>(Robinhood Chain)</span>
                </div>
              </div>
            </MagicBentoCard>
          </ScrollReveal>

          {/* =====================================================
              RARITY
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-3 lg:col-span-4"
            delay={0.3}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className={`${cardClass} h-full p-5 md:p-8`}
              style={cardStyle}
            >
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest"
                  style={{ color: cardTextColor }}
                >
                  [Rarity Hierarchy // 05]
                </span>

                <span
                  className={`font-mono text-[8px] sm:text-[9px] uppercase ${textMuted}`}
                >
                  Rank Distribution
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {tiers.map((t) => (
                  <div
                    key={t.name}
                    className={`${panelBg} rounded-none border p-2.5 sm:p-3.5 ${divider}`}
                  >
                    <span
                      className="text-lg sm:text-xl font-black block"
                      style={{ color: cardTextColor }}
                    >
                      {t.pct}
                    </span>

                    <span className="font-mono text-[10px] sm:text-xs uppercase block font-bold mt-0.5 sm:mt-1">
                      {t.name}
                    </span>

                    <span
                      className={`font-mono text-[8px] sm:text-[9px] block ${textMuted}`}
                    >
                      {t.count} Units
                    </span>
                  </div>
                ))}
              </div>
            </MagicBentoCard>
          </ScrollReveal>

          {/* =====================================================
              VERIFICATION
          ===================================================== */}

          <ScrollReveal
            className="col-span-2 md:col-span-3 lg:col-span-8"
            delay={0.35}
            amount={0.15}
          >
            <MagicBentoCard
              glowColor={cardGlowColor}
              className={`${cardClass} h-full flex flex-col justify-between p-5 md:p-8`}
              style={cardStyle}
            >
              <span
                className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest"
                style={{ color: cardTextColor }}
              >
                [Verification // 06]
              </span>

              <div
                className={`font-mono text-[10px] sm:text-xs space-y-2 uppercase my-4 ${textSubtle}`}
              >
                <div className={`flex justify-between border-b pb-2 ${divider}`}>
                  <span className={textMuted}>FORMAT:</span>
                  <span className="font-bold">ERC-721</span>
                </div>

                <div className={`flex justify-between border-b pb-2 ${divider}`}>
                  <span className={textMuted}>STORAGE:</span>
                  <span className="font-bold">DECENTRALIZED IPFS</span>
                </div>

                <div className={`flex justify-between border-b pb-2 ${divider}`}>
                  <span className={textMuted}>PROVENANCE:</span>
                  <span
                    className="font-bold"
                    style={{ color: cardTextColor }}
                  >
                    VERIFIED ON-CHAIN
                  </span>
                </div>
              </div>
            </MagicBentoCard>
          </ScrollReveal>
        </div>

        {/* VELOCITY */}

        <ScrollReveal
          className="space-y-2 pt-16 md:pt-20"
          delay={0.2}
          amount={0.2}
        >
          <ScrollVelocity
            svgSrc="/images/velocity.svg"
            baseVelocity={5}
            direction={1}
            color={isLight ? "#000000" : "#FFFFFF"}
            className=""
          />

          <ScrollVelocity
            svgSrc="/images/velocity.svg"
            baseVelocity={3}
            direction={-1}
            color={isLight ? "#000000" : "#FFFFFF"}
            className=""
          />
        </ScrollReveal>
      </div>

      {/* TOAST */}

      <div
        aria-live="polite"
        className={`fixed left-1/2 bottom-8 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
          showToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div
          className={`px-5 py-3 rounded-none ${
            isLight ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <span className="font-mono text-[10px] md:text-sm uppercase tracking-wide">
            Minting not live // OpenSea link drops soon
          </span>
        </div>
      </div>
    </section>
  )
}