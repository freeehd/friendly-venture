"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function ParallaxColleagues() {
  // Refs for the container and animation
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number | null>(null)

  // State for tracking scroll position and visibility
  const [isInView, setIsInView] = useState(false)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // State for the actual positions and scales with inertia
  const [positions, setPositions] = useState({
    back: { y: 0, scale: 0.9 },
    middle: { y: 0, scale: 0.95 },
    front: { y: 0, scale: 1.0 },
  })

  // Refs for tracking target positions, scales, and velocities (for inertia)
  const targetPositions = useRef({
    back: { y: 0, scale: 0.9 },
    middle: { y: 0, scale: 0.95 },
    front: { y: 0, scale: 1.0 },
  })

  const velocities = useRef({
    back: { y: 0, scale: 0 },
    middle: { y: 0, scale: 0 },
    front: { y: 0, scale: 0 },
  })

  // Layer configuration for directional movement and scaling
  const layerConfig = {
    back: {
      scaleRange: { min: 0.9, max: 1.15 }, // Increased max scale for more pronounced zoom
      yOffset: 120, // Increased movement range
      zPosition: -200, // Z-position in 3D space
    },
    middle: {
      scaleRange: { min: 0.95, max: 1.1 },
      yOffset: 80,
      zPosition: -100,
    },
    front: {
      scaleRange: { min: 1.0, max: 1.05 },
      yOffset: 40,
      zPosition: 0,
    },
  }

  // Constants for the inertia effect
  const SPRING_STRENGTH = 0.04 // How quickly it catches up (higher = faster)
  const DAMPING = 0.9 // How quickly it slows down (lower = faster)

  // Set up intersection observer to detect when component is in view
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowInView = entry.isIntersecting
          setIsInView(nowInView)

          // Once it's been in view, remember that
          if (nowInView) {
            setHasEnteredView(true)
          }
        })
      },
      { threshold: 0.1, rootMargin: "200px" },
    )

    observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Handle scroll events to update target positions
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      // Get container position relative to viewport
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const containerTop = rect.top
      const containerBottom = rect.bottom
      const containerHeight = rect.height

      // Calculate progress based on container position
      let progress = 0

      if (containerBottom <= 0) {
        // Container has scrolled completely out of view at the top
        progress = 1
      } else if (containerTop >= viewportHeight) {
        // Container is still below the viewport
        progress = 0
      } else {
        // Container is partially in view
        progress = 1 - containerBottom / (viewportHeight + containerHeight)
        progress = Math.max(0, Math.min(1, progress))
      }

      // Update scroll progress state
      setScrollProgress(progress)

      // Update target positions for each layer
      Object.entries(layerConfig).forEach(([layer, config]) => {
        const layerKey = layer as keyof typeof targetPositions.current

        // Calculate target y position and scale based on scroll progress
        const targetY = -config.yOffset * progress
        const targetScale = config.scaleRange.min + (config.scaleRange.max - config.scaleRange.min) * progress

        // Update target positions
        targetPositions.current[layerKey] = {
          y: targetY,
          scale: targetScale,
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [layerConfig])

  // Animation loop for smooth inertia effect
  useEffect(() => {
    if (!isInView && !hasEnteredView) return

    const animate = () => {
      let needsUpdate = false

      // Update positions and scales with spring physics for each layer
      const newPositions = { ...positions }

      // Process each layer
      Object.entries(targetPositions.current).forEach(([layer, target]) => {
        const layerKey = layer as keyof typeof positions
        const current = positions[layerKey]
        const velocity = velocities.current[layerKey]

        // Calculate spring force
        const forceY = (target.y - current.y) * SPRING_STRENGTH
        const forceScale = (target.scale - current.scale) * SPRING_STRENGTH

        // Apply force to velocity
        velocity.y += forceY
        velocity.scale += forceScale

        // Apply damping for inertia
        velocity.y *= DAMPING
        velocity.scale *= DAMPING

        // Update position and scale
        newPositions[layerKey] = {
          y: current.y + velocity.y,
          scale: current.scale + velocity.scale,
        }

        // Continue animation if there's still movement
        if (
          Math.abs(velocity.y) > 0.01 ||
          Math.abs(velocity.scale) > 0.001 ||
          Math.abs(target.y - current.y) > 0.1 ||
          Math.abs(target.scale - current.scale) > 0.001
        ) {
          needsUpdate = true
        }
      })

      // Update state if needed
      if (needsUpdate) {
        setPositions(newPositions)
        requestRef.current = requestAnimationFrame(animate)
      } else {
        requestRef.current = null
      }
    }

    // Start animation loop
    requestRef.current = requestAnimationFrame(animate)

    // Clean up
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }
  }, [positions, isInView, hasEnteredView, SPRING_STRENGTH, DAMPING])

  // Restart animation when coming into view
  useEffect(() => {
    if ((isInView || hasEnteredView) && !requestRef.current) {
      requestRef.current = requestAnimationFrame(() => {
        const animate = () => {
          let needsUpdate = false
          const newPositions = { ...positions }

          Object.entries(targetPositions.current).forEach(([layer, target]) => {
            const layerKey = layer as keyof typeof positions
            const current = positions[layerKey]
            const velocity = velocities.current[layerKey]

            const forceY = (target.y - current.y) * SPRING_STRENGTH
            const forceScale = (target.scale - current.scale) * SPRING_STRENGTH

            velocity.y += forceY
            velocity.scale += forceScale

            velocity.y *= DAMPING
            velocity.scale *= DAMPING

            newPositions[layerKey] = {
              y: current.y + velocity.y,
              scale: current.scale + velocity.scale,
            }

            if (
              Math.abs(velocity.y) > 0.01 ||
              Math.abs(velocity.scale) > 0.001 ||
              Math.abs(target.y - current.y) > 0.1 ||
              Math.abs(target.scale - current.scale) > 0.001
            ) {
              needsUpdate = true
            }
          })

          if (needsUpdate) {
            setPositions(newPositions)
            requestRef.current = requestAnimationFrame(animate)
          } else {
            requestRef.current = null
          }
        }

        animate()
      })
    }
  }, [isInView, hasEnteredView, positions, SPRING_STRENGTH, DAMPING])

  return (
    <div
      ref={containerRef}
      className="relative w-full  max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-[#f0f0f5] overflow-hidden"
      style={{
        height: "800px",
        minHeight: "800px",
        maxHeight: "1400px",
        perspective: "1500px", // Add perspective for 3D effect
      }}
    >
      {/* Title banner */}
      <div className="absolute top-4 md:top-8 left-0 right-0 z-40 flex justify-center">
        <div className="bg-[#141b33] text-white py-2 md:py-3 px-6 md:px-8 inline-block">
          <h2 className="text-2xl md:text-3xl font-bold uppercase">Your Creative Tech Squad</h2>
        </div>
      </div>

      {/* Description text */}
      <div className="absolute top-20 md:top-28 left-0 right-0 z-40 text-center px-4">
        <p className="text-base md:text-xl text-[#141b33] max-w-3xl mx-auto">
          Meet the talented humans behind The Friendly Venture. From design nerds to code wizards, we're a handpicked
          league of creatives who actually like what they do.
        </p>
      </div>

      {/* Image layers with enhanced parallax effect */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Back layer - adjust positioning for mobile */}
        <div
          className="absolute top-[150px] md:top-[200px] left-0 right-0 flex justify-center z-10 transform-gpu will-change-transform"
          style={{
            transform: `translate3d(0, ${positions.back.y}px, ${layerConfig.back.zPosition}px) scale(${positions.back.scale})`,
            opacity: isInView || hasEnteredView ? 1 : 0.85,
            transition: "opacity 3s ease-out",
            transformOrigin: "center bottom",
            width: "100%",
          }}
        >
          <Image
            src="/images/colleagues-back.png"
            alt="Creative agency colleagues - back row"
            width={1200}
            height={500}
            className="object-contain w-full"
            priority
          />
        </div>

        {/* Middle layer - adjust positioning for mobile */}
        <div
          className="absolute top-[250px] md:top-[350px] left-0 right-0 flex justify-center z-20 transform-gpu will-change-transform"
          style={{
            transform: `translate3d(0, ${positions.middle.y}px, ${layerConfig.middle.zPosition}px) scale(${positions.middle.scale})`,
            opacity: isInView || hasEnteredView ? 1 : 0.9,
            transition: "opacity 3.5s ease-out 0.2s",
            transformOrigin: "center bottom",
            width: "100%",
          }}
        >
          <Image
            src="/images/colleagues-middle.png"
            alt="Creative agency colleagues - middle row"
            width={1200}
            height={500}
            className="object-contain w-full"
            priority
          />
        </div>

        {/* Front layer - adjust positioning for mobile */}
        <div
          className="absolute top-[350px] md:top-[500px] left-0 right-0 flex justify-center z-30 transform-gpu will-change-transform"
          style={{
            transform: `translate3d(0, ${positions.front.y}px, ${layerConfig.front.zPosition}px) scale(${positions.front.scale})`,
            opacity: isInView || hasEnteredView ? 1 : 0.95,
            transition: "opacity 4s ease-out 0.4s",
            transformOrigin: "center bottom",
            width: "100%",
          }}
        >
          <Image
            src="/images/colleagues-front.png"
            alt="Creative agency colleagues - front row"
            width={1200}
            height={500}
            className="object-contain w-full"
            priority
          />
        </div>
      </div>
    </div>
  )
}
