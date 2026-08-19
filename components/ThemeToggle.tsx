"use client"

export default function ThemeToggle({
  isLight,
  onToggle,
}: {
  isLight: boolean
  onToggle: () => void
}) {
  const accent = isLight ? "#000000" : "#a3e635"
  return (
    <button
      onClick={onToggle}
      className={`relative w-16 h-8 border-2 transition-colors duration-300 ${isLight ? "bg-white" : "bg-black"}`}
      style={{
        borderColor: accent
      }}
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300 ease-out ${
          isLight ? "left-[calc(100%-28px)]" : "left-1"
        }`}
        style={{
          background: accent,
        }}
      />
    </button>
  )
}