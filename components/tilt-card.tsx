"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface TiltCardProps {
  card: {
    id: number
    type: "back" | "face"
    value?: string
    suit?: string
    isFlipped: boolean
  }
  width: number
  height: number
  isActive?: boolean
  isInteractive?: boolean
  tiltMaxAngle?: number
  glareOpacity?: number
  scale?: number
  onFlip?: () => void
}

export default function TiltCard({
  card,
  width,
  height,
  isActive = false,
  isInteractive = true,
  tiltMaxAngle = 15,
  glareOpacity = 0.3,
  scale = 1.05,
  onFlip,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({
    transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`,
  })
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  // Handle mouse movement for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setMousePosition({ x, y })
    setIsHovered(true)
  }

  // Handle mouse down to detect dragging vs clicking
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return

    isDragging.current = false
    startPos.current = { x: e.clientX, y: e.clientY }
  }

  // Handle mouse up to determine if it was a click or drag
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return

    // Calculate distance moved
    const deltaX = Math.abs(e.clientX - startPos.current.x)
    const deltaY = Math.abs(e.clientY - startPos.current.y)

    // If moved less than 5px, consider it a click, not a drag
    if (deltaX < 5 && deltaY < 5) {
      onFlip?.()
    }
  }

  // Update tilt effect based on mouse position
  useEffect(() => {
    if (!isHovered || !isInteractive) {
      // Reset tilt when not hovered
      setTiltStyle({
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`,
      })
      setGlarePosition({ x: 50, y: 50, opacity: 0 })
      return
    }

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time
      }

      // Calculate rotation based on mouse position
      const { x, y } = mousePosition
      const rotateY = tiltMaxAngle * (x - 0.5) * 2
      const rotateX = tiltMaxAngle * (0.5 - y) * 2

      // Update tilt style with smooth animation
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      })

      // Update glare effect position
      setGlarePosition({
        x: x * 100,
        y: y * 100,
        opacity: glareOpacity,
      })

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovered, mousePosition, isInteractive, tiltMaxAngle, glareOpacity, scale])

  return (
    <div
      ref={cardRef}
      className="relative overflow-visible cursor-pointer transform-gpu"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transition: "transform 0.2s ease-out",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="button"
      aria-pressed={card.isFlipped ? "true" : "false"}
      tabIndex={isActive ? 0 : -1}
    >
      <div
        className="w-full h-full transition-all duration-700 relative"
        style={{
          transformStyle: "preserve-3d",
          transform: card.isFlipped ? "rotateY(180deg)" : card.isFlipped ? "rotateY(180deg)" : tiltStyle.transform,
          transition: card.isFlipped
            ? "transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            : "transform 0.2s ease-out",
        }}
      >
        {/* Front of card (King of Clubs) */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-xl">
            <Image
              src="/images/king-of-clubs.png"
              alt={`${card.value} of ${card.suit}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Glare effect for front */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 rounded-xl"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}) 0%, rgba(255,255,255,0) 60%)`,
              opacity: isHovered && !card.isFlipped ? 1 : 0,
            }}
          />
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-xl">
            <Image src="/images/card-back.png" alt="Card back" fill className="object-cover" priority />
          </div>

          {/* Glare effect for back */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 rounded-xl"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}) 0%, rgba(255,255,255,0) 60%)`,
              opacity: isHovered && card.isFlipped ? 1 : 0,
            }}
          />
        </div>
      </div>
    </div>
  )
}
