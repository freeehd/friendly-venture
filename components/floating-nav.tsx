"use client"

import { useState } from "react"
import Link from "next/link"

export default function FloatingNav() {
  const [activeTab, setActiveTab] = useState<"work" | "play">("play")

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-full border-4 border-[#141b33] flex items-center p-2 shadow-lg">
        {/* Work Button */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setActiveTab("work")
          }}
          className={`px-8 py-2 rounded-full font-bold text-lg transition-colors ${
            activeTab === "work" ? "bg-[#141b33] text-white" : "bg-white text-[#141b33] border border-[#141b33]"
          }`}
        >
          WORK
        </Link>

        {/* Center Logo */}
        <div className="mx-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#141b33] flex items-center justify-center relative">
            {/* Lightbulb icon with radiating lines */}
            <div className="absolute">
              {/* Radiating lines */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-10 h-[1px] bg-[#141b33] origin-center"
                  style={{
                    transform: `rotate(${i * 22.5}deg) translateX(6px)`,
                    left: "50%",
                    top: "50%",
                  }}
                />
              ))}

              {/* Lightbulb */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#141b33"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setActiveTab("play")
          }}
          className={`px-8 py-2 rounded-full font-bold text-lg transition-colors ${
            activeTab === "play" ? "bg-[#141b33] text-white" : "bg-white text-[#141b33] border border-[#141b33]"
          }`}
        >
          PLAY
        </Link>
      </div>
    </div>
  )
}
