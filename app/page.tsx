import HeroVideo from "@/components/HeroVid"
import ConnectSection from "@/components/ConnectionSection"
import AboutSection from "@/components/AboutSection"
import SocialSection from "@/components/Footer"

export default function Home() {
  return (
    <main className="relative">
      <HeroVideo />

      <div className="screen bottom-0 top-0">
        <ConnectSection />
      </div>

      <div className="top-0">
        <AboutSection />
      </div>

      <SocialSection/>
    </main>
  )
}