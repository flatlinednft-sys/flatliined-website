"use client"

import { useState, useEffect } from "react"
import { useTheme } from "./ThemeContext"

const SOCIALS = [
  { name: "X", icon: "/images/x.svg", href: "https://x.com/your_handle" },
  { name: "OpenSea", icon: "/images/opensea.svg", href: "https://opensea.io/collection/your_collection" },
]

export default function SocialSection() {
  const { isLight, accent } = useTheme()
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 3200)
    return () => clearTimeout(t)
  }, [showToast])

  const handleClick = (e: React.MouseEvent, name: string) => {
    if (name === "OpenSea") {
      e.preventDefault()
      setShowToast(true)
    }
  }

  return (
    <section
      className={`relative w-full py-16 md:py-24 transition-colors duration-500 ${
        isLight ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-center gap-10">
        <span
          className={`font-stretched text-xs tracking-widest uppercase ${
            isLight ? "text-zinc-500" : "text-zinc-500"
          }`}
        >
          Jack In // Stay Linked
        </span>

        <div className="flex items-center gap-8 md:gap-14">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              onClick={(e) => handleClick(e, s.name)}
              className="group relative flex items-center justify-center"
            >
              <span
                className="block w-7 h-7 md:w-9 md:h-9 transition-transform duration-300 ease-out group-hover:scale-110"
                style={{
                  backgroundColor: isLight ? "#000000" : "#FFFFFF",
                  WebkitMaskImage: `url(${s.icon})`,
                  maskImage: `url(${s.icon})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
              <span
                className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: accent }}
              />
            </a>
          ))}
        </div>

        <div
          className={`font-stretched text-[10px] uppercase tracking-widest ${
            isLight ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          SYS.LOC // NIGHT_CITY // NO_BORDER_PROTOCOL
        </div>
      </div>

      {/* Toast: OpenSea link not live yet (Matching AboutSection) */}
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