"use client"

import Image from "next/image"

export default function GlowCard({ src, alt, tilt = 0 }: { src: string; alt: string; tilt?: number }) {
  return (
    <div
      className="relative rounded-2xl bg-zinc-900 aspect-square overflow-hidden
        shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
      style={{
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <Image src={src} alt={alt} fill sizes="200px" className="object-cover" />
    </div>
  )
}