"use client"

import { useEffect, useRef, useState } from "react"

interface SparkCursorProps {
  containerId: string
  size?: number
  textColor?: string
  backgroundColor?: string
  iconColor?: string
  text?: string
  rotationSpeed?: number
  fontSize?: number
  iconSize?: number
  followDelay?: number
  textPadding?: number
}

export default function SparkCursor({
  containerId,
  size = 80,
  textColor = "#141b33",
  backgroundColor = "white",
  iconColor = "#ffb17a",
  text = "SPARK AN IDEA",
  rotationSpeed = 30,
  fontSize = 19,
  iconSize = 24,
  followDelay = 0.3,
  textPadding = 8,
}: SparkCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const cursorPositionRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const uniqueId = useRef(`textPath-${Math.random().toString(36).substr(2, 9)}`)

  // Set up cursor following with delay and rotation
  useEffect(() => {
    // Get the container element
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`)
      return
    }

    // Apply cursor: none to the container to hide the default cursor
    container.style.cursor = "none"

    let rotation = 0
    let lastTime = performance.now()

    // Animation function
    const animate = (time: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = time - lastTime
      lastTime = time

      if (svgRef.current) {
        // Update rotation
        rotation += (rotationSpeed * deltaTime) / 1000
        svgRef.current.style.transform = `rotate(${rotation}deg)`
      }

      if (cursorRef.current) {
        // Update cursor position with delay
        const targetX = mousePositionRef.current.x
        const targetY = mousePositionRef.current.y

        // Calculate new position with easing
        cursorPositionRef.current.x += (targetX - cursorPositionRef.current.x) * (1 - followDelay)
        cursorPositionRef.current.y += (targetY - cursorPositionRef.current.y) * (1 - followDelay)

        // Apply position
        cursorRef.current.style.transform = `translate(${cursorPositionRef.current.x}px, ${cursorPositionRef.current.y}px)`
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Handle mouse movement within the container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()

      // Check if mouse is inside container
      const isInside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

      if (isInside) {
        // Calculate position relative to the container
        mousePositionRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }

        if (!isVisible) {
          setIsVisible(true)
        }
      } else if (isVisible) {
        setIsVisible(false)
      }
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      document.removeEventListener("mousemove", handleMouseMove)
      container.style.cursor = ""
    }
  }, [containerId, followDelay, rotationSpeed, isVisible])

  // Calculate the radius for the text path with padding
  const textPathRadius = size / 2 - textPadding

  // Don't render if not visible
  if (!isVisible) return null

  return (
    <div
      ref={cursorRef}
      className="absolute top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `-${size / 2}px`,
        marginTop: `-${size / 2}px`,
      }}
    >
      {/* Cursor background */}
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor,
          border: `1px solid ${textColor}`,
        }}
      />

      {/* Rotating text */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <path
            id={uniqueId.current}
            d={`M 50,50 m -${textPathRadius},0 a ${textPathRadius},${textPathRadius} 0 1,1 ${textPathRadius * 2},0 a ${textPathRadius},${textPathRadius} 0 1,1 -${textPathRadius * 2},0`}
            fill="none"
          />
        </defs>
        <text
          style={{
            fill: textColor,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          }}
        >
          <textPath href={`#${uniqueId.current}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center star icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={iconColor}
            stroke={iconColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
