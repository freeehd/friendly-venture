"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface PhysicsCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

export default function PhysicsCarousel({ children, autoScrollInterval = 5000 }: PhysicsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [virtualIndex, setVirtualIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState(0)
  const [progress, setProgress] = useState(0) // 0 to 1 progress between indices
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  // Physics state
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollRef = useRef(0)
  const velocityRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastPositionRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Physics constants
  const FRICTION = 0.92 // Higher = less friction
  const SPRING_TENSION = 0.15 // Higher = stronger snap
  const VELOCITY_THRESHOLD = 0.5 // Minimum velocity to keep scrolling
  const CARD_SNAP_THRESHOLD = 0.3 // Progress threshold to snap to next/prev card

  // Visible range
  const visibleRange = 3 // Cards visible on each side
  const fadeInRange = 2.5 // Cards start fading in at this distance

  // Get the actual index from the virtual index
  const getActualIndex = useCallback(
    (virtualIdx: number) => {
      return ((virtualIdx % totalItems) + totalItems) % totalItems
    },
    [totalItems],
  )

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        setContainerWidth(trackRef.current.clientWidth)
      }
    }

    // Initial width
    updateWidth()

    // Set up resize observer for more responsive updates
    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(updateWidth)
      if (trackRef.current) {
        resizeObserverRef.current.observe(trackRef.current)
      }
    } else {
      // Fallback to window resize event
      window.addEventListener("resize", updateWidth)
    }

    return () => {
      if (resizeObserverRef.current && trackRef.current) {
        resizeObserverRef.current.unobserve(trackRef.current)
        resizeObserverRef.current.disconnect()
      }
      window.removeEventListener("resize", updateWidth)
    }
  }, [])

  // Generate the visible cards based on the current position
  const getVisibleCards = useCallback(() => {
    const cards = []
    const currentPosition = targetIndex + progress

    // Generate cards for the visible range around the current position
    for (let i = Math.floor(currentPosition) - visibleRange; i <= Math.ceil(currentPosition) + visibleRange; i++) {
      const actualIndex = getActualIndex(i)
      cards.push({
        virtualIndex: i,
        actualIndex,
        relativePosition: i - currentPosition,
      })
    }

    return cards
  }, [targetIndex, progress, visibleRange, getActualIndex])

  // Calculate positions for each card along the fixed curve
  const getCardStyle = useCallback(
    (relativePosition: number) => {
      // Card sizing - match reference image
      const baseCardWidth = Math.min(320, containerWidth * 0.25)

      // Curve parameters - match reference image
      const curveDepth = 40 // Pronounced curve
      const rotationFactor = 12 // More rotation to match reference

      // Calculate vertical position along the parabolic curve
      const yPosition = Math.pow(relativePosition, 2) * curveDepth

      // Calculate rotation (tilt) based on position
      const rotation = relativePosition * rotationFactor

      // Calculate horizontal position with wider spacing to match reference
      const spacing = containerWidth * 0.22 // Spacing between cards
      const xPosition = relativePosition * spacing

      // Calculate z-index to ensure proper stacking
      const zIndex = 1000 - Math.abs(relativePosition)

      // Add a slight scale effect for cards further from center
      const scale = 1 - Math.min(Math.abs(relativePosition) * 0.02, 0.1)

      // Calculate opacity based on distance from center
      const distanceFromCenter = Math.abs(relativePosition)
      const opacity = distanceFromCenter > fadeInRange ? Math.max(0, 1 - (distanceFromCenter - fadeInRange) * 2) : 1

      return {
        transform: `translateX(${xPosition}px) translateY(${yPosition}px) rotate(${rotation}deg) scale(${scale})`,
        width: `${baseCardWidth}px`,
        opacity,
        zIndex,
        transition: "none", // No CSS transitions - all animation is handled by our physics system
      }
    },
    [containerWidth],
  )

  // Physics-based animation loop
  const animateCarousel = useCallback(() => {
    if (isDraggingRef.current) {
      // If dragging, don't apply physics
      animationRef.current = requestAnimationFrame(animateCarousel)
      return
    }

    // Apply physics
    if (Math.abs(velocityRef.current) > VELOCITY_THRESHOLD) {
      // Continue momentum scrolling
      const newProgress = progress + velocityRef.current

      // Update progress and handle index changes
      if (newProgress >= 1) {
        setTargetIndex((prev) => prev + 1)
        setProgress(newProgress - 1)
      } else if (newProgress <= -1) {
        setTargetIndex((prev) => prev - 1)
        setProgress(newProgress + 1)
      } else {
        setProgress(newProgress)
      }

      // Apply friction to gradually slow down
      velocityRef.current *= FRICTION
    } else {
      // Snap to nearest card with spring physics
      let targetProgress = 0

      // Determine if we should snap to the next or previous card
      if (progress > CARD_SNAP_THRESHOLD) {
        targetProgress = 1
      } else if (progress < -CARD_SNAP_THRESHOLD) {
        targetProgress = -1
      }

      // Apply spring force
      const springForce = (targetProgress - progress) * SPRING_TENSION
      velocityRef.current += springForce

      // Update progress
      const newProgress = progress + velocityRef.current

      // Update progress and handle index changes
      if (newProgress >= 1) {
        setTargetIndex((prev) => prev + 1)
        setProgress(newProgress - 1)
      } else if (newProgress <= -1) {
        setTargetIndex((prev) => prev - 1)
        setProgress(newProgress + 1)
      } else {
        setProgress(newProgress)
      }

      // Apply friction to gradually slow down
      velocityRef.current *= FRICTION

      // If we're very close to the target and moving very slowly, just snap to it
      if (Math.abs(targetProgress - progress) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
        if (targetProgress === 1) {
          setTargetIndex((prev) => prev + 1)
          setProgress(0)
        } else if (targetProgress === -1) {
          setTargetIndex((prev) => prev - 1)
          setProgress(0)
        } else {
          setProgress(targetProgress)
        }
        velocityRef.current = 0
      }
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(animateCarousel)
  }, [progress, FRICTION, SPRING_TENSION, VELOCITY_THRESHOLD, CARD_SNAP_THRESHOLD])

  // Start/stop animation based on user interaction
  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animateCarousel)

    // Clean up on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animateCarousel])

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Stop any ongoing momentum scrolling
      velocityRef.current = 0

      // Mark as dragging
      isDraggingRef.current = true
      setIsUserInteracting(true)

      // Record start position
      startXRef.current = e.clientX
      startScrollRef.current = progress
      lastTimeRef.current = Date.now()
      lastPositionRef.current = e.clientX

      // Add document-level event listeners
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Prevent default to avoid text selection
      e.preventDefault()
    },
    [progress],
  )

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      // Calculate drag distance
      const deltaX = e.clientX - startXRef.current

      // Calculate new progress based on drag distance
      // Scale the movement to make it feel right
      const dragSensitivity = 1 / (containerWidth * 0.22 || 200) // Fallback if containerWidth is 0
      const newProgress = startScrollRef.current - deltaX * dragSensitivity

      // Update progress and handle index changes
      if (newProgress >= 1) {
        setTargetIndex((prev) => prev + 1)
        setProgress(newProgress - 1)
        startScrollRef.current = newProgress - 1
        startXRef.current = e.clientX
      } else if (newProgress <= -1) {
        setTargetIndex((prev) => prev - 1)
        setProgress(newProgress + 1)
        startScrollRef.current = newProgress + 1
        startXRef.current = e.clientX
      } else {
        setProgress(newProgress)
      }

      // Calculate velocity for momentum scrolling
      const now = Date.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed > 0) {
        const currentVelocity = ((lastPositionRef.current - e.clientX) / elapsed) * 0.15
        // Smooth velocity with some averaging
        velocityRef.current = velocityRef.current * 0.7 + currentVelocity * 0.3

        lastTimeRef.current = now
        lastPositionRef.current = e.clientX
      }

      e.preventDefault()
    },
    [containerWidth],
  )

  // Handle mouse up after dragging
  const handleMouseUp = useCallback(() => {
    // End dragging
    isDraggingRef.current = false

    // Remove document-level event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    // Set a timeout to mark the end of user interaction
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current)
    }

    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000)
  }, [handleMouseMove])

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Stop any ongoing momentum scrolling
      velocityRef.current = 0

      // Mark as dragging
      isDraggingRef.current = true
      setIsUserInteracting(true)

      // Record start position
      startXRef.current = e.touches[0].clientX
      startScrollRef.current = progress
      lastTimeRef.current = Date.now()
      lastPositionRef.current = e.touches[0].clientX

      // Add document-level event listeners
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    },
    [progress],
  )

  // Handle touch move during drag
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return

      // Calculate drag distance
      const deltaX = e.touches[0].clientX - startXRef.current

      // Calculate new progress based on drag distance
      // Scale the movement to make it feel right
      const dragSensitivity = 1 / (containerWidth * 0.22 || 200) // Fallback if containerWidth is 0
      const newProgress = startScrollRef.current - deltaX * dragSensitivity

      // Update progress and handle index changes
      if (newProgress >= 1) {
        setTargetIndex((prev) => prev + 1)
        setProgress(newProgress - 1)
        startScrollRef.current = newProgress - 1
        startXRef.current = e.touches[0].clientX
      } else if (newProgress <= -1) {
        setTargetIndex((prev) => prev - 1)
        setProgress(newProgress + 1)
        startScrollRef.current = newProgress + 1
        startXRef.current = e.touches[0].clientX
      } else {
        setProgress(newProgress)
      }

      // Calculate velocity for momentum scrolling
      const now = Date.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed > 0) {
        const currentVelocity = ((lastPositionRef.current - e.touches[0].clientX) / elapsed) * 0.15
        // Smooth velocity with some averaging
        velocityRef.current = velocityRef.current * 0.7 + currentVelocity * 0.3

        lastTimeRef.current = now
        lastPositionRef.current = e.touches[0].clientX
      }

      // Prevent default to avoid page scrolling
      e.preventDefault()
    },
    [containerWidth],
  )

  // Handle touch end after dragging
  const handleTouchEnd = useCallback(() => {
    // End dragging
    isDraggingRef.current = false

    // Remove document-level event listeners
    document.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("touchend", handleTouchEnd)

    // Set a timeout to mark the end of user interaction
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current)
    }

    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000)
  }, [handleTouchMove])

  // Handle card click - move one card in the direction of the clicked card
  const handleCardClick = useCallback(
    (clickedVirtualIndex: number) => {
      // If we're currently animating with significant velocity, don't handle click
      if (Math.abs(velocityRef.current) > 0.05) return

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
      const currentPosition = targetIndex + progress

      if (clickedVirtualIndex > currentPosition) {
        // Card is to the right of center - move one card right
        velocityRef.current = 0.1 // Start with a small velocity in the right direction
      } else if (clickedVirtualIndex < currentPosition) {
        // Card is to the left of center - move one card left
        velocityRef.current = -0.1 // Start with a small velocity in the left direction
      }
    },
    [targetIndex, progress],
  )

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = () => {
      if (isUserInteracting || Math.abs(velocityRef.current) > 0.05) return

      // Add a small velocity to start scrolling
      velocityRef.current = 0.05
    }

    // Set up auto-scroll timer
    autoScrollTimerRef.current = setInterval(autoScroll, autoScrollInterval)

    // Clean up on unmount or when dependencies change
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [isUserInteracting, autoScrollInterval])

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

      // Remove any lingering event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Get the visible cards
  const visibleCards = getVisibleCards()

  return (
    <div
      className="relative w-full overflow-visible py-24"
      style={{ zIndex: 9999 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Fixed track that doesn't scroll - with high z-index */}
      <div
        ref={trackRef}
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        {/* Render visible cards and off-screen cards that are fading in */}
        {visibleCards.map(({ virtualIndex: vIndex, actualIndex, relativePosition }) => {
          const style = getCardStyle(relativePosition)
          const isActive = Math.abs(relativePosition) < 0.5

          return (
            <div
              key={`v-${vIndex}`}
              className={`absolute top-0 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing aspect-[2.5/3.5] rounded-lg shadow-xl ${
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
