"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface CurvedCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

export default function CurvedCarousel({ children, autoScrollInterval = 3000 }: CurvedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [virtualIndex, setVirtualIndex] = useState(0) // Can go beyond array bounds
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  // Increased visible range to include off-screen cards
  const visibleRange = 3 // Now showing 7 cards (3 on each side + center)
  const fadeInRange = 2.5 // Cards start fading in at this distance

  // Animation refs
  const animationRef = useRef<number | null>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastDirectionRef = useRef<"left" | "right">("right")
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Get the actual index from the virtual index
  const getActualIndex = useCallback(
    (virtualIdx: number) => {
      return ((virtualIdx % totalItems) + totalItems) % totalItems
    },
    [totalItems],
  )

  // Get the current actual index
  const currentIndex = getActualIndex(virtualIndex)

  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (trackRef.current) {
        setContainerWidth(trackRef.current.clientWidth)
        setContainerHeight(trackRef.current.clientHeight)
      }
    }

    // Initial dimensions
    updateDimensions()

    // Set up resize observer for more responsive updates
    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(updateDimensions)
      if (trackRef.current) {
        resizeObserverRef.current.observe(trackRef.current)
      }
    } else {
      // Fallback to window resize event
      window.addEventListener("resize", updateDimensions)
    }

    return () => {
      if (resizeObserverRef.current && trackRef.current) {
        resizeObserverRef.current.unobserve(trackRef.current)
        resizeObserverRef.current.disconnect()
      }
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Generate the visible cards based on the virtual index
  const getVisibleCards = useCallback(() => {
    const cards = []

    // Generate cards for the visible range around the current virtual index
    // Include extra cards that will be off-screen but fading in
    for (let i = virtualIndex - visibleRange; i <= virtualIndex + visibleRange; i++) {
      const actualIndex = getActualIndex(i)
      cards.push({
        virtualIndex: i,
        actualIndex,
        relativePosition: i - virtualIndex,
      })
    }

    return cards
  }, [virtualIndex, visibleRange, getActualIndex])

  // Calculate positions for each card along the fixed curve
  const getCardStyle = useCallback(
    (relativePosition: number) => {
      // Card sizing - much larger to match reference image
      // In the reference, cards take up about 25-30% of screen width
      const baseCardWidth = Math.min(320, containerWidth * 0.25)

      // Curve parameters - match reference image
      const curveDepth = 40 // Pronounced curve
      const rotationFactor = 12 // More rotation to match reference

      // Calculate vertical position along the parabolic curve
      const yPosition = Math.pow(relativePosition, 2) * curveDepth

      // Calculate rotation (tilt) based on position
      const rotation = relativePosition * rotationFactor

      // Calculate horizontal position with wider spacing to match reference
      // Position off-screen cards further out to create the appearance of coming in from off-screen
      const spacing = containerWidth * 0.22 // Increased spacing between cards
      const xPosition = relativePosition * spacing

      // Calculate z-index to ensure proper stacking
      // Use a high base value to ensure cards are above other content
      const zIndex = 1000 - Math.abs(relativePosition)

      // Add a slight scale effect for cards further from center
      const scale = 1 - Math.min(Math.abs(relativePosition) * 0.02, 0.1)

      // Calculate opacity based on distance from center
      // Cards beyond fadeInRange will start with opacity 0 and fade in as they get closer
      const distanceFromCenter = Math.abs(relativePosition)
      const opacity = distanceFromCenter > fadeInRange ? Math.max(0, 1 - (distanceFromCenter - fadeInRange) * 2) : 1

      return {
        transform: `translateX(${xPosition}px) translateY(${yPosition}px) rotate(${rotation}deg) scale(${scale})`,
        width: `${baseCardWidth}px`,
        opacity,
        zIndex,
        transition: isAnimating
          ? "all 500ms cubic-bezier(0.25, 0.1, 0.25, 1.0)"
          : "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      }
    },
    [isAnimating, containerWidth],
  )

  // Move to a specific virtual index
  const moveToIndex = useCallback(
    (targetVirtualIndex: number) => {
      if (isAnimating) return

      // Determine direction of movement
      const direction = targetVirtualIndex > virtualIndex ? "right" : "left"
      lastDirectionRef.current = direction

      // Set animating state to trigger smooth transitions
      setIsAnimating(true)
      setVirtualIndex(targetVirtualIndex)

      // Reset animating state after transition completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    },
    [isAnimating, virtualIndex],
  )

  // Handle card click - move one card in the direction of the clicked card
  const handleCardClick = useCallback(
    (clickedVirtualIndex: number) => {
      // Mark as user interaction
      setIsUserInteracting(true)

      // Reset the interaction timeout
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current)
      }

      // Set a timeout to mark the end of user interaction
      interactionTimerRef.current = setTimeout(() => {
        setIsUserInteracting(false)
      }, 5000)

      // Determine the direction based on the clicked card's position relative to center
      if (clickedVirtualIndex > virtualIndex) {
        // Card is to the right of center - move one card right
        moveToIndex(virtualIndex + 1)
      } else if (clickedVirtualIndex < virtualIndex) {
        // Card is to the left of center - move one card left
        moveToIndex(virtualIndex - 1)
      }
      // If center card is clicked, do nothing
    },
    [moveToIndex, virtualIndex],
  )

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = () => {
      if (isUserInteracting || isAnimating) return

      // Continue in the last direction used
      const nextIndex = virtualIndex + (lastDirectionRef.current === "right" ? 1 : -1)
      moveToIndex(nextIndex)
    }

    // Set up auto-scroll timer
    autoScrollTimerRef.current = setInterval(autoScroll, autoScrollInterval)

    // Clean up on unmount or when dependencies change
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [virtualIndex, isUserInteracting, isAnimating, moveToIndex, autoScrollInterval])

  // Handle user interaction
  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true)

    // Clear any existing timeout
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current)
    }

    // Set a timeout to mark the end of user interaction
    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000)
  }, [])

  // Clean up all animations and timers on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current)
      }
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        moveToIndex(virtualIndex - 1)
      } else if (e.key === "ArrowRight") {
        moveToIndex(virtualIndex + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [virtualIndex, moveToIndex])

  // Handle touch events for swiping
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX
      touchStartYRef.current = e.touches[0].clientY
      handleUserInteraction()
    },
    [handleUserInteraction],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY

      const deltaX = touchEndX - touchStartXRef.current
      const deltaY = touchEndY - touchStartYRef.current

      // Only handle horizontal swipes (ignore vertical swipes)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swiped right
          moveToIndex(virtualIndex - 1)
        } else {
          // Swiped left
          moveToIndex(virtualIndex + 1)
        }
      }
    },
    [virtualIndex, moveToIndex],
  )

  // Get the visible cards
  const visibleCards = getVisibleCards()

  return (
    <div
      className="relative w-full overflow-visible py-24"
      style={{ zIndex: 9999 }}
      onMouseDown={handleUserInteraction}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed track that doesn't scroll - with high z-index but original spacing */}
      <div
        ref={trackRef}
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        {/* Render visible cards and off-screen cards that are fading in */}
        {visibleCards.map(({ virtualIndex: vIndex, actualIndex, relativePosition }) => {
          const style = getCardStyle(relativePosition)
          const isActive = vIndex === virtualIndex

          return (
            <div
              key={`v-${vIndex}`}
              className={`absolute top-0  -translate-x-1/2 cursor-pointer aspect-[2.5/3.5] rounded-lg shadow-xl ${
                isActive ? "" : ""
              }`}
              style={style}
              onClick={() => handleCardClick(vIndex)}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={`Card ${actualIndex + 1} of ${totalItems}`}
              aria-current={isActive ? "true" : "false"}
            >
              {childrenArray[actualIndex]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
