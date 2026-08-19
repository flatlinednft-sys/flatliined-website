"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FiImage, FiLoader, FiAlertCircle } from "react-icons/fi"
import { useTheme } from "@/components/ThemeContext"

type Nft = {
  contract: string
  tokenId: string
  name: string
  image: string | null
  collection: string
}

// Swap in your own Alchemy app key (or Reservoir/Moralis/etc — same shape works)
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? ""
const ALCHEMY_BASE = `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`

function useOwnedNfts(address: string | undefined) {
  const [nfts, setNfts] = useState<Nft[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  useEffect(() => {
    if (!address) {
      setNfts([])
      setStatus("idle")
      return
    }
    let cancelled = false
    setStatus("loading")

    fetch(`${ALCHEMY_BASE}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=50`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const owned: Nft[] = (data.ownedNfts ?? []).map((n: any) => ({
          contract: n.contract?.address ?? "",
          tokenId: n.tokenId ?? "",
          name: n.name || n.raw?.metadata?.name || `#${n.tokenId}`,
          image: n.image?.cachedUrl || n.image?.originalUrl || null,
          collection: n.contract?.name || "Unknown collection",
        }))
        setNfts(owned)
        setStatus("done")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [address])

  return { nfts, status }
}

export default function ProfilePage() {
  const { isLight, accent } = useTheme()
  const { address, isConnected } = useAccount()
  const { nfts, status } = useOwnedNfts(isConnected ? address : undefined)

  const pageBg = isLight ? "bg-zinc-50" : "bg-black"
  const textPrimary = isLight ? "text-black" : "text-white"
  const textMuted = isLight ? "text-zinc-500" : "text-zinc-400"
  const panelBg = isLight ? "bg-white" : "bg-zinc-950"
  const panelBorder = isLight ? "border-zinc-200" : "border-zinc-800"

  return (
    <main className={`min-h-screen ${pageBg} px-4 pt-32 pb-20`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`font-stretched font-black text-2xl md:text-3xl uppercase tracking-tight ${textPrimary}`}>
          My Profile
        </h1>
        <p className={`mt-1 font-mono text-xs ${textMuted}`}>
          {isConnected && address ? `Wallet ${address.slice(0, 6)}...${address.slice(-4)}` : "Connect a wallet to view your collection"}
        </p>

        {!isConnected && (
          <div
            className={`mt-10 rounded-2xl border ${panelBorder} ${panelBg} flex flex-col items-center justify-center gap-4 py-20 px-6 text-center`}
          >
            <FiImage size={28} style={{ color: accent }} />
            <div>
              <p className={`font-stretched text-sm font-bold uppercase tracking-wide ${textPrimary}`}>
                No wallet connected
              </p>
              <p className={`mt-1 text-sm ${textMuted}`}>Connect your wallet to see the NFTs you hold.</p>
            </div>
            <ConnectButton />
          </div>
        )}

        {isConnected && status === "loading" && (
          <div className="mt-10 flex items-center justify-center gap-2 py-20">
            <FiLoader className="animate-spin" style={{ color: accent }} />
            <span className={`font-mono text-xs ${textMuted}`}>Loading your NFTs...</span>
          </div>
        )}

        {isConnected && status === "error" && (
          <div
            className={`mt-10 rounded-2xl border ${panelBorder} ${panelBg} flex flex-col items-center justify-center gap-3 py-16 px-6 text-center`}
          >
            <FiAlertCircle size={24} style={{ color: accent }} />
            <p className={`text-sm ${textMuted}`}>Couldn't load your NFTs right now. Try refreshing.</p>
          </div>
        )}

        {isConnected && status === "done" && nfts.length === 0 && (
          <div
            className={`mt-10 rounded-2xl border ${panelBorder} ${panelBg} flex flex-col items-center justify-center gap-2 py-16 px-6 text-center`}
          >
            <FiImage size={24} style={{ color: accent }} />
            <p className={`text-sm ${textMuted}`}>This wallet doesn't hold any NFTs yet.</p>
          </div>
        )}

        {isConnected && status === "done" && nfts.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {nfts.map((nft) => (
              <div
                key={`${nft.contract}-${nft.tokenId}`}
                className={`rounded-2xl border ${panelBorder} ${panelBg} overflow-hidden flex flex-col`}
              >
                <div className="aspect-square bg-zinc-900 flex items-center justify-center">
                  {nft.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiImage className="text-zinc-600" size={28} />
                  )}
                </div>
                <div className="p-3">
                  <p className={`font-stretched text-xs font-bold uppercase truncate ${textPrimary}`}>{nft.name}</p>
                  <p className={`mt-0.5 text-[11px] truncate ${textMuted}`}>{nft.collection}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}