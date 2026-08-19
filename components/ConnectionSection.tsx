"use client"

import { useState, useEffect, useRef } from "react"
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { FiCheck, FiArrowRight } from "react-icons/fi"
import GlowCard from "./GlowCard"
import EdgerunnerFrame from "./EdgerunnerFrame"
import ThemeToggle from "./ThemeToggle"
import { Marquee } from "./magicui/marquee"
import { useTheme } from "./ThemeContext"
import ScrollReveal from "./ScrollReveal"

const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim())

async function saveAddressToExcel(address: string, source: "manual" | "connected") {
  try {
    const res = await fetch("/api/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, source }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error("[WHITELIST ERROR]", res.status, data.error || "Failed to save address.")
      return false
    }

    console.log("[WHITELIST SUCCESS]", data)
    return true
  } catch (err) {
    console.error("[WHITELIST NETWORK ERROR]", err)
    return false
  }
}

export default function ConnectSection() {
  const { isLight, toggleTheme, accent } = useTheme()

  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  const { address: connectedAddress, isConnected } = useAccount()

  const limeAccent = isLight ? "#000000" : "#d4ff00"

  const [manualAddress, setManualAddress] = useState("")
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null)
  const [addressError, setAddressError] = useState(false)

  const lastSyncedRef = useRef<string | null>(null)

  useEffect(() => {
    if (isConnected && connectedAddress) {
      const normalizedConnected = connectedAddress.toLowerCase()

      if (lastSyncedRef.current !== normalizedConnected) {
        lastSyncedRef.current = normalizedConnected
        setSubmittedAddress(connectedAddress)
        setManualAddress("")
        setAddressError(false)
        saveAddressToExcel(connectedAddress, "connected")
      }
    } else if (!isConnected && lastSyncedRef.current) {
      if (submittedAddress && submittedAddress.toLowerCase() === lastSyncedRef.current) {
        setSubmittedAddress(null)
      }
      lastSyncedRef.current = null
    }
  }, [isConnected, connectedAddress, submittedAddress])

  function handleManualSubmit() {
    const trimmed = manualAddress.trim()
    if (isValidAddress(trimmed)) {
      const normalizedManual = trimmed.toLowerCase()
      setSubmittedAddress(trimmed)
      setAddressError(false)

      if (lastSyncedRef.current !== normalizedManual) {
        lastSyncedRef.current = normalizedManual
        saveAddressToExcel(trimmed, "manual")
      }
    } else {
      setAddressError(true)
      setSubmittedAddress(null)
    }
  }

  const activeAddress = isConnected && connectedAddress ? connectedAddress : submittedAddress
  const validSubmitted = Boolean(activeAddress)

  return (
    <section
      className={`relative min-h-fit px-4 py-8 sm:p-10 md:p-16 pt-12 md:pt-20 pb-8 md:pb-12 rounded-t-[24px] sm:rounded-t-[36px] md:rounded-t-[48px] overflow-hidden transition-colors duration-500 ${
        isLight ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <EdgerunnerFrame color={accent} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2" style={{ background: accent }} />
              <span
                className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase ${
                  isLight ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                Get Flatlined // Whitelist Access
              </span>
            </div>
            <ThemeToggle isLight={isLight} onToggle={toggleTheme} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div
            className="w-full max-w-full transition-colors duration-500"
            style={{
              aspectRatio: "3000 / 500",
              backgroundColor: isLight ? "#000000" : "#d4ff00",
              WebkitMaskImage: "url(/images/whitelist.svg)",
              maskImage: "url(/images/whitelist.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
            }}
            role="img"
            aria-label="Get Flatlined"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className={`font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-wide mt-1 sm:mt-2 ${
              isLight ? "text-zinc-600" : "text-zinc-500"
            }`}
          >
            Priority access to Night City's most wanted collection
          </p>
        </ScrollReveal>

        <div className="h-6 sm:h-10 md:h-12" />

        <ScrollReveal delay={0.1} y={20} blur={true}>
          <div
            className="border-l-2 pl-3 sm:pl-4 max-w-3xl ml-auto"
            style={{ borderColor: `${accent}66` }}
          >
            <p
              className={`font-mono text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed uppercase tracking-wide text-justify ${
                isLight ? "text-zinc-700" : "text-zinc-300"
              }`}
            >
              Connect your wallet to secure your place on the whitelist before access closes. Linked wallets get priority entry when the drop goes live—no delays and no second chances once the list locks. Early supporters guarantee their spot in the initial allocation before public access opens. Secure your connection now and lock in your priority standing.
            </p>
          </div>
        </ScrollReveal>

        <div className="h-6 sm:h-10 md:h-12" />

        <ScrollReveal delay={0.15}>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-4 w-full">
              {/* Manual Input */}
              <div className="group relative flex items-stretch overflow-hidden min-w-0">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => {
                    setManualAddress(e.target.value)
                    if (addressError) setAddressError(false)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="0X... PASTE ADDRESS"
                  className="flex-1 min-w-0 font-mono text-xs sm:text-sm uppercase tracking-wide bg-transparent border-2 border-r-0 px-3 sm:px-4 py-3 sm:py-4 outline-none transition-colors duration-500"
                  style={{
                    borderColor: limeAccent,
                    color: limeAccent,
                  }}
                />
                <button
                  onClick={handleManualSubmit}
                  aria-label="Submit address"
                  className="shrink-0 flex items-center justify-center font-black px-4 sm:px-5 border-2 transition-transform active:scale-95"
                  style={{
                    borderColor: limeAccent,
                    background: limeAccent,
                    color: isLight ? "#FFFFFF" : "#000000",
                  }}
                >
                  {validSubmitted && !isConnected ? <FiCheck size={16} /> : <FiArrowRight size={16} />}
                </button>
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"
                  style={{ background: `${limeAccent}1A` }}
                />
              </div>

              {/* Dividers */}
              <div
                className={`hidden sm:flex items-center justify-center font-mono text-xs uppercase px-1 ${
                  isLight ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
                OR
              </div>
              <div
                className={`flex sm:hidden items-center gap-2 font-mono text-[10px] uppercase ${
                  isLight ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
                <span className={`h-px flex-1 ${isLight ? "bg-black/20" : "bg-white/20"}`} />
                OR
                <span className={`h-px flex-1 ${isLight ? "bg-black/20" : "bg-white/20"}`} />
              </div>

              {/* Wallet Modal Button */}
              <button
                onClick={isConnected ? openAccountModal : openConnectModal}
                className="group relative w-full min-w-0 font-black uppercase border-2 overflow-hidden transition-all duration-500 ease-out active:scale-95 py-3 sm:py-4 text-xs sm:text-sm cursor-pointer"
                style={{
                  background: limeAccent,
                  borderColor: isLight ? "#000000" : "#000000",
                  color: isLight ? "#FFFFFF" : "#000000",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isConnected ? (
                    <>
                      <FiCheck size={16} /> JACKED IN
                    </>
                  ) : (
                    <>
                      CONNECT WALLET <FiArrowRight size={16} />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-white/40 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
              </button>
            </div>

            {addressError && (
              <span className="mt-2 block font-mono text-[10px] sm:text-xs uppercase text-red-500">
                INVALID ADDRESS FORMAT
              </span>
            )}

            {activeAddress && (
              <>
                <span
                  key={`label-${activeAddress}`}
                  className="mt-4 sm:mt-6 flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase address-reveal"
                  style={{ color: limeAccent }}
                >
                  <FiCheck size={14} /> [ LINK_ESTABLISHED ]
                </span>

                <div className="mt-3 sm:mt-6 w-full min-w-0 overflow-hidden">
                  <span
                    key={activeAddress}
                    className="block font-mono font-black tracking-tight text-lg sm:text-3xl md:text-5xl lg:text-6xl leading-tight break-all address-reveal"
                    style={{
                      color: isLight ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
                      WebkitMaskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, transparent 100%)",
                    }}
                  >
                    {activeAddress}
                  </span>
                </div>
              </>
            )}
          </div>
        </ScrollReveal>

        <div className="h-4 sm:h-6 md:h-8" />
      </div>

      <ScrollReveal delay={0.2} once blur={false}>
        <div className="relative px-2 sm:px-8 md:px-16 py-4 sm:py-6 overflow-visible">
          <Marquee pauseOnHover className="[--duration:25s]">
            {["nft1.png", "nft2.png", "nft3.png", "nft4.png", "nft5.png", "nft6.png", "nft7.png"].map(
              (f, i) => (
                <div key={f + i} className="w-28 sm:w-36 md:w-48 lg:w-56 shrink-0 px-1 sm:px-2">
                  <GlowCard src={`/images/${f}`} alt="Flatlined NFT" tilt={0} />
                </div>
              )
            )}
          </Marquee>
        </div>
      </ScrollReveal>

      <div className="h-2 sm:h-4 md:h-6" />

      <ScrollReveal delay={0.05} y={16}>
        <div
          className={`relative z-10 font-mono text-[9px] sm:text-[10px] uppercase max-w-7xl mx-auto mt-4 sm:mt-6 ${
            isLight ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          SYS.LOC // NIGHT_CITY // NO_BORDER_PROTOCOL
        </div>
      </ScrollReveal>

      <style jsx global>{`
        .address-reveal {
          opacity: 0;
          transform: translateX(-16px);
          animation: address-reveal-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes address-reveal-in {
          0% {
            opacity: 0;
            transform: translateX(-16px);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  )
}