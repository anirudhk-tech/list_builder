"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FireBackdrop } from "@/components/features/home/flickering-fire";
import { AboutSection } from "@/components/features/home/about-section";
import { HeroSection } from "@/components/features/home/hero-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <main className="relative max-h-screen w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-x-hidden font-sans scrollbar-thin scrollbar-thumb-gray-700">
        <Navbar />
        <FireBackdrop />
        <HeroSection />
        <AboutSection />
        <Footer />
      </main>
      <style jsx>{`
        .shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          animation: shimmer 0.5s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}
