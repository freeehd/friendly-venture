"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import PlayingCard from "@/components/playing-card"

export default function CurvedCardCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(4)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number; scale: number }[]>([])
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const [viewportWidth, setViewportWidth] = useState(0)

  // Create an array of cards (alternating between face and back)
  const cards = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    type: i % 2 === 0 ? "back" : "face",
    value: "K",
    suit: "clubs",
  }))

  // Update viewport width on resize
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }

    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)
    return () => window.removeEventListener("resize", updateViewportWidth)
  }, [])

  // Calculate card positions for the curved layout
  useEffect(() => {
    if (!carouselRef.current) return

    const calculatePositions = () => {
      const positions = cards.map((_, index) => {
        // Calculate distance from center (positive or negative)
        const distanceFromCenter = index - activeIndex

        // Create a parabolic curve with the center at the highest point
        // Increase the multiplier to make the curve more pronounced
        const yOffset = distanceFromCenter ** 2 * 20

        // Calculate scale based on distance from center
        const scale = 1 - Math.min(Math.abs(distanceFromCenter) * 0.08, 0.3)

        return {
          x: 0,
          y: yOffset,
          scale,
        }
      })
      setCardPositions(positions)
    }

    calculatePositions()

    // Recalculate on window resize
    window.addEventListener("resize", calculatePositions)
    return () => window.removeEventListener("resize", calculatePositions)
  }, [activeIndex, cards.length])

  // Handle auto-scrolling
  useEffect(() => {
    const startAutoScroll = () => {
      if (!autoScrollEnabled || isHovering || isDragging) return

      autoScrollRef.current = setTimeout(() => {
        if (carouselRef.current) {
          const newIndex = (activeIndex + 1) % cards.length
          scrollToCard(newIndex)
        }
        startAutoScroll()
      }, 3000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollRef.current) {
        clearTimeout(autoScrollRef.current)
      }
    }
  }, [activeIndex, autoScrollEnabled, isHovering, isDragging, cards.length])

  // Scroll to a specific card
  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    const cardWidth = carousel.scrollWidth / cards.length
    const newScrollLeft = index * cardWidth

    carousel.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })

    setActiveIndex(index)
  }

  // Handle mouse down event for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current!.offsetLeft)
    setScrollLeft(carouselRef.current!.scrollLeft)
    document.body.style.cursor = "grabbing"
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovering(false)
    document.body.style.cursor = "default"
  }

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.cursor = "default"

    // Snap to the nearest card
    if (carouselRef.current) {
      const carousel = carouselRef.current
      const cardWidth = carousel.scrollWidth / cards.length
      const index = Math.round(carousel.scrollLeft / cardWidth)
      scrollToCard(index)
    }
  }

  // Handle mouse move event for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const carousel = carouselRef.current!
    const x = e.pageX - carousel.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    carousel.scrollLeft = scrollLeft - walk

    // Update active index based on scroll position
    const cardWidth = carousel.scrollWidth / cards.length
    const index = Math.round(carousel.scrollLeft / cardWidth)
    if (index !== activeIndex && index >= 0 && index < cards.length) {
      setActiveIndex(index)
    }
  }

  // Handle scroll event
  const handleScroll = () => {
    if (!carouselRef.current || isDragging) return

    const carousel = carouselRef.current
    const cardWidth = carousel.scrollWidth / cards.length
    const index = Math.round(carousel.scrollLeft / cardWidth)

    if (index !== activeIndex && index >= 0 && index < cards.length) {
      setActiveIndex(index)
    }
  }

  // Handle card click to flip
  const handleCardClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Determine if a card is adjacent to the active card
  const isAdjacentCard = (index: number) => {
    return Math.abs(index - activeIndex) <= 2
  }

  // Calculate visible cards based on viewport width
  const getVisibleCardCount = () => {
    if (viewportWidth < 640) return 3
    if (viewportWidth < 1024) return 5
    return 7
  }

  const visibleCardCount = getVisibleCardCount()

  return (
    <div
      className="relative w-full max-w-6xl overflow-hidden py-24"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: isDragging ? "auto" : "smooth",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
      >
        {cards.map((card, index) => {
          const isActive = index === activeIndex
          const isAdjacent = isAdjacentCard(index)
          const isFlipped = flippedCards.has(index)
          const position = cardPositions[index] || { x: 0, y: 0, scale: 1 }

          // Calculate card width based on visible card count
          const cardWidthPercentage = 100 / visibleCardCount

          return (
            <div
              key={index}
              className="flex-shrink-0 snap-center flex justify-center items-center"
              style={{
                width: `${cardWidthPercentage}%`,
                transform: `translateY(${position.y}px)`,
                transition: "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
              }}
            >
              <div
                className={`relative ${isActive ? "z-10" : isAdjacent ? "z-5" : "z-0"}`}
                style={{
                  transform: `scale(${position.scale})`,
                  transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => handleCardClick(index, e)}
              >
                <PlayingCard
                  card={card}
                  isFlipped={isFlipped}
                  isActive={isActive}
                  isAdjacent={isAdjacent}
                  size={isActive ? "large" : "medium"}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${index === activeIndex ? "bg-white" : "bg-gray-600"}`}
            onClick={() => scrollToCard(index)}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
