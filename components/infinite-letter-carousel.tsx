"use client"

import { useRef, useEffect, useState } from "react"

interface LetterTile {
  letter: string
  isSpecial: boolean
}

export default function InfiniteLetterCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredTiles, setHoveredTiles] = useState<Record<number, string>>({})

  // Base set of tiles - using "LOREM IPSUM" with diamond separators
  const baseTiles: LetterTile[] = [
    { letter: "C", isSpecial: false },
    { letter: "R", isSpecial: false },
    { letter: "E", isSpecial: false },
    { letter: "A", isSpecial: false },
    { letter: "T", isSpecial: false },
    { letter: "I", isSpecial: false },
    { letter: "V", isSpecial: false },
    { letter: "E", isSpecial: false },
    { letter: "♦", isSpecial: true },
    { letter: "T", isSpecial: false },
    { letter: "E", isSpecial: false },
    { letter: "C", isSpecial: false },
    { letter: "H", isSpecial: false },
    { letter: "♦", isSpecial: true },
    { letter: "S", isSpecial: false },
    { letter: "Q", isSpecial: false },
    { letter: "U", isSpecial: false },
    { letter: "A", isSpecial: false },
    { letter: "D", isSpecial: false },
  ]

  // Generate a random bright pastel color
  const generatePastelColor = () => {
    // Generate pastel colors by using high lightness values
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
    const lightness = Math.floor(Math.random() * 15) + 75 // 75-90%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // Handle mouse enter on a tile
  const handleMouseEnter = (index: number) => {
    setHoveredTiles((prev) => ({
      ...prev,
      [index]: generatePastelColor(),
    }))
  }

  // Handle mouse leave
  const handleMouseLeave = (index: number) => {
    setHoveredTiles((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  // Set up the animation
  useEffect(() => {
    if (!scrollContainerRef.current) return

    const scrollContainer = scrollContainerRef.current
    const scrollSpeed = 0.5 // pixels per frame

    let animationId: number
    let currentPosition = 0

    // Calculate the width of a single tile set including the actual gaps
    const tileWidth = 50 // Width of actual tile
    const gapWidth = 70 // Width of gap between tiles
    const totalWidthPerTile = tileWidth + gapWidth
    const singleSetWidth = baseTiles.length * totalWidthPerTile

    const animate = () => {
      currentPosition -= scrollSpeed

      // If we've scrolled past one complete set, reset to beginning
      if (currentPosition <= -singleSetWidth) {
        currentPosition += singleSetWidth
      }

      if (scrollContainer) {
        scrollContainer.style.transform = `translateX(${currentPosition}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [baseTiles.length])

  // Create multiple sets of tiles for the infinite scroll effect
  const allTiles = [...baseTiles, ...baseTiles, ...baseTiles, ...baseTiles, ...baseTiles]

  return (
    <div className="w-full max-w-[1500px] mx-auto overflow-hidden bg-white border-x-4 border-b-4 border-[#141b33]">
      <div className="relative py-4 md:py-8 px-2 md:px-4">
        <div ref={scrollContainerRef} className="flex" style={{ willChange: "transform" }}>
          {allTiles.map((tile, index) => (
            <div
              key={index}
              style={{
                marginRight: "5px", // Large visible spacing between tiles
              }}
            >
              {tile.isSpecial ? (
                // Diamond symbol
                <div className="text-[#141b33] text-2xl md:text-3xl flex items-center justify-center w-[40px] md:w-[50px] h-[40px] md:h-[50px]">
                  ♦
                </div>
              ) : (
                // Letter tile with hover effect
                <div
                  className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] flex items-center justify-center text-xl md:text-2xl font-bold rounded-lg transition-colors duration-100"
                  style={{
                    backgroundColor: hoveredTiles[index] || "#141b33",
                    color: hoveredTiles[index] ? "#141b33" : "white",
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {tile.letter}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
