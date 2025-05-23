"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

// Define types for our animations
interface AnimatedIcon {
  id: string
  image: string
  alt: string
  size: number
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  rotation: number
  scale: number
  delay: number
  duration: number
}

export default function AboutUsAnimation() {
  // Refs for DOM elements and animation state
  const containerRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const [icons, setIcons] = useState<AnimatedIcon[]>([])
  const [isGlowing, setIsGlowing] = useState(false)
  const [isCharacterAnimating, setIsCharacterAnimating] = useState(false)
  const isAnimatingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Available icon images
  const iconImages = [
    "/images/smiley.png",
    "/images/mouse.png",
    "/images/pencil.png",
    "/images/cactus.png",
    "/images/clock.png",
    "/images/headphones.png",
  ]

  // Generate a random icon
  const generateIcon = (index: number): AnimatedIcon => {
    if (!containerRef.current) {
      return {
        id: `icon-${Date.now()}-${index}`,
        image: iconImages[Math.floor(Math.random() * iconImages.length)],
        alt: "Creative icon",
        size: 80 + Math.floor(Math.random() * 60), // 80-140px
        startPosition: { x: 50, y: 30 },
        endPosition: { x: 50, y: 30 },
        rotation: Math.random() * 720 - 360, // -360 to 360 degrees
        scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
        delay: 50 + index * 80, // Staggered delays
        duration: 2000 + Math.random() * 1000, // 2-3 seconds
      }
    }

    // Get container dimensions
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Calculate head position (center of upper third)
    const headX = width * 0.5
    const headY = height * 0.3

    // Calculate random angle for this icon
    const angle = (Math.random() * 360 * Math.PI) / 180
    const distance = 200 + Math.random() * 300 // 200-500px

    // Calculate end position based on angle and distance
    const endX = headX + Math.cos(angle) * distance
    const endY = headY + Math.sin(angle) * distance

    return {
      id: `icon-${Date.now()}-${index}`,
      image: iconImages[Math.floor(Math.random() * iconImages.length)],
      alt: "Creative icon",
      size: 80 + Math.floor(Math.random() * 60), // 80-140px
      startPosition: { x: headX, y: headY },
      endPosition: { x: endX, y: endY },
      rotation: Math.random() * 720 - 360, // -360 to 360 degrees
      scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
      delay: 50 + index * 80, // Staggered delays
      duration: 2000 + Math.random() * 1000, // 2-3 seconds
    }
  }

  // Handle click on the character
  const handleClick = () => {
    // Prevent multiple clicks from stacking animations
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    // Animate character
    setIsGlowing(true)
    setIsCharacterAnimating(true)

    // Reset character animation after short delay
    setTimeout(() => {
      setIsGlowing(false)
      setIsCharacterAnimating(false)
    }, 400)

    // Generate 3-5 random icons
    const count = 3 + Math.floor(Math.random() * 3)
    const newIcons = Array.from({ length: count }, (_, i) => generateIcon(i))

    // Add new icons to state
    setIcons((prev) => [...prev, ...newIcons])

    // Clear previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Calculate the maximum duration of all animations
    const maxDuration = Math.max(...newIcons.map((icon) => icon.delay + icon.duration)) + 200

    // Set timeout to clear animations and reset state
    timeoutRef.current = setTimeout(() => {
      setIcons([])
      isAnimatingRef.current = false
    }, maxDuration)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Auto-trigger animation occasionally
  useEffect(() => {
    const autoTriggerInterval = setInterval(() => {
      if (!isAnimatingRef.current && Math.random() > 0.7) {
        handleClick()
      }
    }, 5000)

    return () => clearInterval(autoTriggerInterval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#ffda55] overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Character container */}
      <div
        ref={characterRef}
        className="absolute  w-full max-w-[960px] h-[800px] transition-transform duration-300 overflow-hidden"
        style={{
          transform: ` scale(${isCharacterAnimating ? 1.05 : 1})`,
        }}
      >
        {/* Character image */}
        <Image src="/images/ideas-girl.png" alt="Ideas Girl" fill  className="object-cover object-top w-full h-full" priority />

        {/* Glow effect */}
        {isGlowing && (
          <div
            className="absolute inset-0 animate-pulse-glow"
            style={{
              background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>

      {/* Animated icons */}
      {icons.map((icon) => (
        <AnimatedIcon key={icon.id} icon={icon} />
      ))}
    </div>
  )
}

// Separate component for each animated icon
function AnimatedIcon({ icon }: { icon: AnimatedIcon }) {
  const [animationState, setAnimationState] = useState<"initial" | "appearing" | "moving" | "fading" | "complete">(
    "initial",
  )
  const iconRef = useRef<HTMLDivElement>(null)

  // Handle the animation lifecycle
  useEffect(() => {
    // Start with a delay
    const appearTimeout = setTimeout(() => {
      setAnimationState("appearing")
    }, icon.delay)

    // After appearing, start moving
    const moveTimeout = setTimeout(() => {
      setAnimationState("moving")
    }, icon.delay + 300)

    // Start fading near the end
    const fadeTimeout = setTimeout(
      () => {
        setAnimationState("fading")
      },
      icon.delay + icon.duration - 500,
    )

    // Mark as complete
    const completeTimeout = setTimeout(() => {
      setAnimationState("complete")
    }, icon.delay + icon.duration)

    // Clean up all timeouts
    return () => {
      clearTimeout(appearTimeout)
      clearTimeout(moveTimeout)
      clearTimeout(fadeTimeout)
      clearTimeout(completeTimeout)
    }
  }, [icon.delay, icon.duration])

  // Don't render if animation is complete
  if (animationState === "complete") {
    return null
  }

  // Calculate styles based on animation state
  const getStyles = () => {
    const baseStyles = {
      position: "absolute" as const,
      left: icon.startPosition.x,
      top: icon.startPosition.y,
      width: icon.size,
      height: icon.size,
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0) rotate(0deg)",
      transition: `transform ${icon.duration}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-in-out`,
    }

    switch (animationState) {
      case "initial":
        return baseStyles
      case "appearing":
        return {
          ...baseStyles,
          opacity: 1,
          transform: `translate(-50%, -50%) scale(0.8) rotate(${icon.rotation * 0.2}deg)`,
        }
      case "moving":
        return {
          ...baseStyles,
          opacity: 1,
          transform: `translate(-50%, -50%) translate(
            ${(icon.endPosition.x - icon.startPosition.x) * 0.8}px, 
            ${(icon.endPosition.y - icon.startPosition.y) * 0.8}px
          ) scale(${icon.scale}) rotate(${icon.rotation * 0.8}deg)`,
        }
      case "fading":
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translate(-50%, -50%) translate(
            ${icon.endPosition.x - icon.startPosition.x}px, 
            ${icon.endPosition.y - icon.startPosition.y}px
          ) scale(${icon.scale * 0.8}) rotate(${icon.rotation}deg)`,
        }
      default:
        return baseStyles
    }
  }

  return (
    <div ref={iconRef} style={getStyles()}>
      <Image src={icon.image || "/placeholder.svg"} alt={icon.alt} fill className="object-contain drop-shadow-lg" />
    </div>
  )
}
