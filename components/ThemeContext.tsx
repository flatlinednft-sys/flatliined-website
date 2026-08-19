"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type ThemeContextType = {
  isLight: boolean
  toggleTheme: () => void
  accent: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLight, setIsLight] = useState(false)
  const accent = isLight ? "#000000" : "#d4ff00"

  return (
    <ThemeContext.Provider
      value={{ isLight, toggleTheme: () => setIsLight((v) => !v), accent }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw Error("useTheme must be used within a ThemeProvider")
  return ctx
}