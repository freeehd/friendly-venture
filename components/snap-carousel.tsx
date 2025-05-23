"use client"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface SnapCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

export default function SnapCarousel({ children, autoScrollInterval = 5000 }: SnapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  // Current centered index and animation state
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  // Animation refs
  const animationProgress = useRef(0) // 0 to 1 for animation
  const targetIndex = useRef(activeIndex)
  const startTime = useRef(0)
  const animationId = useRef<number | null>(null)
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null)
  const isUserInteracting = useRef(false)
  const userInteractionTimer = useRef<NodeJS.Timeout | null>(null)

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Animate between indices with physics
  const animateToIndex = useCallback(
    (targetIdx: number) => {
      // Don't animate if already at target or currently animating
      if (targetIdx === activeIndex || isAnimating) return

      // Only allow moving one card at a time
      const newTargetIdx = targetIdx > activeIndex ? activeIndex + 1 : activeIndex - 1

      targetIndex.current = newTargetIdx
      startTime.current = performance.now()
      setIsAnimating(true)

      // Cancel any existing animation
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }

      // Start animation
      const animate = (time: number) => {
        const elapsed = time - startTime.current
        const duration = 600 // Animation duration in ms

        if (elapsed < duration) {
          // Calculate progress with easing
          // Using custom easing function for that weighty feel
          const t = elapsed / duration

          // Custom easing function that gives a weighty, springy feel
          // Overshoots slightly and then settles
          const easeOutBack = (x: number) => {
            const c1 = 1.70158
            const c3 = c1 + 1
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
          }

          animationProgress.current = easeOutBack(t)

          // Continue animation
          animationId.current = requestAnimationFrame(animate)
        } else {
          // Animation complete
          animationProgress.current = 1
          setActiveIndex(newTargetIdx)
          setIsAnimating(false)
          animationId.current = null
        }
      }

      animationId.current = requestAnimationFrame(animate)
    },
    [activeIndex, isAnimating],
  )

  // Handle card click
  const handleCardClick = useCallback(
    (index: number) => {
      // Only allow clicking if not currently animating
      if (isAnimating) return

      // Mark as user interaction
      isUserInteracting.current = true
      if (userInteractionTimer.current) {
        clearTimeout(userInteractionTimer.current)
      }

      // Set a timeout to mark the end of user interaction
      userInteractionTimer.current = setTimeout(() => {
        isUserInteracting.current = false
      }, 5000)

      // Animate to the clicked card (but only one step at a time)
      animateToIndex(index)
    },
    [animateToIndex, isAnimating],
  )

  // Auto-scroll
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        if (!isUserInteracting.current && !isAnimating) {
          // Move to next card
          const nextIndex = (activeIndex + 1) % totalItems
          animateToIndex(nextIndex)
        }
      }, autoScrollInterval)
    }

    startAutoScroll()
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current)
      }
    }
  }, [activeIndex, animateToIndex, autoScrollInterval, isAnimating, totalItems])

  // Clean up
  useEffect(() => {
    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current)
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
      if (userInteractionTimer.current) clearTimeout(userInteractionTimer.current)
    }
  }, [])

  // Calculate card positions
  const getCardStyle = useCallback(
    (index: number) => {
      // Calculate position relative to center
      let relativePosition = index - activeIndex

      // If animating, interpolate between positions
      if (isAnimating) {
        const targetRelativePosition = index - targetIndex.current
        const sourceRelativePosition = index - activeIndex
        relativePosition =
          sourceRelativePosition + (targetRelativePosition - sourceRelativePosition) * animationProgress.current
      }

      // Calculate curve and rotation
      const yOffset = Math.pow(relativePosition, 2) * 30
      const rotation = relativePosition * 10
      const scale = 1 - Math.min(Math.abs(relativePosition) * 0.05, 0.2)

      // Calculate card spacing based on container width
      const cardSpacing = Math.min(250, containerWidth * 0.22)
      const xOffset = relativePosition * cardSpacing

      // Calculate z-index and opacity
      const zIndex = 1000 - Math.abs(relativePosition) * 10
      const opacity = Math.abs(relativePosition) > 2.5 ? Math.max(0, 1 - (Math.abs(relativePosition) - 2.5) * 2) : 1

      return {
        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex: Math.round(zIndex),
        opacity,
      }
    },
    [activeIndex, isAnimating, containerWidth],
  )

  // Determine visible cards
  const visibleCards = useCallback(() => {
    const visibleRange = 4 // Show 4 cards on each side
    const cards = []

    for (let i = activeIndex - visibleRange; i <= activeIndex + visibleRange; i++) {
      const actualIndex = ((i % totalItems) + totalItems) % totalItems
      cards.push({ index: i, actualIndex })
    }

    return cards
  }, [activeIndex, totalItems])

  return (
    <div className="relative w-full overflow-visible py-24" style={{ zIndex: 9999 }} ref={containerRef}>
      <div className="relative w-full h-[400px] flex items-center justify-center">
        {visibleCards().map(({ index, actualIndex }) => {
          const style = getCardStyle(index)
          const isActive = index === activeIndex
          const isClickable = Math.abs(index - activeIndex) <= 1 // Only allow clicking adjacent cards

          return (
            <div
              key={`card-${index}`}
              className={`absolute top-0 left-1/2 -translate-x-1/2 aspect-[2.5/3.5] rounded-lg shadow-xl ${
                isClickable ? "cursor-pointer" : ""
              }`}
              style={{
                ...style,
                width: `${Math.min(320, containerWidth * 0.25)}px`,
                pointerEvents: isClickable ? "auto" : "none",
              }}
              onClick={isClickable ? () => handleCardClick(index) : undefined}
              role="button"
              tabIndex={isClickable ? 0 : -1}
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
