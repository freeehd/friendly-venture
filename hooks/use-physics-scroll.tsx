"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"

interface PhysicsScrollOptions {
  onScroll?: (scrollLeft: number) => void
  sensitivity?: number
  friction?: number
  minVelocity?: number
  elasticBoundary?: boolean
  maxElasticDistance?: number
  onDragChange?: (isDragging: boolean) => void
}

export function usePhysicsScroll({
  onScroll,
  sensitivity = 1,
  friction = 0.92,
  minVelocity = 0.1,
  elasticBoundary = false,
  maxElasticDistance = 150,
  onDragChange,
}: PhysicsScrollOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Track scroll state
  const scrollState = useRef({
    isScrolling: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    currentX: 0,
    currentY: 0,
    velocity: 0,
    lastTimestamp: 0,
    lastScrollLeft: 0,
    animationFrame: 0,
    isAtBoundary: false,
    elasticOffset: 0,
  })

  // Update drag state with callback
  const updateDragState = useCallback(
    (dragging: boolean) => {
      setIsDragging(dragging)
      onDragChange?.(dragging)
    },
    [onDragChange],
  )

  // Check if scroll is at boundary
  const checkBoundary = useCallback(() => {
    if (!scrollRef.current) return false

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    return scrollLeft <= 0 || scrollLeft >= scrollWidth - clientWidth
  }, [])

  // Apply elastic effect when at boundary
  const applyElasticEffect = useCallback(
    (deltaX: number) => {
      if (!scrollRef.current || !elasticBoundary) return deltaX

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const state = scrollState.current

      // Check if we're at the start boundary
      if (scrollLeft <= 0) {
        state.isAtBoundary = true

        // Calculate elastic offset with diminishing returns
        state.elasticOffset += deltaX * 0.3 // Reduce the effect for more resistance

        // Limit the elastic distance
        state.elasticOffset = Math.min(state.elasticOffset, maxElasticDistance)

        return 0 // Don't apply normal scroll
      }

      // Check if we're at the end boundary
      if (scrollLeft >= scrollWidth - clientWidth) {
        state.isAtBoundary = true

        // Calculate elastic offset with diminishing returns
        state.elasticOffset += deltaX * 0.3 // Reduce the effect for more resistance

        // Limit the elastic distance (negative for right boundary)
        state.elasticOffset = Math.max(state.elasticOffset, -maxElasticDistance)

        return 0 // Don't apply normal scroll
      }

      // Reset elastic state if not at boundary
      state.isAtBoundary = false
      state.elasticOffset = 0

      return deltaX
    },
    [elasticBoundary, maxElasticDistance],
  )

  // Handle elastic spring back animation
  const animateElasticSpringBack = useCallback(() => {
    if (!scrollRef.current) return

    const state = scrollState.current

    // If we have an elastic offset, animate it back to 0
    if (state.elasticOffset !== 0) {
      // Apply spring physics
      state.elasticOffset *= 0.8 // Spring back factor

      // Apply transform to the scroll container
      scrollRef.current.style.transform = `translateX(${state.elasticOffset}px)`

      // Stop animation when close enough to 0
      if (Math.abs(state.elasticOffset) < 0.5) {
        state.elasticOffset = 0
        scrollRef.current.style.transform = ""
        return
      }

      // Continue animation
      requestAnimationFrame(animateElasticSpringBack)
    } else {
      // Reset transform when done
      scrollRef.current.style.transform = ""
    }
  }, [])

  // Handle momentum scrolling animation
  const animateMomentumScroll = useCallback(() => {
    if (!scrollRef.current) return

    const state = scrollState.current

    // Apply friction to slow down the scroll
    state.velocity *= friction

    // Stop animation when velocity is very low
    if (Math.abs(state.velocity) < minVelocity) {
      state.isScrolling = false

      // If we're at a boundary with elastic effect, spring back
      if (state.isAtBoundary && elasticBoundary) {
        animateElasticSpringBack()
      }

      return
    }

    // Apply velocity to scroll position
    scrollRef.current.scrollLeft += state.velocity

    // Check if we hit a boundary
    if (checkBoundary()) {
      // Reduce velocity more quickly at boundaries
      state.velocity *= 0.8
    }

    // Call onScroll callback
    if (onScroll) {
      onScroll(scrollRef.current.scrollLeft)
    }

    // Continue animation
    state.animationFrame = requestAnimationFrame(animateMomentumScroll)
  }, [friction, minVelocity, onScroll, checkBoundary, elasticBoundary, animateElasticSpringBack])

  // Start momentum scrolling
  const startMomentumScroll = useCallback(() => {
    const state = scrollState.current

    // Only start momentum if there's enough velocity
    if (Math.abs(state.velocity) > minVelocity) {
      state.isScrolling = true
      cancelAnimationFrame(state.animationFrame)
      state.animationFrame = requestAnimationFrame(animateMomentumScroll)
    } else if (state.isAtBoundary && elasticBoundary) {
      // If we're at a boundary with elastic effect but no momentum, just spring back
      animateElasticSpringBack()
    }
  }, [animateMomentumScroll, minVelocity, elasticBoundary, animateElasticSpringBack])

  // Handle mouse down event
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!scrollRef.current) return

      const state = scrollState.current
      updateDragState(true)

      // Stop any ongoing momentum scrolling
      state.isScrolling = false
      cancelAnimationFrame(state.animationFrame)

      // Record starting position
      state.startX = e.clientX
      state.startY = e.clientY
      state.currentX = e.clientX
      state.currentY = e.clientY
      state.startScrollLeft = scrollRef.current.scrollLeft
      state.lastScrollLeft = scrollRef.current.scrollLeft
      state.lastTimestamp = performance.now()
      state.velocity = 0

      // Reset elastic state
      state.isAtBoundary = false
      state.elasticOffset = 0
      scrollRef.current.style.transform = ""

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Prevent default to avoid text selection during drag
      e.preventDefault()
    },
    [updateDragState],
  )

  // Handle touch start event
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!scrollRef.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const state = scrollState.current
      updateDragState(true)

      // Stop any ongoing momentum scrolling
      state.isScrolling = false
      cancelAnimationFrame(state.animationFrame)

      // Record starting position
      state.startX = touch.clientX
      state.startY = touch.clientY
      state.currentX = touch.clientX
      state.currentY = touch.clientY
      state.startScrollLeft = scrollRef.current.scrollLeft
      state.lastScrollLeft = scrollRef.current.scrollLeft
      state.lastTimestamp = performance.now()
      state.velocity = 0

      // Reset elastic state
      state.isAtBoundary = false
      state.elasticOffset = 0
      scrollRef.current.style.transform = ""

      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    },
    [updateDragState],
  )

  // Handle mouse move event
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = scrollState.current
      if (!scrollRef.current || !isDragging) return

      // Calculate horizontal movement
      const deltaX = e.clientX - state.currentX
      state.currentX = e.clientX

      // Calculate vertical movement to detect scroll direction intent
      const deltaY = e.clientY - state.currentY
      state.currentY = e.clientY

      // If vertical movement is significantly larger than horizontal, don't scroll
      if (Math.abs(deltaY) > Math.abs(deltaX) * 2) return

      // Apply elastic effect if at boundary
      const adjustedDeltaX = applyElasticEffect(deltaX)

      // Apply movement to scroll position with sensitivity multiplier
      scrollRef.current.scrollLeft -= adjustedDeltaX * sensitivity

      // Apply elastic transform if needed
      if (state.isAtBoundary && elasticBoundary) {
        scrollRef.current.style.transform = `translateX(${state.elasticOffset}px)`
      }

      // Calculate velocity for momentum scrolling
      const now = performance.now()
      const elapsed = now - state.lastTimestamp

      if (elapsed > 0) {
        // Velocity is pixels per millisecond
        state.velocity = ((scrollRef.current.scrollLeft - state.lastScrollLeft) / elapsed) * 16.67 // Scale to roughly pixels per frame at 60fps
        state.lastTimestamp = now
        state.lastScrollLeft = scrollRef.current.scrollLeft
      }

      // Call onScroll callback
      if (onScroll) {
        onScroll(scrollRef.current.scrollLeft)
      }

      e.preventDefault()
    },
    [isDragging, onScroll, sensitivity, applyElasticEffect, elasticBoundary],
  )

  // Handle touch move event
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!scrollRef.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const state = scrollState.current

      // Calculate horizontal movement
      const deltaX = touch.clientX - state.currentX
      state.currentX = touch.clientX

      // Calculate vertical movement to detect scroll direction intent
      const deltaY = touch.clientY - state.currentY
      state.currentY = touch.clientY

      // If vertical movement is significantly larger than horizontal, don't scroll
      if (Math.abs(deltaY) > Math.abs(deltaX) * 2) return

      // Apply elastic effect if at boundary
      const adjustedDeltaX = applyElasticEffect(deltaX)

      // Apply movement to scroll position with sensitivity multiplier
      scrollRef.current.scrollLeft -= adjustedDeltaX * sensitivity

      // Apply elastic transform if needed
      if (state.isAtBoundary && elasticBoundary) {
        scrollRef.current.style.transform = `translateX(${state.elasticOffset}px)`
      }

      // Calculate velocity for momentum scrolling
      const now = performance.now()
      const elapsed = now - state.lastTimestamp

      if (elapsed > 0) {
        // Velocity is pixels per millisecond
        state.velocity = ((scrollRef.current.scrollLeft - state.lastScrollLeft) / elapsed) * 16.67 // Scale to roughly pixels per frame at 60fps
        state.lastTimestamp = now
        state.lastScrollLeft = scrollRef.current.scrollLeft
      }

      // Call onScroll callback
      if (onScroll) {
        onScroll(scrollRef.current.scrollLeft)
      }

      e.preventDefault()
    },
    [onScroll, sensitivity, applyElasticEffect, elasticBoundary],
  )

  // Handle mouse up event
  const handleMouseUp = useCallback(() => {
    updateDragState(false)

    // Start momentum scrolling
    startMomentumScroll()

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseMove, startMomentumScroll, updateDragState])

  // Handle touch end event
  const handleTouchEnd = useCallback(() => {
    updateDragState(false)

    // Start momentum scrolling
    startMomentumScroll()

    // Remove event listeners
    document.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("touchend", handleTouchEnd)
  }, [handleTouchMove, startMomentumScroll, updateDragState])

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)

      // Cancel any ongoing animations
      cancelAnimationFrame(scrollState.current.animationFrame)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  }
}
