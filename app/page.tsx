'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-[#1a1a1a] text-white">
        {/* Hero Section */}
        <section className="border-b border-[rgba(255,255,255,0.08)] py-20 md:py-32">
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[88px] relative">
            {/* Decorative Doodles */}
            <svg className="absolute opacity-40 top-4 left-[8%] w-[26px] h-[26px]" viewBox="0 0 26 26" fill="none">
              <path d="M13 2L15 11L24 13L15 15L13 24L11 15L2 13L11 11L13 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute opacity-40 top-[120px] right-[10%] w-[46px] h-[30px]" viewBox="0 0 46 30" fill="none">
              <path d="M2 20C10 4 20 4 22 14C24 24 34 24 36 12C37 6 41 4 44 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <svg className="absolute opacity-40 bottom-4 left-[16%] w-[54px] h-[34px]" viewBox="0 0 54 34" fill="none">
              <path d="M3 6C20 2 42 10 50 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M40 24L50 26L46 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute opacity-40 top-16 right-[22%] w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2.5"/>
            </svg>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
                <span className="w-5 h-px bg-gray-600"></span>
                Event planning, simplified
              </div>

              {/* Heading */}
              <h1 className="font-sans font-semibold text-[clamp(40px,5.2vw,66px)] leading-tight tracking-tight max-w-[780px] mb-6">
                Discover the joy of
                <span className="px-3 py-1 rounded-lg bg-gray-700 text-white inline-block mx-2">effortless</span>
                event planning
                <span className="px-3 py-1 rounded-lg bg-gray-800 text-white inline-block">with EventSphere.</span>
              </h1>

              {/* Subheading */}
              <p className="text-[15px] md:text-base leading-relaxed text-gray-400 max-w-[400px] mb-10">
                Plan, book, and run gatherings people remember — all in one place.
              </p>

              {/* CTA Button */}
              <div className="mb-20">
                <Link
                  href="/auth/signup"
                  className="inline-block bg-white text-black font-semibold text-sm md:text-base px-8 md:px-10 py-3 md:py-4 rounded-full cursor-pointer transition-opacity hover:opacity-85 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="border-t border-[rgba(255,255,255,0.08)] py-8 md:py-12">
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[88px]">
            <div className="flex flex-col md:flex-row items-start justify-center gap-0">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 px-0 md:px-8 py-4 md:py-0 border-l-0 md:border-l border-[rgba(255,255,255,0.08)] flex-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <path d="M2 8L8 2L14 8L8 14L2 8Z" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                <div className="text-sm font-medium text-white">
                  Curated venues & vendors
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 px-0 md:px-8 py-4 md:py-0 border-l-0 md:border-l border-[rgba(255,255,255,0.08)] flex-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                <div className="text-sm font-medium text-white">
                  Seamless on the day
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 px-0 md:px-8 py-4 md:py-0 border-l-0 md:border-l border-[rgba(255,255,255,0.08)] flex-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <path d="M2 13L8 2L14 13H2Z" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                <div className="text-sm font-medium text-white">
                  Book faster, plan smarter
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
