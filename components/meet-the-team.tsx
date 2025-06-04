"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"

// Update the TeamMember interface to match the new structure:
interface TeamMember {
  id: number
  designation: string
  image: string
  backgroundColor: string
  headline: string
  whatWeDo: string
  expertiseIncludes: string[]
  pastWork: string[]
}

export default function MeetTheTeam() {
  // State for background color
  const [backgroundColor, setBackgroundColor] = useState("#ffcdb2") // Default peach color
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Replace the teamMembers state with the new data structure:
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      designation: "SOCIAL MEDIA MANAGER",
      image: "/images/just-designer.png",
      backgroundColor: "#ffcdb2",
      headline: "🎯 Strategic Social Media Leadership That Builds Brands and Drives Results",
      whatWeDo:
        "Our Social Media Manager oversees your brand's entire presence across platforms with a focus on strategy, consistency, and audience growth. From content calendars to real-time engagement, we manage your voice across the digital space to ensure impact, loyalty, and measurable ROI.",
      expertiseIncludes: [
        "Social media audits & strategy planning",
        "Cross-platform campaign management (Meta, LinkedIn, TikTok, X, YouTube)",
        "Community engagement & brand voice development",
        "Influencer collaboration & performance tracking",
        "Analytics & reporting dashboards",
        "Reputation & DM management",
        "Scheduling & automation",
      ],
      pastWork: [
        "[Brand X Cosmetics Launch] – Increased engagement by 40% with seasonal campaign designs.",
        "[Startup Social Kit] – Created a full-month brand launch template suite for Instagram and LinkedIn.",
        "Visuals available upon request.",
      ],
    },
    {
      id: 2,
      designation: "MEDIA BUYER",
      image: "/images/just-dev.png",
      backgroundColor: "#c1e1c1",
      headline: "📣 Specialized In Paid Ad Campaigns Across Meta, Google, TikTok, and LinkedIn Ads",
      whatWeDo:
        "Our Media Buyer specializes in creating and optimizing paid advertising campaigns that deliver measurable results. From budget allocation to performance tracking, we ensure every dollar spent drives maximum ROI across all major advertising platforms.",
      expertiseIncludes: [
        "Campaign budgeting & bid optimization",
        "Funnel creation",
        "Meta Ads Manager, Google Ads, TikTok Ads, LinkedIn Campaign Manager",
        "A/B testing, retargeting, and scaling strategies",
      ],
      pastWork: [
        "$20K campaign for DTC skincare brand → ROAS 4.8x",
        "Nonprofit lead-gen campaign with 12K conversions under $0.80 CPL",
      ],
    },
    {
      id: 3,
      designation: "SEO SPECIALIST",
      image: "/images/just-strat.png",
      backgroundColor: "#ffc8dd",
      headline: "🔍 Technical, On-Page, and Off-Page SEO to Drive Organic Visibility",
      whatWeDo:
        "Our SEO Specialist focuses on improving your website's search engine rankings through comprehensive optimization strategies. We handle everything from technical audits to content optimization, ensuring your brand gets found by the right audience.",
      expertiseIncludes: [
        "Keyword research, site audits, backlink strategy",
        "Google Search Console, SEMrush, Ahrefs, Screaming Frog",
        "Schema markup & core web vitals optimization",
      ],
      pastWork: [
        "300% traffic growth for a SaaS company in 6 months",
        "Ranked 20+ blog posts on page one for high-competition keywords",
      ],
    },
    {
      id: 4,
      designation: "GRAPHIC DESIGNER",
      image: "/images/just-intern.png",
      backgroundColor: "#c8b6e2",
      headline: "🎨 Brand Identity, Illustrations, Print & Digital Creative Assets",
      whatWeDo:
        "Our Graphic Designer creates visually compelling designs that communicate your brand's message effectively. From logos to marketing materials, we ensure every visual element aligns with your brand identity and resonates with your target audience.",
      expertiseIncludes: [
        "Adobe Illustrator, Photoshop, InDesign",
        "Packaging, brochures, flyers, infographics",
        "Brand guideline creation",
      ],
      pastWork: [
        "Complete brand identity for a logistics startup",
        "Pitch deck for a fintech app that raised $2M in funding",
      ],
    },
    {
      id: 5,
      designation: "UI/UX DESIGNER",
      image: "/images/just-intern-b.png",
      backgroundColor: "#ffd166",
      headline: "🧩 User-Centered Designs for Websites, Apps, and Dashboards",
      whatWeDo:
        "Our UI/UX Designer creates intuitive and engaging user experiences that convert visitors into customers. We focus on user research, wireframing, and prototyping to ensure every interaction is meaningful and drives business results.",
      expertiseIncludes: [
        "Wireframing, prototyping, interaction design",
        "Figma, Adobe XD, Webflow",
        "User journey mapping, usability testing",
      ],
      pastWork: [
        "SaaS dashboard UX revamp → reduced churn by 20%",
        "Website UX for a D2C brand → increased conversion rate by 31%",
      ],
    },
    {
      id: 6,
      designation: "WEB DEVELOPER",
      image: "/images/just-intern-c.png",
      backgroundColor: "#a0c4ff",
      headline: "🖥 Custom Websites, CMS Integrations, E-commerce, and Responsive Coding",
      whatWeDo:
        "Our Web Developer builds fast, secure, and scalable websites that perform beautifully across all devices. From custom development to CMS integration, we create digital experiences that support your business goals.",
      expertiseIncludes: [
        "HTML5, CSS3, JavaScript, React, Next.js",
        "WordPress, Shopify, Webflow",
        "Git, GitHub, Vercel, Netlify",
      ],
      pastWork: ["E-commerce store with 5K SKUs (Shopify Plus)", "Portfolio site with custom CMS for 100+ articles"],
    },
    {
      id: 7,
      designation: "CONTENT WRITER",
      image: "/images/just-designer.png",
      backgroundColor: "#ffb3ba",
      headline: "✍️ SEO-Optimized, Brand-Driven Content Across Formats",
      whatWeDo:
        "Our Content Writer creates compelling, search-optimized content that engages your audience and drives conversions. From blog posts to product descriptions, we ensure every word serves your brand's purpose.",
      expertiseIncludes: [
        "Blog posts, landing pages, product descriptions, newsletters",
        "SurferSEO, Grammarly, Jasper, Google Docs",
        "Tone matching: corporate, casual, technical, storytelling",
      ],
      pastWork: ["30-piece content calendar for a tech blog", "Copywriting for a conversion-focused SaaS homepage"],
    },
    {
      id: 8,
      designation: "DIGITAL GROWTH STRATEGIST",
      image: "/images/just-dev.png",
      backgroundColor: "#bae1ff",
      headline: "📈 Full-Stack Growth Strategy Across Acquisition, Retention, and Funnel Optimization",
      whatWeDo:
        "Our Digital Growth Strategist develops comprehensive growth strategies that scale your business sustainably. We analyze data, identify opportunities, and implement systems that drive long-term success.",
      expertiseIncludes: [
        "Funnel mapping, cohort analysis, CAC vs. LTV, GTM strategies",
        "Google Analytics, Mixpanel, HubSpot, Notion",
      ],
      pastWork: [
        "Launched a fintech platform → grew to 40K users in 9 months",
        "Reworked retention strategy → doubled monthly recurring revenue",
      ],
    },
    {
      id: 9,
      designation: "COMIC DESIGNER",
      image: "/images/just-strat.png",
      backgroundColor: "#ffffba",
      headline: "🎭 Storyboarding, Character Design, and Digital Comics for Brand Storytelling",
      whatWeDo:
        "Our Comic Designer creates engaging visual narratives that make complex ideas accessible and memorable. We use the power of storytelling to connect with audiences in unique and entertaining ways.",
      expertiseIncludes: [
        "Procreate, Clip Studio Paint, Adobe Fresco",
        "Sequential art, visual humor, short-form storytelling",
      ],
      pastWork: ["Instagram comic series for wellness brand", "Branded educational comic for a sustainability NGO"],
    },
    {
      id: 10,
      designation: "BLOCKCHAIN DEVELOPER",
      image: "/images/just-intern.png",
      backgroundColor: "#d4c5f9",
      headline: "🧬 Smart Contracts, NFTs, DApps, and Secure Web3 Solutions",
      whatWeDo:
        "Our Blockchain Developer builds secure, decentralized applications and smart contracts that leverage the power of blockchain technology. We create innovative Web3 solutions that position your business at the forefront of digital innovation.",
      expertiseIncludes: ["Solidity, Rust, Ethereum, Polygon, IPFS", "Truffle, Hardhat, Metamask integrations"],
      pastWork: ["NFT marketplace MVP on Polygon", "DAO architecture for a creative collective"],
    },
    {
      id: 11,
      designation: "MOBILE APP DEVELOPER",
      image: "/images/just-intern-b.png",
      backgroundColor: "#c7ceea",
      headline: "📱 iOS, Android, Cross-Platform App Development",
      whatWeDo:
        "Our Mobile App Developer creates native and cross-platform mobile applications that deliver exceptional user experiences. We build apps that are fast, intuitive, and designed to drive user engagement and retention.",
      expertiseIncludes: ["Flutter, React Native, Swift, Kotlin", "Firebase, Stripe, REST APIs"],
      pastWork: [
        "Fitness app for Gen Z audience with habit tracking",
        "On-demand service booking app for local businesses",
      ],
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

  // Add state for shuffle animation
  const [isShuffling, setIsShuffling] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)

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

  // Enhanced shuffle team function with animation
  const shuffleTeam = () => {
    if (isShuffling) return // Prevent multiple shuffles during animation

    setIsShuffling(true)
    setAnimatingOut(true)

    // First phase: animate cards out
    setTimeout(() => {
      // Create a copy of the team members array
      const shuffled = [...teamMembers]

      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Update the displayed members with the first 4 from shuffled array
      setDisplayedMembers(shuffled.slice(0, 4))
      setAnimatingOut(false)

      // Second phase: animate cards in
      setTimeout(() => {
        setIsShuffling(false)
      }, 100)
    }, 600) // Wait for cards to animate out
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
      id="dream-team" // Added proper ID for navigation
      className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] py-28 px-4 relative"
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
        {displayedMembers.map((member, index) => {
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
              className={`w-[220px] md:w-[250px] transform transition-all duration-300 hover:scale-105 hover:-rotate-2 cursor-pointer mb-4 ${
                animatingOut ? "animate-shuffle-out" : isShuffling ? "animate-shuffle-in" : ""
              }`}
              style={{
                transform:
                  isHovered && !isShuffling
                    ? `scale(1.05) rotate(-2deg) perspective(1000px) rotateY(${mousePos.x * 20}deg) rotateX(${mousePos.y * -20}deg)`
                    : "scale(1) rotate(0deg)",
                transition: isShuffling ? "none" : "transform 0.2s ease-out",
                animationDelay: `${index * 100}ms`, // Stagger the animations
              }}
            >
              <div className="w-full h-[380px] overflow-hidden rounded-lg border-4 border-white shadow-lg relative">
                <div className="w-full h-full p-4 flex flex-col" style={{ backgroundColor: member.backgroundColor }}>
                  {/* Team member image with parallax effect */}
                  <div className="flex-1 relative overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-200"
                      style={{
                        transform:
                          isHovered && !isShuffling
                            ? `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
                            : "translate(0, 0)",
                      }}
                    >
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.designation}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Name and role */}
                  <div className="mt-auto relative z-10">
                    {/* Update the card display to show only designation: */}
                    <div className="bg-[#141b33] text-white py-2 px-4 text-center">
                      <h3 className="text-lg md:text-xl font-bold">{member.designation}</h3>
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
          disabled={isShuffling}
          className={`py-3 px-8 rounded-full text-lg font-bold transition-all duration-300 ${
            isShuffling
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-[#141b33] text-white hover:bg-[#1f2b4d] hover:scale-105"
          }`}
        >
          {isShuffling ? "Shuffling..." : "Shuffle the squad"}
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
                      alt={selectedMember.designation}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Name and role */}
                <div className="mt-auto">
                  {/* Remove the name from the character card in the modal and update it to show designation: */}
                  <div className="bg-[#141b33] text-white py-2 px-4 text-center">
                    <h3 className="text-xl md:text-2xl font-bold">{selectedMember.designation}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Update the modal content to show the new structure: */}
            {/* Description card */}
            <div
              ref={descriptionCardRef}
              className="w-[280px] md:w-[400px] h-[500px] md:h-[600px] rounded-lg border-4 border-white shadow-lg bg-[#141b33] text-white p-4 md:p-6 physics-card-right overflow-y-auto"
              style={{
                transform: `perspective(1000px) rotateY(${modalMousePosition.x * 10}deg) rotateX(${modalMousePosition.y * -10}deg) rotate(5deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedMember.designation}</h2>

              <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-4">{selectedMember.headline}</h3>

              <div className="mb-4">
                <h4 className="text-md font-bold mb-2 text-yellow-400">What We Do:</h4>
                <p className="text-sm md:text-base mb-4">{selectedMember.whatWeDo}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-bold mb-2 text-yellow-400">Expertise Includes:</h4>
                <ul className="text-sm md:text-base space-y-1">
                  {selectedMember.expertiseIncludes.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-bold mb-2 text-yellow-400">Past Work:</h4>
                <ul className="text-sm md:text-base space-y-2 mb-4">
                  {selectedMember.pastWork.map((work, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full bg-yellow-400 text-[#141b33] py-2 px-4 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                  onClick={() => {
                    // Navigate to projects page - you can implement this based on your routing setup
                    window.open("/projects", "_blank")
                  }}
                >
                  View All Projects →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
