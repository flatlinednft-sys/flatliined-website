"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  FiExternalLink,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi"
import { useTheme } from "./ThemeContext"

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const ALCHEMY_NETWORK =
  process.env.NEXT_PUBLIC_ALCHEMY_NETWORK || "robinhood-mainnet"
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const INITIAL_LIMIT = 12
const POLL_INTERVAL_MS = 15000

// Keccak-256 hash for Transfer(address,address,uint256)
const TRANSFER_EVENT_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

const GRID_COLS = "80px minmax(0,1.5fr) 90px minmax(0,90px) minmax(0,90px) 32px"

function maskKey(key?: string) {
  if (!key) return "MISSING"
  if (key.length <= 8) return "***"
  return `${key.slice(0, 6)}...${key.slice(-4)}`
}

type LogEvent = {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  transactionHash: string
  logIndex: string
}

type FeedRow = {
  key: string
  eventType: "Sale" | "Mint" | "Transfer"
  tokenId: string
  from: string
  to: string
  price?: string
  symbol?: string
  txHash: string
  imageUrl?: string
}

type DebugInfo = {
  url: string
  status?: number
  statusText?: string
  rawBody?: string
}

function truncate(addr: string) {
  if (!addr) return "—"
  if (addr.toLowerCase() === ZERO_ADDRESS) return "NULL"
  return `${addr.slice(0, 5)}…${addr.slice(-4)}`
}

function parseAddressFromTopic(topic?: string): string {
  if (!topic || topic.length < 42) return ZERO_ADDRESS
  return `0x${topic.slice(-40)}`
}

function parseTokenIdFromTopic(topic?: string): string {
  if (!topic) return "0"
  try {
    return BigInt(topic).toString()
  } catch {
    return "0"
  }
}

function mapLogs(logs: LogEvent[]): FeedRow[] {
  return logs.map((log) => {
    const from = parseAddressFromTopic(log.topics[1])
    const to = parseAddressFromTopic(log.topics[2])
    const tokenId = parseTokenIdFromTopic(log.topics[3])
    const isMint = from.toLowerCase() === ZERO_ADDRESS

    return {
      key: `${log.transactionHash}-${log.logIndex || Math.random()}`,
      eventType: isMint ? "Mint" : "Transfer",
      tokenId,
      from,
      to,
      txHash: log.transactionHash,
    }
  })
}

