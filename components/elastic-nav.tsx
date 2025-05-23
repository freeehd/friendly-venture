"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function ElasticNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("home")

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Our Vibe", id: "values" },
    { name: "Dream Team", id: "team" },
    { name: "Portfolio", id: "projects" },
    { name: "Hit Us Up", id: "contact" },
  ]

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ease-in-out ${
        scrolled ? "py-2" : "py-4 md:py-6"
      }`}
    >
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-full border-4 border-[#141b33] flex flex-wrap justify-center items-center px-2 md:px-4 transition-all duration-500 ease-in-out ${
          scrolled ? "py-1 shadow-md scale-95" : "py-2 md:py-3 shadow-xl scale-100 hover:scale-105"
        }`}
        style={{
          transform: `translateY(${scrolled ? "0" : "10px"})`,
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveLink(link.id)
              document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`px-3 md:px-6 mx-1 md:mx-2 py-1 md:py-2 my-1 rounded-full font-bold transition-all duration-300 ease-in-out text-sm md:text-base ${
              scrolled ? "text-sm" : "text-base md:text-lg"
            } ${
              activeLink === link.id
                ? "bg-[#141b33] text-white hover:bg-[#1f2b4d] hover:scale-105 shadow-md"
                : "bg-white text-[#141b33] border border-[#141b33] hover:bg-gray-100 hover:scale-105 hover:shadow-md"
            }`}
            style={{
              transform: activeLink === link.id ? "translateY(-2px)" : "none",
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
