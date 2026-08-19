import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Chakra_Petch } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/ThemeContext"
import SmoothScrollProvider from "@/components/SmoothScrollProvider"

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Get Flatlined",
  description:
    "Priority access to Night City's most wanted collection",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <Providers>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Providers>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}