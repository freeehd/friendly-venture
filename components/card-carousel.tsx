"use client"

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react"
import Image from "next/image"

interface CardCarouselProps {
  children: ReactNode
  autoScrollInterval?: number
}

// Interface for tracking card state
interface CardState {
  frontContent: number // Variant index on front (-1 for card back)
  backContent: number // Variant index on back (-1 for card back)
  showingFront: boolean // Whether front or back is currently visible
}

// Interface for card variant
interface CardVariant {
  id: number
  image: string
  alt: string
}

export default function CardCarousel({ children, autoScrollInterval = 5000 }: CardCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  // State for tracking current index and animation
  const [activeIndex, setActiveIndex] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0) // 0 to 1
  const [targetIndex, setTargetIndex] = useState(activeIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)

  // Track card states
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({})
  const flipTimeoutsRef = useRef<Record<number, NodeJS.Timeout>>({})

  // Refs for animation
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null)
  const userInteractingRef = useRef(false)
  const userInteractionTimer = useRef<NodeJS.Timeout | null>(null)

  // Get card variants based on index
  const getCardVariants = useCallback((index: number): CardVariant[] => {
    // Default variants based on card index
    const defaultVariants = [
      [{ id: 1, image: "/images/ux_ui.png", alt: "UX/UI Designer" },],
      [{ id: 2, image: "/images/blockchain-dev.png", alt: "Blockchain Developer" },],
      [{ id: 3, image: "/images/web-dev.png", alt: "Web Developer" }],
      [{ id: 4, image: "/images/social-media.png", alt: "Social Media Manager" }],
      [{ id: 5, image: "/images/media-buyer.png", alt: "Media Buyer" }],
      [{ id: 6, image: "/images/graphic-des.png", alt: "Graphic Designer" },],
      [{ id: 7, image: "/images/seo.png", alt: "SEO Specialist" },],
      [{ id: 8, image: "/images/content-writer.png", alt: "Content Writer" }],
      [{ id: 9, image: "/images/digital-growth.png", alt: "Digital Growth" }],
    ]

    return defaultVariants[index % defaultVariants.length] || defaultVariants[0]
  }, [])

  // Get the next content to show (variant index or card back)
  const getNextContent = useCallback(
    (actualIndex: number, currentContent: number): number => {
      const variants = getCardVariants(actualIndex)

      // If currently showing card back (-1), cycle back to first variant
      if (currentContent === -1) {
        return 0
      }

      // If at the last variant, next is card back
      if (currentContent >= variants.length - 1) {
        return -1 // -1 represents card back
      }

      // Otherwise, next variant
      return currentContent + 1
    },
    [getCardVariants],
  )

  // Process card flip
  const processCardFlip = useCallback(
    (actualIndex: number) => {
      // Get current state for this card
      const currentState = cardStates[actualIndex] || {
        frontContent: 0, // Start with first variant on front
        backContent: 1, // Second variant or card back on back
        showingFront: true, // Start showing front
      }

      // Get variants for this card
      const variants = getCardVariants(actualIndex)

      // If this is the first time setting up the card, initialize back content
      if (!cardStates[actualIndex]) {
        // If only one variant, back should be card back
        // Otherwise, back should be second variant
        const initialBackContent = variants.length > 1 ? 1 : -1

        // Update state with proper initialization
        setCardStates((prev) => ({
          ...prev,
          [actualIndex]: {
            frontContent: 0,
            backContent: initialBackContent,
            showingFront: true,
          },
        }))
        return
      }

      console.log(
        `Card ${actualIndex}: Flipping card. Front content: ${currentState.frontContent}, Back content: ${currentState.backContent}, Showing front: ${currentState.showingFront}`,
      )

      // Flip the card
      setCardStates((prev) => ({
        ...prev,
        [actualIndex]: {
          ...prev[actualIndex],
          showingFront: !currentState.showingFront,
        },
      }))

      // Clear any existing timeout for this card
      if (flipTimeoutsRef.current[actualIndex]) {
        clearTimeout(flipTimeoutsRef.current[actualIndex])
      }

      // Set timeout to update the hidden side halfway through the flip animation
      // This ensures the update happens when the card is edge-on and the change won't be visible
      flipTimeoutsRef.current[actualIndex] = setTimeout(() => {
        setCardStates((prev) => {
          const updatedState = { ...prev[actualIndex] }

          // Update the side that's now hidden
          if (updatedState.showingFront) {
            // Back side is hidden, update it
            updatedState.backContent = getNextContent(actualIndex, updatedState.frontContent)
          } else {
            // Front side is hidden, update it
            updatedState.frontContent = getNextContent(actualIndex, updatedState.backContent)
          }

          return {
            ...prev,
            [actualIndex]: updatedState,
          }
        })
      }, 350) // Half of the 700ms flip animation duration
    },
    [cardStates, getCardVariants, getNextContent],
  )

  // Handle center card click for flipping
  const handleCenterCardClick = useCallback(() => {
    console.log("Center card clicked, flipping...")

    // Get the actual index of the card
    const actualIndex = ((activeIndex % totalItems) + totalItems) % totalItems

    // Process the card flip
    processCardFlip(actualIndex)

    // Mark as user interaction to pause auto-scroll
    userInteractingRef.current = true
    if (userInteractionTimer.current) {
      clearTimeout(userInteractionTimer.current)
    }

    // Set a timeout to mark the end of user interaction
    userInteractionTimer.current = setTimeout(() => {
      userInteractingRef.current = false
    }, 5000)
  }, [activeIndex, totalItems, processCardFlip])

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

  // Initialize card states
  useEffect(() => {
    // Create default state for each card
    const initialStates: Record<number, CardState> = {}
    for (let i = 0; i < totalItems; i++) {
      const variants = getCardVariants(i)
      initialStates[i] = {
        frontContent: 0, // Start with first variant on front
        backContent: variants.length > 1 ? 1 : -1, // Second variant or card back on back
        showingFront: true, // Start showing front
      }
    }
    setCardStates(initialStates)
  }, [totalItems, getCardVariants])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear all flip timeouts
      Object.values(flipTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout)
      })
    }
  }, [])

  // Handle animation
  const animateToIndex = useCallback(
    (newTargetIndex: number) => {
      // Don't animate if already at target or currently animating
      if (newTargetIndex === activeIndex || isAnimating) return

      // Only allow moving one card at a time
      const nextIndex = newTargetIndex > activeIndex ? activeIndex + 1 : activeIndex - 1

      // Set up animation
      setTargetIndex(nextIndex)
      setIsAnimating(true)
      setAnimationProgress(0)
      startTimeRef.current = performance.now()

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Animation function
      const animate = (time: number) => {
        const elapsed = time - startTimeRef.current
        const duration = 500 // Animation duration in ms

        if (elapsed < duration) {
          // Calculate progress with easing
          const t = elapsed / duration

          // Custom easing function for weighty feel
          const easeOutBack = (x: number) => {
            const c1 = 1.70158
            const c3 = c1 + 1
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
          }

          const progress = easeOutBack(t)
          setAnimationProgress(progress)

          // Continue animation
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete
          setAnimationProgress(1)
          setActiveIndex(nextIndex)
          setIsAnimating(false)
          animationRef.current = null
        }
      }

      // Start animation
      animationRef.current = requestAnimationFrame(animate)
    },
    [activeIndex, isAnimating],
  )

  // Handle card click for navigation
  const handleCardClick = useCallback(
    (index: number) => {
      // Only allow clicking if not currently animating
      if (isAnimating) return

      // Mark as user interaction
      userInteractingRef.current = true
      if (userInteractionTimer.current) {
        clearTimeout(userInteractionTimer.current)
      }

      // Set a timeout to mark the end of user interaction
      userInteractionTimer.current = setTimeout(() => {
        userInteractingRef.current = false
      }, 5000)

      // Check if this is a card one position away from center
      const isOneAway = Math.abs(index - activeIndex) === 1

      // If it's one position away, process the flip on the actual card
      if (isOneAway) {
        // Get the actual index of the clicked card
        const actualIndex = ((index % totalItems) + totalItems) % totalItems

        // Process the card flip on this card
        processCardFlip(actualIndex)
      }

      // Animate to the clicked card (but only one step at a time)
      animateToIndex(index)
    },
    [animateToIndex, isAnimating, activeIndex, totalItems, processCardFlip],
  )

  // Auto-scroll
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        // Only auto-scroll if:
        // 1. User is not interacting
        // 2. Not currently animating
        // 3. No card is being hovered
        if (!userInteractingRef.current && !isAnimating && hoveredCardIndex === null) {
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
  }, [activeIndex, animateToIndex, autoScrollInterval, isAnimating, totalItems, hoveredCardIndex])

  // Clean up
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
      if (userInteractionTimer.current) clearTimeout(userInteractionTimer.current)
    }
  }, [])

  // Calculate card positions
  const getCardPosition = useCallback(
    (index: number) => {
      // Calculate position relative to center
      let relativePosition = index - activeIndex

      // If animating, interpolate between positions
      if (isAnimating) {
        const targetRelativePosition = index - targetIndex
        const sourceRelativePosition = index - activeIndex
        relativePosition =
          sourceRelativePosition + (targetRelativePosition - sourceRelativePosition) * animationProgress
      }

      return relativePosition
    },
    [activeIndex, targetIndex, isAnimating, animationProgress],
  )

  // Calculate card styles
  const getCardStyle = useCallback(
    (relativePosition: number, isHovered: boolean) => {
      // Calculate card sizing - adjust for mobile
      const isMobile = containerWidth < 768
      const baseCardWidth = isMobile
        ? Math.min(250, containerWidth * 0.55) // Increased from 200 to 250, and from 0.45 to 0.55
        : Math.min(350, containerWidth * 0.4) // Increased from 280 to 350, and from 0.35 to 0.4

      // Adjust curve parameters for better spacing
      const curveDepth = 25 // Less pronounced curve
      const rotationFactor = 8 // Less rotation

      // Check if this is the center card
      const isCenter = Math.abs(relativePosition) < 0.1
      const isLeftSide = relativePosition < -0.1
      const isRightSide = relativePosition > 0.1

      // Calculate vertical position along the parabolic curve
      // Add hover effect - raise the card up by 15px when hovered (center card only)
      const hoverLift = isCenter && isHovered ? -15 : 0
      const yOffset = Math.pow(relativePosition, 2) * curveDepth + hoverLift

      // Calculate rotation (tilt) based on position
      // Add hover effect - tilt left cards more to the left, right cards more to the right
      let rotation = relativePosition * rotationFactor

      if (isHovered) {
        if (isLeftSide) {
          // Add extra tilt to the left for left cards
          // More pronounced tilt for cards further away
          const tiltAmount = Math.min(Math.abs(relativePosition), 2) * 1.5
          rotation -= tiltAmount
        } else if (isRightSide) {
          // Add extra tilt to the right for right cards
          // More pronounced tilt for cards further away
          const tiltAmount = Math.min(Math.abs(relativePosition), 2) * 1.5
          rotation += tiltAmount
        }
      }

      // Calculate scale based on distance from center - less dramatic scaling
      const scale = 1 - Math.min(Math.abs(relativePosition) * 0.06, 0.25) // More dramatic scaling for side cards

      // Calculate horizontal spacing - DECREASED FROM PREVIOUS VERSION
      // Use a slightly smaller percentage of the container width for spacing
      const cardSpacing = isMobile
        ? Math.min(250, containerWidth * 0.3) // Increased from 200 to 250, and from 0.25 to 0.3
        : Math.min(380, containerWidth * 0.45) // Increased from 320 to 380, and from 0.38 to 0.45

      const xOffset = relativePosition * cardSpacing

      // Calculate z-index to ensure proper stacking
      const zIndex = 1000 - Math.abs(relativePosition) * 10

      // Calculate opacity based on distance from center
      const opacity =
        Math.abs(relativePosition) > 2
          ? Math.max(0, 1 - (Math.abs(relativePosition) - 2) * 0.5) // More gradual fade-in from sides
          : Math.min(1, 1 - (Math.abs(relativePosition) - 0.5) * 0.2) // Slight fade even for cards close to center

      // Add drop shadow with zero blur
      // Format: box-shadow: h-offset v-offset blur spread color;
      const boxShadow = isCenter
        ? isHovered
          ? "0 15px 0 0 rgba(0, 0, 0, 0.4)" // Zero-blur shadow when hovered, more offset
          : "0 8px 0 0 rgba(0, 0, 0, 0.3)" // Zero-blur shadow for center card
        : isHovered
          ? "0 8px 0 0 rgba(0, 0, 0, 0.3)" // Slightly larger shadow for hovered side cards
          : "0 4px 0 0 rgba(0, 0, 0, 0.2)" // Zero-blur shadow for other cards

      // Add transition for hover effects only (not for position animation)
      // Increased transition duration from 0.3s to 0.6s for slower effect
      const transition = "box-shadow 0.6s ease, transform 0.6s ease, opacity 0.8s ease"

      return {
        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex: Math.round(zIndex),
        opacity,
        boxShadow,
        transition,
        width: `${baseCardWidth}px`,
        height: `${baseCardWidth * 1.4}px`, // Maintain aspect ratio
      }
    },
    [containerWidth],
  )

  // Handle hover events for all cards
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredCardIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCardIndex(null)
  }, [])

  // Determine visible cards
  const getVisibleCards = useCallback(() => {
    const isMobile = containerWidth < 768
    const visibleRange = isMobile ? 1 : 2 // Show fewer cards on mobile (3 total vs 5 total)
    const cards = []

    for (let i = activeIndex - visibleRange; i <= activeIndex + visibleRange; i++) {
      const actualIndex = ((i % totalItems) + totalItems) % totalItems
      cards.push({ index: i, actualIndex })
    }

    return cards
  }, [activeIndex, totalItems, containerWidth])

  // Get content for a card side
  const getCardContent = useCallback(
    (actualIndex: number, contentIndex: number) => {
      // If content index is -1, show card back
      if (contentIndex === -1) {
        return <Image src="/images/card-back.png" alt="Card back" fill className="object-cover" priority />
      }

      // Otherwise, show the variant
      const variants = getCardVariants(actualIndex)
      const variant = variants[contentIndex] || variants[0]

      return (
        <Image src={variant.image || "/placeholder.svg"} alt={variant.alt} fill className="object-cover" priority />
      )
    },
    [getCardVariants],
  )

  // Render carousel
  return (
    <div
      className="relative w-full overflow-visible py-4 md:py-8"
      style={{ zIndex: 9999, marginTop: "-5rem" }}
      ref={containerRef}
    >
      <div
        className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center"
        style={{ transform: "translateY(-5rem)" }}
      >
        {getVisibleCards().map(({ index, actualIndex }) => {
          const relativePosition = getCardPosition(index)
          const isHovered = hoveredCardIndex === index
          const style = getCardStyle(relativePosition, isHovered)
          const isActive = index === activeIndex
          const isClickable = Math.abs(index - activeIndex) <= 2 // Allow clicking up to 2 cards away

          // Get card state
          const cardState = cardStates[actualIndex] || {
            frontContent: 0,
            backContent: 1,
            showingFront: true,
          }

          return (
            <div
              key={`card-${index}`}
              className={`absolute top-0 left-1/2 aspect-[2.5/3.5] rounded-lg ${isClickable ? "cursor-pointer" : ""}`}
              style={{
                ...style,
                pointerEvents: isClickable ? "auto" : "none",
                // Center the card without using translate-x-1/2
                left: "50%",
                marginLeft: `-${Number.parseInt(style.width) / 2}px`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (isActive) {
                  handleCenterCardClick()
                } else if (isClickable) {
                  handleCardClick(index)
                }
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              aria-label={`Card ${actualIndex + 1} of ${totalItems}`}
              aria-current={isActive ? "true" : "false"}
            >
              {/* Card container with thick black border */}
              <div
                className="w-full h-full"
                style={{
                  perspective: "1000px",
                }}
              >
                <div
                  className="w-full h-full relative transition-transform duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: cardState.showingFront ? "rotateY(0deg)" : "rotateY(180deg)",
                  }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: "hidden",
                      border: "5px solid black",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="w-full h-full overflow-hidden">
                      {getCardContent(actualIndex, cardState.frontContent)}
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      border: "5px solid black",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="w-full h-full overflow-hidden">
                      {getCardContent(actualIndex, cardState.backContent)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
