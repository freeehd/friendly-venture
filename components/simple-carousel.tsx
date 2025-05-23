"use client"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface SimpleCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

export default function SimpleCarousel({ children, autoScrollInterval = 3000 }: SimpleCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const itemWidthRef = useRef(0)
  const totalItemsRef = useRef(0)

  // Initialize refs array for carousel items
  const childrenArray = Array.isArray(children) ? children : [children]
  totalItemsRef.current = childrenArray.length
  itemsRef.current = itemsRef.current.slice(0, childrenArray.length)

  // Calculate the curved position and rotation for each item
  const getItemStyle = useCallback(
    (index: number) => {
      // Calculate distance from center (can be positive or negative)
      const distanceFromCenter = index - activeIndex

      // Create a parabolic curve with the center at the highest point
      const yOffset = Math.pow(distanceFromCenter, 2) * 10

      // Calculate rotation based on distance from center
      // Negative rotation for items on the left, positive for right
      const rotation = distanceFromCenter * 5 // 5 degrees per position from center

      // Calculate scale based on distance from center
      const scale = 1 - Math.min(Math.abs(distanceFromCenter) * 0.05, 0.15)

      // Calculate z-index to ensure proper stacking
      const zIndex = 100 - Math.abs(distanceFromCenter)

      return {
        transform: `translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
      }
    },
    [activeIndex],
  )

  // Calculate item width and update on resize
  const updateItemWidth = useCallback(() => {
    if (!carouselRef.current) return

    const containerWidth = carouselRef.current.clientWidth
    const visibleItems = Math.min(5, totalItemsRef.current)
    itemWidthRef.current = containerWidth / visibleItems
  }, [])

  // Initialize dimensions
  useEffect(() => {
    updateItemWidth()
    window.addEventListener("resize", updateItemWidth)
    return () => window.removeEventListener("resize", updateItemWidth)
  }, [updateItemWidth])

  // Custom scroll animation function
  const animateToIndex = useCallback(
    (targetIndex: number, duration = 300) => {
      if (!carouselRef.current || isAnimating) return

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      setIsAnimating(true)

      const startTime = performance.now()
      const startScrollLeft = carouselRef.current.scrollLeft
      const targetScrollLeft = targetIndex * itemWidthRef.current
      const scrollDistance = targetScrollLeft - startScrollLeft

      const animateFrame = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)

        // Easing function - easeOutQuad
        const easeProgress = 1 - (1 - progress) * (1 - progress)

        if (carouselRef.current) {
          carouselRef.current.scrollLeft = startScrollLeft + scrollDistance * easeProgress
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateFrame)
        } else {
          // Animation complete
          setActiveIndex(targetIndex)
          setIsAnimating(false)
          animationRef.current = null
        }
      }

      animationRef.current = requestAnimationFrame(animateFrame)
    },
    [isAnimating],
  )

  // Handle card click
  const handleCardClick = useCallback(
    (index: number) => {
      // Mark as user interaction
      setIsUserInteracting(true)

      // Reset the interaction timeout
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current)
      }

      // Set a timeout to mark the end of user interaction
      interactionTimerRef.current = setTimeout(() => {
        setIsUserInteracting(false)
      }, 5000) // Consider user done interacting after 5 seconds

      // Animate to the clicked card
      animateToIndex(index)
    },
    [animateToIndex],
  )

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = () => {
      if (isUserInteracting || isAnimating) return

      const nextIndex = (activeIndex + 1) % totalItemsRef.current
      animateToIndex(nextIndex)
    }

    // Set up auto-scroll timer
    autoScrollTimerRef.current = setInterval(autoScroll, autoScrollInterval)

    // Clean up on unmount or when dependencies change
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [activeIndex, isUserInteracting, isAnimating, animateToIndex, autoScrollInterval])

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

  // Handle scroll events to update active index
  const handleScroll = useCallback(() => {
    if (!carouselRef.current || isAnimating) return

    const { scrollLeft } = carouselRef.current
    const newIndex = Math.round(scrollLeft / itemWidthRef.current)

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
    }
  }, [activeIndex, isAnimating])

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto hide-scrollbar py-20 px-4"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "none", // Disable native snap scrolling
        }}
      >
        {/* Render carousel items with curved and tilted layout */}
        {childrenArray.map((child, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className="flex-shrink-0 transition-transform duration-300 cursor-pointer"
            style={{
              ...getItemStyle(index),
              width: `${100 / Math.min(5, childrenArray.length)}%`, // Show up to 5 cards at once
              padding: "0 10px",
            }}
            onClick={() => handleCardClick(index)}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
