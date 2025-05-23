"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import TiltCard from "@/components/tilt-card"
import { usePhysicsScroll } from "@/hooks/use-physics-scroll"

// Generate card data
const generateCards = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    type: i % 2 === 0 ? "back" : "face",
    value: "K",
    suit: "clubs",
    isFlipped: false,
  }))
}

export default function PhysicsCardCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState(generateCards(12))
  const [activeIndex, setActiveIndex] = useState(2)
  const [cardWidth, setCardWidth] = useState(240)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [visibleCards, setVisibleCards] = useState(5)
  const [isDraggingState, setIsDraggingState] = useState(false)
  const lastClickTime = useRef(0)

  // Calculate card width and container width on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      setContainerWidth(container.clientWidth)

      // Determine number of visible cards based on screen width
      let newVisibleCards = 5 // Default for medium screens
      if (window.innerWidth < 640) {
        newVisibleCards = 3 // Small screens
      } else if (window.innerWidth >= 1280) {
        newVisibleCards = 7 // Large screens
      }
      setVisibleCards(newVisibleCards)

      // Calculate card width based on container size and visible cards
      // Make cards slightly smaller to ensure proper spacing and prevent clipping
      const newCardWidth = Math.min(220, container.clientWidth / newVisibleCards - 40)
      setCardWidth(newCardWidth)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Calculate the curved position for each card
  const getCardStyle = useCallback(
    (index: number) => {
      const distanceFromActive = index - activeIndex

      // Create a more pronounced parabolic curve with the center at the highest point
      // Increase the multiplier to make the curve more visible
      const yOffset = Math.pow(distanceFromActive, 2) * 8

      // Calculate scale based on distance from center
      // Center card is 100%, cards further away are smaller
      const scale = 1 - Math.min(Math.abs(distanceFromActive) * 0.05, 0.15)

      // Calculate z-index to ensure proper stacking
      const zIndex = 100 - Math.abs(distanceFromActive)

      return {
        transform: `translateY(${yOffset}px) scale(${scale})`,
        zIndex,
      }
    },
    [activeIndex],
  )

  // Set up physics-based scrolling
  const { scrollRef, isDragging, handleMouseDown, handleTouchStart } = usePhysicsScroll({
    onScroll: (scrollLeft) => {
      // Calculate active index based on scroll position
      if (!containerRef.current) return

      // Each card takes up cardWidth + gap (20px)
      const itemWidth = cardWidth + 40 // Increased gap to prevent clipping
      const newActiveIndex = Math.round(scrollLeft / itemWidth)

      if (newActiveIndex !== activeIndex && newActiveIndex >= 0 && newActiveIndex < cards.length) {
        setActiveIndex(newActiveIndex)
      }
    },
    sensitivity: 1.2, // Adjust for faster/slower scrolling
    friction: 0.92, // Adjust for more/less momentum (0-1)
    elasticBoundary: true, // Enable elastic boundaries
    maxElasticDistance: 150, // Maximum elastic distance in pixels
    onDragChange: (dragging) => {
      setIsDraggingState(dragging)
    },
  })

  // Handle card flip
  const handleCardFlip = (index: number) => {
    // Prevent flip during drag or if clicked too quickly (debounce)
    const now = Date.now()
    if (isDraggingState || now - lastClickTime.current < 300) return
    lastClickTime.current = now

    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, isFlipped: !card.isFlipped } : card)))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const newIndex = Math.max(0, activeIndex - 1)
        scrollToCard(newIndex)
      } else if (e.key === "ArrowRight") {
        const newIndex = Math.min(cards.length - 1, activeIndex + 1)
        scrollToCard(newIndex)
      } else if (e.key === "Enter" || e.key === " ") {
        handleCardFlip(activeIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, cards.length])

  // Scroll to a specific card
  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return

    const itemWidth = cardWidth + 40 // Increased gap to prevent clipping
    scrollRef.current.scrollLeft = index * itemWidth
    setActiveIndex(index)
  }

  // Calculate total carousel width
  const totalWidth = cards.length * (cardWidth + 40) // Increased gap to prevent clipping

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-24" // Increased vertical padding for the curve
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Card carousel"
      role="region"
      tabIndex={0}
    >
      <div
        ref={scrollRef}
        className="flex items-center px-[calc(50%-120px)] cursor-grab active:cursor-grabbing"
        style={{
          width: `${totalWidth}px`,
          height: "400px",
          touchAction: "pan-y",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {cards.map((card, index) => {
          const style = getCardStyle(index)
          const isActive = index === activeIndex
          const isNearActive = Math.abs(index - activeIndex) <= 2

          return (
            <div
              key={card.id}
              className="flex-shrink-0 px-5 transition-transform duration-300"
              style={style}
              aria-label={`Card ${index + 1} of ${cards.length}`}
              aria-current={isActive ? "true" : "false"}
            >
              <TiltCard
                card={card}
                width={cardWidth}
                height={cardWidth * 1.4}
                isActive={isActive}
                isInteractive={isNearActive && !isDraggingState}
                tiltMaxAngle={20}
                glareOpacity={0.2}
                scale={1.02}
                onFlip={() => handleCardFlip(index)}
              />
            </div>
          )
        })}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          onClick={() => scrollToCard(Math.min(cards.length - 1, activeIndex + 1))}
          disabled={activeIndex === cards.length - 1}
          aria-label="Next card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
