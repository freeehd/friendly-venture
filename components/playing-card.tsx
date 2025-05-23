"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface PlayingCardProps {
  type: "back" | "face"
  cardId?: number // Optional card ID to determine which face card to show
  isFlipped?: boolean // New prop to control flipped state
}

export default function PlayingCard({ type, cardId = 1, isFlipped = false }: PlayingCardProps) {
  // Local state to track flip animation
  const [flipped, setFlipped] = useState(isFlipped)

  // Update local state when prop changes
  useEffect(() => {
    setFlipped(isFlipped)
  }, [isFlipped])

  // Function to get the appropriate card image based on type and cardId
  const getCardImage = (isFaceUp: boolean) => {
    if (type === "back" || !isFaceUp) {
      return "/images/card-back.png"
    }

    // Map of card IDs to their image paths
    const cardImages: Record<number, string> = {
      1: "/images/card-1-intern-female.png", // Female intern
      2: "/images/card-1-intern-male.png", // Male intern
      3: "/images/card-2-developer.png", // Developer
      4: "/images/card-3-finance.png", // Finance
      5: "/images/card-4-project-manager.png", // Project Manager
      6: "/images/card-5-designer-male.png", // Male Designer
      7: "/images/card-5-designer-female.png", // Female Designer
      8: "/images/card-6-strategist.png", // Strategist
      9: "/images/card-8-creative-director.png", // Creative Director
    }

    return cardImages[cardId] || cardImages[1] // Default to first card if ID not found
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card (Character) */}
        <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden">
          <Image
            src={getCardImage(true) || "/placeholder.svg"}
            alt={`Character card ${cardId}`}
            fill
            className="object-cover rounded-xl"
            priority
          />
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180">
          <Image src="/images/card-back.png" alt="Card back" fill className="object-cover rounded-xl" priority />
        </div>
      </div>
    </div>
  )
}
