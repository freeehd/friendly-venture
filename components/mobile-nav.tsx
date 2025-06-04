"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface MobileNavProps {
  isScrolled: boolean
  activeLink: string
  setActiveLink: (link: string) => void
  isProjectsPage: boolean
}

export default function MobileNav({ isScrolled, activeLink, setActiveLink, isProjectsPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = isProjectsPage 
    ? [{ name: "Home", id: "home", href: "/" }]
    : [
        { name: "Home", id: "home" },
        { name: "Our Vibe", id: "values" },
        { name: "Dream Team", id: "dream-team" },
        { name: "Hit Us Up", id: "contact" },
        { name: "Projects", id: "projects", href: "/projects" },
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
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm border-4 border-[#141b33] transition-all duration-300 ${
          isScrolled ? "scale-90" : "scale-100"
        } ${isOpen ? "rotate-90" : ""}`}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
          <span
            className={`block w-5 h-0.5 bg-[#141b33] transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-[#141b33] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-[#141b33] transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href || `#${link.id}`}
              onClick={(e) => {
                if (!link.href) {
                  e.preventDefault()
                  setActiveLink(link.id)
                  document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
                }
                setIsOpen(false)
              }}
              className={`text-2xl font-bold transition-all duration-300 ${
                activeLink === link.id || (isProjectsPage && link.id === "home")
                  ? "text-[#141b33] scale-110"
                  : "text-gray-600 hover:text-[#141b33] hover:scale-105"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