function ActivityIcon({
  className = "w-30 h-5 md:w-60 md:h-10",
  isLight,
}: {
  className?: string
  isLight: boolean
}) {
  const color = isLight ? "#000000" : "#a3e635"
  return (
    <div
      role="img"
      aria-label="Activity"
      className={`${className} shrink-0`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: "url(/images/activity.svg)",
        maskImage: "url(/images/activity.svg)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  )
}

export default function ActivityPanel() {
  const { isLight } = useTheme()
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<FeedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<DebugInfo | null>(null)
  const seenHashes = useRef<Set<string>>(new Set())
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const panelBg = isLight ? "bg-white text-black" : "bg-black text-white"
  const iconColor = isLight ? "#000000" : "#a3e635"

  const getRpcUrl = () => {
    return `https://${ALCHEMY_NETWORK}.g.alchemy.com/v2/${ALCHEMY_KEY}`
  }

  const fetchInitial = useCallback(async () => {
    if (!ALCHEMY_KEY || !CONTRACT_ADDRESS) {
      setError("MISSING_ALCHEMY_KEY_OR_CONTRACT")
      setDebug({
        url: "N/A",
        rawBody: `ALCHEMY_KEY=${maskKey(ALCHEMY_KEY)} | CONTRACT_ADDRESS=${CONTRACT_ADDRESS || "MISSING"} | NETWORK=${ALCHEMY_NETWORK}`,
      })
      return
    }
    setLoading(true)
    setError(null)
    setDebug(null)
    const url = getRpcUrl()

    try {
      // Query recent ERC-721 Transfer logs directly via standard JSON-RPC
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getLogs",
          params: [
            {
              address: CONTRACT_ADDRESS,
              topics: [TRANSFER_EVENT_TOPIC],
              fromBlock: "0x0",
              toBlock: "latest",
            },
          ],
        }),
      })

      const rawText = await res.text()

      console.log("[ActivityPanel] request:", url.replace(ALCHEMY_KEY, maskKey(ALCHEMY_KEY)))
      console.log("[ActivityPanel] status:", res.status, res.statusText)

      if (!res.ok) {
        setDebug({
          url: url.replace(ALCHEMY_KEY, maskKey(ALCHEMY_KEY)),
          status: res.status,
          statusText: res.statusText,
          rawBody: rawText.slice(0, 500),
        })
        throw new Error(`RPC_HTTP_${res.status}`)
      }

      const data = JSON.parse(rawText)

      if (data.error) {
        setDebug({
          url: url.replace(ALCHEMY_KEY, maskKey(ALCHEMY_KEY)),
          rawBody: JSON.stringify(data.error),
        })
        throw new Error(`RPC_ERROR :: ${data.error.message || "Unknown error"}`)
      }

      const rawLogs: LogEvent[] = data.result || []
      // Take the most recent events
      const latestLogs = rawLogs.slice(-INITIAL_LIMIT).reverse()

      if (latestLogs.length === 0) {
        setDebug({
          url: url.replace(ALCHEMY_KEY, maskKey(ALCHEMY_KEY)),
          status: res.status,
          statusText: res.statusText,
          rawBody: "No logs returned for contract.",
        })
      }

      const mapped = mapLogs(latestLogs)
      seenHashes.current = new Set(mapped.map((r) => r.txHash))
      setRows(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : "UNKNOWN_ERROR")
    } finally {
      setLoading(false)
    }
  }, [])

  const pollNew = useCallback(async () => {
    if (!ALCHEMY_KEY || !CONTRACT_ADDRESS) return
    try {
      const res = await fetch(getRpcUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getLogs",
          params: [
            {
              address: CONTRACT_ADDRESS,
              topics: [TRANSFER_EVENT_TOPIC],
              fromBlock: "latest",
            },
          ],
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.error || !data.result) return

      const logs: LogEvent[] = data.result
      const mapped = mapLogs(logs)

      const fresh = mapped.filter((r) => !seenHashes.current.has(r.txHash))
      if (fresh.length === 0) return

      fresh.forEach((r) => seenHashes.current.add(r.txHash))
      setRows((prev) => [...fresh, ...prev])
      setError(null)
    } catch {
      // silent fail on background poll
    }
  }, [])

  const manualRefresh = useCallback(async () => {
    setLoading(true)
    await fetchInitial()
    setLoading(false)
  }, [fetchInitial])

  useEffect(() => {
    if (!open) return
    fetchInitial()
    pollRef.current = setInterval(pollNew, POLL_INTERVAL_MS)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [open, fetchInitial, pollNew])

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[640px] transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${panelBg} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close activity feed" : "Open activity feed"}
          className={`absolute top-1/2 -left-12 -translate-y-1/2 flex items-center justify-center w-12 h-16 rounded-l-2xl shadow-2xl ${panelBg}`}
        >
          {open ? (
            <FiChevronRight size={24} style={{ color: iconColor }} />
          ) : (
            <FiChevronLeft size={24} style={{ color: iconColor }} />
          )}
        </button>

        <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-500/10">
          <div className="flex items-center gap-3">
            <ActivityIcon isLight={isLight} className="w-40 h-10 md:w-60 md:h-10 lg:w-80 md:h-15" />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={manualRefresh}
              aria-label="Refresh activity feed"
              className={`p-2 rounded-full transition-transform duration-300 hover:bg-zinc-500/10 ${
                loading ? "animate-spin" : "hover:rotate-180"
              }`}
            >
              <FiRefreshCw size={22} style={{ color: iconColor }} />
            </button>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              className="sm:hidden p-2 rounded-full hover:bg-zinc-500/20 transition-colors"
            >
              <FiX size={26} style={{ color: iconColor }} />
            </button>
          </div>
        </div>

        {/* Env / debug strip */}
        <div
          className={`shrink-0 px-6 py-2 font-mono text-[10px] uppercase tracking-wide opacity-50 border-b ${
            isLight ? "border-zinc-200" : "border-zinc-800"
          }`}
        >
          KEY: {maskKey(ALCHEMY_KEY)} · NET: {ALCHEMY_NETWORK} · CONTRACT: {truncate(CONTRACT_ADDRESS || "")}
        </div>

        {rows.length > 0 && (
          <div className="overflow-x-auto shrink-0 border-b border-zinc-500/10">
            <div
              className="grid gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest opacity-50 min-w-[500px]"
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              <span>Event</span>
              <span>Item</span>
              <span>Price</span>
              <span>From</span>
              <span>To</span>
              <span />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-auto px-3 py-3">
          {error && (
            <div
              className="font-mono text-xs uppercase p-4 m-3 rounded-2xl space-y-2"
              style={{ color: "#ef4444", background: "#ef444411" }}
            >
              <div>
                {error === "MISSING_ALCHEMY_KEY_OR_CONTRACT"
                  ? "SET NEXT_PUBLIC_ALCHEMY_API_KEY + NEXT_PUBLIC_CONTRACT_ADDRESS IN ENV"
                  : `FEED_ERROR :: ${error}`}
              </div>
              {debug && (
                <div className="opacity-80 normal-case space-y-1 border-t border-red-500/20 pt-2 break-all">
                  <div>URL: {debug.url}</div>
                  {debug.status !== undefined && (
                    <div>
                      Status: {debug.status} {debug.statusText}
                    </div>
                  )}
                  {debug.rawBody && <div>Body: {debug.rawBody}</div>}
                </div>
              )}
            </div>
          )}

          {!error && debug && rows.length === 0 && !loading && (
            <div
              className="font-mono text-[10px] p-4 m-3 rounded-2xl space-y-1 break-all opacity-60"
            >
              <div>Request returned 0 logs for this contract on {ALCHEMY_NETWORK}.</div>
              <div>URL: {debug.url}</div>
              {debug.rawBody && <div>Body: {debug.rawBody}</div>}
            </div>
          )}

          {!error && loading && rows.length === 0 && (
            <div className="font-mono text-xs sm:text-sm uppercase text-center py-12 opacity-50">
              Loading Robinhood Chain activity...
            </div>
          )}

          {!error && !loading && rows.length === 0 && !debug && (
            <div className="font-mono text-xs sm:text-sm uppercase text-center py-12 opacity-50">
              No recent activity found
            </div>
          )}

          <div className="flex flex-col gap-1.5 min-w-[500px] sm:min-w-0">
            {rows.map((r) => (
              <a
                key={r.key}
                href={`https://explorer.chain.robinhood.com/tx/${r.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`grid gap-2 items-center px-4 py-3.5 rounded-2xl transition-colors duration-200 ${
                  isLight ? "hover:bg-zinc-100" : "hover:bg-zinc-900"
                }`}
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                <span
                  className="font-mono text-[10px] sm:text-xs uppercase tracking-wide px-2.5 py-1 rounded-md w-fit whitespace-nowrap font-bold"
                  style={{
                    backgroundColor: isLight ? "#e4e4e7" : "#a3e63522",
                    color: isLight ? "#000000" : "#a3e635",
                  }}
                >
                  {r.eventType}
                </span>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center font-mono text-xs opacity-70 ${
                      isLight ? "bg-zinc-200 text-black" : "bg-zinc-800 text-white"
                    }`}
                  >
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.imageUrl}
                        alt={`Token ${r.tokenId}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>#{r.tokenId}</>
                    )}
                  </div>
                  <span className="font-mono text-xs sm:text-sm truncate font-medium">
                    #{r.tokenId}
                  </span>
                </div>

                <span className="font-mono text-xs sm:text-sm font-bold truncate tabular-nums">
                  —
                </span>

                <span className="font-mono text-xs uppercase opacity-70 truncate tabular-nums">
                  {truncate(r.from)}
                </span>

                <span className="font-mono text-xs uppercase opacity-70 truncate tabular-nums">
                  {truncate(r.to)}
                </span>

                <FiExternalLink
                  size={14}
                  className="justify-self-end shrink-0"
                  style={{ color: iconColor, opacity: 0.7 }}
                />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}