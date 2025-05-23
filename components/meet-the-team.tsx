"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"

// Add a new interface for team member descriptions
interface TeamMemberDescription {
  bio: string
  funFact: string
}

// Update the TeamMember interface to include descriptions
interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  backgroundColor: string
  description?: TeamMemberDescription
}

export default function MeetTheTeam() {
  // State for background color
  const [backgroundColor, setBackgroundColor] = useState("#ffcdb2") // Default peach color
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Update the teamMembers state to include descriptions
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Alex",
      role: "DESIGN GURU",
      image: "/images/just-designer.png",
      backgroundColor: "#ffcdb2",
      description: {
        bio: "Turning coffee into pixel-perfect UI/UX. Alex has an obsession with clean interfaces and user experiences that just make sense.",
        funFact: "Can recite every line from The Office (and applies it to client feedback).",
      },
    },
    {
      id: 2,
      name: "Sam",
      role: "DEV JEDI",
      image: "/images/just-dev.png",
      backgroundColor: "#c1e1c1",
      description: {
        bio: "Building websites so smooth, they feel like butter. Sam's code is poetry in motion, and debugging is their zen.",
        funFact: "Once debugged an entire app during a 3-hour flight (no WiFi, just grit).",
      },
    },
    {
      id: 3,
      name: "Jordan",
      role: "MARKETING ALCHEMIST",
      image: "/images/just-strat.png",
      backgroundColor: "#ffc8dd",
      description: {
        bio: "Making brands go from 'who?' to 'OMG NEED.' Jordan turns marketing strategies into viral sensations.",
        funFact: "Ran a meme page with 100K followers (it was 'research').",
      },
    },
    {
      id: 4,
      name: "Casey",
      role: "PROJECT WIZARD",
      image: "/images/just-intern.png",
      backgroundColor: "#c8b6e2",
      description: {
        bio: "Keeping projects on track and clients happy with supernatural organizational skills and endless patience.",
        funFact: "Can juggle 12 projects while making the perfect latte (literally, they're a barista champion).",
      },
    },
    {
      id: 5,
      name: "Riley",
      role: "CREATIVE DIRECTOR",
      image: "/images/just-intern-b.png",
      backgroundColor: "#ffd166",
      description: {
        bio: "The visionary behind our creative chaos. Riley sees the big picture and makes sure every pixel has purpose.",
        funFact: "Once pitched a campaign using only interpretive dance (the client loved it).",
      },
    },
    {
      id: 6,
      name: "Morgan",
      role: "TECH LEAD",
      image: "/images/just-intern-c.png",
      backgroundColor: "#a0c4ff",
      description: {
        bio: "Architecting digital solutions that scale. Morgan speaks fluent code and translates tech jargon into human.",
        funFact: "Built their first app at 12 (it was a calculator for homework procrastination).",
      },
    },
  ])

  // State for displayed team members (show 4 at a time)
  const [displayedMembers, setDisplayedMembers] = useState<TeamMember[]>(teamMembers.slice(0, 4))

  const [mousePositions, setMousePositions] = useState<Record<number, { x: number; y: number }>>({})

  // Add state for modal
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Add state for modal card tilt
  const [modalMousePosition, setModalMousePosition] = useState({ x: 0, y: 0 })
  const characterCardRef = useRef<HTMLDivElement>(null)
  const descriptionCardRef = useRef<HTMLDivElement>(null)

  // Handle card hover
  const handleCardHover = (id: number | null) => {
    setHoveredCard(id)

    if (id === null) {
      // Reset to default color when no card is hovered
      setBackgroundColor("#ffcdb2")
    } else {
      // Find the hovered team member and set background to their card color
      const member = teamMembers.find((m) => m.id === id)
      if (member) {
        setBackgroundColor(member.backgroundColor)
      }
    }
  }

  // Handle mouse movement for parallax effect
  const handleMouseMove = (event: React.MouseEvent, id: number) => {
    const card = event.currentTarget as HTMLElement
    const rect = card.getBoundingClientRect()

    // Calculate mouse position relative to card center (values from -0.5 to 0.5)
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    setMousePositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }))
  }

  // Shuffle team members
  const shuffleTeam = () => {
    // Create a copy of the team members array
    const shuffled = [...teamMembers]

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Update the displayed members with the first 4 from shuffled array
    setDisplayedMembers(shuffled.slice(0, 4))
  }

  // Add a function to handle card click
  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member)
    setShowModal(true)
  }

  // Add a function to close the modal
  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedMember(null), 300) // Clear selected member after animation
  }

  // Handle mouse movement for modal card tilt
  const handleModalMouseMove = (event: React.MouseEvent) => {
    if (!characterCardRef.current || !descriptionCardRef.current) return

    const modalContainer = event.currentTarget as HTMLElement
    const rect = modalContainer.getBoundingClientRect()

    // Calculate mouse position relative to modal center
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    setModalMousePosition({ x, y })
  }

  return (
    <div
      className="w-full max-w-[1500px]  mx-auto border-x-4 border-b-4 border-[#141b33] py-28 px-4 relative"
      style={{
        backgroundColor: backgroundColor,
        transition: "background-color 0.5s ease-in-out",
      }}
    >
      {/* Title banner */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#141b33] text-white py-3 px-8 transform -rotate-1">
          <h2 className="text-3xl font-bold uppercase">Meet the Dream Team (But Like, Actually Skilled)</h2>
        </div>
      </div>

      {/* Team member cards */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
        {displayedMembers.map((member) => {
          const mousePos = mousePositions[member.id] || { x: 0, y: 0 }
          const isHovered = hoveredCard === member.id

          return (
            <div
              key={member.id}
              onMouseEnter={() => handleCardHover(member.id)}
              onMouseLeave={() => {
                handleCardHover(null)
                // Reset mouse position when leaving card
                setMousePositions((prev) => {
                  const newState = { ...prev }
                  delete newState[member.id]
                  return newState
                })
              }}
              onMouseMove={(e) => handleMouseMove(e, member.id)}
              onClick={() => handleCardClick(member)}
              className="w-[220px] md:w-[250px] transform transition-transform duration-300 hover:scale-105 hover:-rotate-2 cursor-pointer mb-4"
              style={{
                transform: isHovered
                  ? `scale(1.05) rotate(-2deg) perspective(1000px) rotateY(${mousePos.x * 20}deg) rotateX(${mousePos.y * -20}deg)`
                  : "scale(1) rotate(0deg)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="w-full h-[380px] overflow-hidden rounded-lg border-4 border-white shadow-lg relative">
                <div className="w-full h-full p-4 flex flex-col" style={{ backgroundColor: member.backgroundColor }}>
                  {/* Team member image with parallax effect */}
                  <div className="flex-1 relative overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-200"
                      style={{
                        transform: isHovered
                          ? `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
                          : "translate(0, 0)",
                      }}
                    >
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Name and role */}
                  <div className="mt-auto relative z-10">
                    <div className="bg-[#141b33] text-white py-2 px-4 text-center">
                      <h3 className="text-2xl font-bold">{member.name}</h3>
                    </div>
                    <div className="bg-white text-[#141b33] py-2 px-4 text-center font-bold">
                      <p>{member.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Shuffle button */}
      <div className="flex justify-center">
        <button
          onClick={shuffleTeam}
          className="bg-[#141b33] text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-[#1f2b4d] transition-colors"
        >
          Shuffle the squad
        </button>
      </div>

      {/* Modal - improve for mobile */}
      {showModal && selectedMember && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          onMouseMove={handleModalMouseMove}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white bg-[#141b33] rounded-full w-10 h-10 flex items-center justify-center z-10"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Character card - adjust size for mobile */}
            <div
              ref={characterCardRef}
              className="w-[250px] md:w-[280px] h-[380px] md:h-[420px] rounded-lg border-4 border-white shadow-lg physics-card-left"
              style={{
                backgroundColor: selectedMember.backgroundColor,
                transform: `perspective(1000px) rotateY(${modalMousePosition.x * 10}deg) rotateX(${modalMousePosition.y * -10}deg) rotate(-5deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="w-full h-full p-4 flex flex-col">
                {/* Team member image with parallax effect */}
                <div className="flex-1 relative overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-200"
                    style={{
                      transform: `translate(${modalMousePosition.x * -10}px, ${modalMousePosition.y * -10}px)`,
                    }}
                  >
                    <Image
                      src={selectedMember.image || "/placeholder.svg"}
                      alt={selectedMember.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Name and role */}
                <div className="mt-auto">
                  <div className="bg-[#141b33] text-white py-2 px-4 text-center">
                    <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                  </div>
                  <div className="bg-white text-[#141b33] py-2 px-4 text-center font-bold">
                    <p>{selectedMember.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description card - adjust size for mobile */}
            <div
              ref={descriptionCardRef}
              className="w-[250px] md:w-[320px] h-[380px] md:h-[420px] rounded-lg border-4 border-white shadow-lg bg-[#141b33] text-white p-4 md:p-6 physics-card-right"
              style={{
                transform: `perspective(1000px) rotateY(${modalMousePosition.x * 10}deg) rotateX(${modalMousePosition.y * -10}deg) rotate(5deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
              <h3 className="text-xl font-bold text-gray-300 mb-6">{selectedMember.role}</h3>

              {selectedMember.description ? (
                <>
                  <p className="mb-6">{selectedMember.description.bio}</p>
                  <div className="mt-auto">
                    <h4 className="text-lg font-bold mb-2">Fun Fact:</h4>
                    <p>{selectedMember.description.funFact}</p>
                  </div>
                </>
              ) : (
                <p className="mb-6">Information about {selectedMember.name} coming soon!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
