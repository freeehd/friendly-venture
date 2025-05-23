"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface SmoothCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

export default function SmoothCarousel({ children, autoScrollInterval = 5000 }: SmoothCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  // Single source of truth for position - offset from 0 (center)
  const position = useRef(0)
  const targetPosition = useRef(0)
  const velocity = useRef(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startPosition = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const [, forceRender] = useState({})
  const [containerWidth, setContainerWidth] = useState(0)
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null)
  const isUserInteracting = useRef(false)
  const userInteractionTimer = useRef<NodeJS.Timeout | null>(null)

  // Simple physics constants
  const FRICTION = 0.92
  const SPRING = 0.1
  const CARD_SPACING = 250 // Pixels between cards

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

  // Animation loop
  useEffect(() => {
    let animationId: number

    const animate = () => {
      // Skip physics if dragging
      if (!isDragging.current) {
        // Apply spring force when close to target
        if (Math.abs(velocity.current) < 0.5) {
          // Find nearest card position
          const nearestCard = Math.round(position.current / CARD_SPACING) * CARD_SPACING
          const springForce = (nearestCard - position.current) * SPRING
          velocity.current += springForce
        }

        // Apply velocity with friction
        position.current += velocity.current
        velocity.current *= FRICTION

        // If velocity is very small and we're very close to target, just snap
        if (Math.abs(velocity.current) < 0.05) {
          const nearestCard = Math.round(position.current / CARD_SPACING) * CARD_SPACING
          if (Math.abs(position.current - nearestCard) < 0.5) {
            position.current = nearestCard
            velocity.current = 0
          }
        }

        // Force render to update the UI
        forceRender({})
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [CARD_SPACING])

  // Handle mouse/touch events
  const handleDragStart = useCallback((clientX: number) => {
    // Cancel any animation
    velocity.current = 0
    isDragging.current = true
    startX.current = clientX
    lastX.current = clientX
    lastTime.current = Date.now()
    startPosition.current = position.current

    // Mark as user interaction
    isUserInteracting.current = true
    if (userInteractionTimer.current) {
      clearTimeout(userInteractionTimer.current)
    }
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging.current) return

    // Calculate drag distance and update position
    const deltaX = clientX - startX.current
    position.current = startPosition.current + deltaX

    // Calculate velocity for momentum
    const now = Date.now()
    const elapsed = now - lastTime.current
    if (elapsed > 0) {
      const currentVelocity = ((clientX - lastX.current) / elapsed) * 15
      velocity.current = currentVelocity
      lastTime.current = now
      lastX.current = clientX
    }

    // Force render to update the UI
    forceRender({})
  }, [])

  const handleDragEnd = useCallback(() => {
    isDragging.current = false

    // Set a timeout to mark the end of user interaction
    userInteractionTimer.current = setTimeout(() => {
      isUserInteracting.current = false
    }, 5000)
  }, [])

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientX)
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      e.preventDefault()
    },
    [handleDragStart],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMove(e.clientX)
      e.preventDefault()
    },
    [handleDragMove],
  )

  const handleMouseUp = useCallback(() => {
    handleDragEnd()
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleDragEnd, handleMouseMove])

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX)
    },
    [handleDragStart],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientX)
      e.preventDefault()
    },
    [handleDragMove],
  )

  const handleTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  // Auto-scroll
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        if (!isUserInteracting.current && Math.abs(velocity.current) < 0.1) {
          velocity.current = 5 // Small push to start scrolling
        }
      }, autoScrollInterval)
    }

    startAutoScroll()
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current)
      }
    }
  }, [autoScrollInterval])

  // Clean up
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
      if (userInteractionTimer.current) clearTimeout(userInteractionTimer.current)
    }
  }, [handleMouseMove, handleMouseUp])

  // Calculate card positions
  const getCardStyle = useCallback(
    (index: number) => {
      // Calculate position relative to center
      const centerOffset = position.current / CARD_SPACING
      const relativePosition = index - centerOffset

      // Calculate curve and rotation
      const yOffset = Math.pow(relativePosition, 2) * 30
      const rotation = relativePosition * 10
      const scale = 1 - Math.min(Math.abs(relativePosition) * 0.05, 0.2)
      const xOffset = relativePosition * CARD_SPACING

      // Calculate z-index and opacity
      const zIndex = 1000 - Math.abs(relativePosition) * 10
      const opacity = Math.abs(relativePosition) > 2.5 ? Math.max(0, 1 - (Math.abs(relativePosition) - 2.5) * 2) : 1

      return {
        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex: Math.round(zIndex),
        opacity,
      }
    },
    [CARD_SPACING],
  )

  // Handle card click
  const handleCardClick = useCallback(
    (index: number) => {
      if (Math.abs(velocity.current) > 1) return

      // Calculate target position
      const targetPos = -index * CARD_SPACING
      const currentPos = position.current
      const distance = targetPos - currentPos

      // Add a small velocity in the right direction
      velocity.current = distance * 0.1

      // Mark as user interaction
      isUserInteracting.current = true
      if (userInteractionTimer.current) {
        clearTimeout(userInteractionTimer.current)
      }
      userInteractionTimer.current = setTimeout(() => {
        isUserInteracting.current = false
      }, 5000)
    },
    [CARD_SPACING],
  )

  // Determine visible cards
  const visibleCards = useCallback(() => {
    const centerIndex = Math.round(-position.current / CARD_SPACING)
    const visibleRange = 4 // Show 4 cards on each side

    const cards = []
    for (let i = centerIndex - visibleRange; i <= centerIndex + visibleRange; i++) {
      const actualIndex = ((i % totalItems) + totalItems) % totalItems
      cards.push({ index: i, actualIndex })
    }

    return cards
  }, [position.current, CARD_SPACING, totalItems])

  return (
    <div className="relative w-full overflow-visible py-24" style={{ zIndex: 9999 }} ref={containerRef}>
      <div
        className="relative w-full h-[400px] flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {visibleCards().map(({ index, actualIndex }) => {
          const style = getCardStyle(index)
          const isActive = Math.abs(index + position.current / CARD_SPACING) < 0.5

          return (
            <div
              key={`card-${index}`}
              className="absolute top-0 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing aspect-[2.5/3.5] rounded-lg shadow-xl"
              style={{
                ...style,
                width: `${Math.min(320, containerWidth * 0.25)}px`,
              }}
              onClick={() => handleCardClick(index)}
            >
              {childrenArray[actualIndex]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
