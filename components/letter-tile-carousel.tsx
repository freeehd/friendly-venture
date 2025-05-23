"use client"

import { useState, useRef, useEffect } from "react"

interface LetterTile {
  letter: string
  isSpecial: boolean
}

export default function LetterTileCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredColor, setHoveredColor] = useState<string>("")

  // Create a longer array of tiles that will repeat
  const baseTiles: LetterTile[] = [
    { letter: "C", isSpecial: false },
    { letter: "R", isSpecial: false },
    { letter: "E", isSpecial: false },
    { letter: "A", isSpecial: false },
    { letter: "T", isSpecial: false },
    { letter: "♦", isSpecial: true },
    { letter: "I", isSpecial: false },
    { letter: "D", isSpecial: false },
    { letter: "E", isSpecial: false },
    { letter: "A", isSpecial: false },
    { letter: "S", isSpecial: false },
    { letter: "♦", isSpecial: true },
    { letter: "F", isSpecial: false },
    { letter: "U", isSpecial: false },
    { letter: "N", isSpecial: false },
  ]

  // Duplicate the tiles to create a seamless loop
  const letterTiles = [...baseTiles, ...baseTiles, ...baseTiles]

  // Generate a random pastel color
  const generatePastelColor = () => {
    // Generate pastel colors by using high lightness values
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
    const lightness = Math.floor(Math.random() * 15) + 75 // 75-90%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // Handle mouse enter on a tile
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setHoveredColor(generatePastelColor())
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  // Animation for the carousel
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    let position = 0
    const speed = 0.5 // pixels per frame
    const tileWidth = 72 // width + gap of each tile
    const totalWidth = baseTiles.length * tileWidth

    const animate = () => {
      position -= speed

      // Reset position when we've moved one full set of tiles
      if (position <= -totalWidth) {
        position += totalWidth
      }

      container.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [baseTiles.length])

  return (
    <div className="w-full overflow-hidden py-6 px-4 border-x-4 border-b-4 border-[#141b33] bg-white">
      <div className="relative">
        <div ref={containerRef} className="flex gap-2 transition-transform" style={{ willChange: "transform" }}>
          {letterTiles.map((tile, index) => (
            <div
              key={index}
              className={`${
                tile.isSpecial
                  ? "w-12 h-12 flex items-center justify-center text-[#141b33] text-3xl transition-colors duration-300"
                  : "w-16 h-16 flex items-center justify-center bg-[#141b33] text-white text-3xl font-bold transition-colors duration-300"
              }`}
              style={{
                backgroundColor:
                  !tile.isSpecial && hoveredIndex === index ? hoveredColor : tile.isSpecial ? "transparent" : "#141b33",
                color: !tile.isSpecial && hoveredIndex === index ? "#141b33" : tile.isSpecial ? "#141b33" : "white",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {tile.letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
