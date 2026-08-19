"use client"

import { useEffect, useState } from "react"
import { createPublicClient, http, parseAbi } from "viem"
import { mainnet } from "viem/chains"

const abi = parseAbi(["function totalSupply() view returns (uint256)"])

export function useMintedSupply(pollMs = 30000) {
  const [minted, setMinted] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    })

    let cancelled = false

    async function fetchSupply() {
      try {
        const supply = await client.readContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi,
          functionName: "totalSupply",
        })
        if (!cancelled) {
          setMinted(Number(supply))
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError("Failed to fetch supply")
      }
    }

    fetchSupply()
    const interval = setInterval(fetchSupply, pollMs)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [pollMs])

  return { minted, error }
}