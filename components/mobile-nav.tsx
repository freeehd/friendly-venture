"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface MobileNavProps {
  isScrolled: boolean
  activeLink: string
  setActiveLink: (link: string) => void
}

export default function MobileNav({ isScrolled, activeLink, setActiveLink }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Our Vibe", id: "values" },
    { name: "Dream Team", id: "dream-team" },
    { name: "Projects", id: "projects", href: "/projects" },
    { name: "Hit Us Up", id: "contact" },
  ]

  // Close menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleLinkClick = (link: (typeof navLinks)[0]) => {
    if (!link.href) {
      setActiveLink(link.id)
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`relative z-50 p-2 rounded-full border-2 border-[#141b33] bg-white transition-all duration-300 focus-ring ${
          isScrolled ? "scale-90" : "scale-100"
        }`}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-[#141b33] transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#141b33] mt-1 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#141b33] mt-1 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white border-l-4 border-[#141b33] z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pt-20">
          <h2 className="text-2xl font-bold text-[#141b33] mb-8">Navigation</h2>
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href || `#${link.id}`}
                onClick={() => handleLinkClick(link)}
                className={`block py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                  activeLink === link.id ? "bg-[#141b33] text-white" : "bg-gray-100 text-[#141b33] hover:bg-gray-200"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
