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

  // Updated team members array with unique images for each member
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
      image: "/images/design-b.png",
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
      image: "/images/finance-b.png",
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
      image: "/images/design-a.png",
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
      designation: "BLOCKCHAIN DEVELOPER",
      image: "/images/dev-b.png",
      backgroundColor: "#f0f8ff",
      headline: "🔗 Building the Future of Web3",
      whatWeDo:
        "Our Blockchain Developer brings cutting-edge Web3 expertise to every project. From smart contracts to DeFi protocols, they're perfect for implementing the latest blockchain technologies and decentralized solutions.",
      expertiseIncludes: [
        "Solidity, Web3.js, Ethers.js",
        "Smart contract development",
        "DeFi protocol integration",
        "Blockchain infrastructure",
      ],
      pastWork: ["Built DeFi protocols for 3 startups", "Contributed to open-source blockchain projects"],
    },
    // Additional team members using only existing images
    // {
    //   id: 9,
    //   designation: "FINANCE MANAGER",
    //   image: "/images/intern-a.png",
    //   backgroundColor: "#e8f5e8",
    //   headline: "💰 Strategic Financial Planning & Budget Optimization",
    //   whatWeDo:
    //     "Our Finance Manager ensures your business stays profitable and grows sustainably. From budget planning to financial forecasting, we handle the numbers so you can focus on what you do best.",
    //   expertiseIncludes: [
    //     "Financial planning & analysis",
    //     "Budget management & cost optimization",
    //     "Cash flow forecasting",
    //     "Investment analysis & ROI tracking",
    //   ],
    //   pastWork: [
    //     "Reduced operational costs by 25% for a tech startup",
    //     "Managed $2M+ budgets across multiple projects",
    //   ],
    // },
   
    // {
    //   id: 11,
    //   designation: "SENIOR DESIGNER",
    //   image: "/images/just-intern-b.png",
    //   backgroundColor: "#f5f0e8",
    //   headline: "🎨 Sophisticated Design Leadership",
    //   whatWeDo:
    //     "Our Senior Designer brings years of experience and a keen eye for detail to every project. From concept to execution, they ensure your brand stands out with sophisticated, impactful design.",
    //   expertiseIncludes: [
    //     "Brand strategy & identity design",
    //     "Art direction & creative leadership",
    //     "Print & digital design mastery",
    //     "Team mentoring & design systems",
    //   ],
    //   pastWork: ["Led rebranding for Fortune 500 company", "Award-winning packaging design campaigns"],
    // },
  ])

  // State for displayed team members (show 8 at a time)
  const [displayedMembers, setDisplayedMembers] = useState<TeamMember[]>(teamMembers.slice(0, 8))

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
      const member = displayedMembers.find((m) => m.id === id)
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

  // Enhanced shuffle team function with improved animation
  const shuffleTeam = () => {
    if (isShuffling) return // Prevent multiple shuffles during animation

    setIsShuffling(true)
    setAnimatingOut(true)

    // First phase: animate cards out with staggered timing
    setTimeout(() => {
      // Create a copy of the team members array
      const shuffled = [...teamMembers]

      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Update the displayed members with the first 8 from shuffled array
      setDisplayedMembers(shuffled.slice(0, 8))
      setAnimatingOut(false)

      // Second phase: animate cards in with staggered timing
      setTimeout(() => {
        setIsShuffling(false)
      }, 200)
    }, 800) // Wait for cards to animate out
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
      id="dream-team"
      className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] py-28 px-4 relative overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
        transition: "background-color 0.5s ease-in-out",
      }}
    >
      {/* Title banner */}
      <div className="flex justify-center mb-16">
        <div className="bg-[#141b33] text-white py-4 px-10 transform  shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Meet the Dream Team (But Like, Actually Skilled)
          </h2>
        </div>
      </div>

      {/* Team member cards - improved grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 max-w-[1200px] mx-auto">
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
              className={`group transform transition-all duration-500 hover:scale-110 hover:-rotate-3 cursor-pointer ${
                animatingOut ? "animate-enhanced-shuffle-out" : isShuffling ? "animate-enhanced-shuffle-in" : ""
              }`}
              style={{
                transform:
                  isHovered && !isShuffling
                    ? `scale(1.1) rotate(-3deg) perspective(1000px) rotateY(${mousePos.x * 25}deg) rotateX(${mousePos.y * -25}deg)`
                    : "scale(1) rotate(0deg)",
                transition: isShuffling ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animationDelay: `${index * 150}ms`, // Increased stagger for better effect
              }}
            >
              <div className="w-full h-[400px] md:h-[420px] overflow-hidden rounded-2xl border-4 border-white shadow-2xl relative group-hover:shadow-3xl transition-shadow duration-300">
                <div
                  className="w-full h-full p-6 flex flex-col relative"
                  style={{ backgroundColor: member.backgroundColor }}
                >
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                  {/* Team member image with enhanced parallax effect */}
                  <div className="flex-1 relative overflow-hidden rounded-lg">
                    <div
                      className="absolute inset-0 transition-transform duration-300"
                      style={{
                        transform:
                          isHovered && !isShuffling
                            ? `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.1)`
                            : "translate(0, 0) scale(1)",
                      }}
                    >
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.designation}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Enhanced name and role section */}
                  <div className="mt-auto relative z-10">
                    <div className="bg-[#141b33] text-white py-3 px-4 text-center rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                      <h3 className="text-sm md:text-lg font-bold uppercase tracking-wide leading-tight">
                        {member.designation}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced shuffle button */}
      <div className="flex justify-center">
        <button
          onClick={shuffleTeam}
          disabled={isShuffling}
          className={`relative py-4 px-10 rounded-full text-xl font-bold transition-all duration-300 transform ${
            isShuffling
              ? "bg-gray-400 text-gray-600 cursor-not-allowed scale-95"
              : "bg-[#141b33] text-white hover:bg-[#1f2b4d] hover:scale-110 hover:shadow-2xl active:scale-95"
          } shadow-lg`}
        >
          <span className={`transition-opacity duration-300 ${isShuffling ? "opacity-0" : "opacity-100"}`}>
            Shuffle the squad
          </span>
          {isShuffling && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Shuffling...
            </span>
          )}
        </button>
      </div>

      {/* Enhanced modal */}
      {showModal && selectedMember && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
          onMouseMove={handleModalMouseMove}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced close button */}
            <button
              className="absolute top-4 right-4 text-white bg-[#141b33] rounded-full w-12 h-12 flex items-center justify-center z-10 hover:bg-[#1f2b4d] transition-colors duration-200 shadow-lg"
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

            {/* Enhanced character card */}
            <div
              ref={characterCardRef}
              className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] rounded-2xl border-4 border-white shadow-2xl physics-card-left"
              style={{
                backgroundColor: selectedMember.backgroundColor,
                transform: `perspective(1000px) rotateY(${modalMousePosition.x * 15}deg) rotateX(${modalMousePosition.y * -15}deg) rotate(-5deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="w-full h-full p-6 flex flex-col relative">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />

                {/* Team member image with parallax effect */}
                <div className="flex-1 relative overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 transition-transform duration-200"
                    style={{
                      transform: `translate(${modalMousePosition.x * -15}px, ${modalMousePosition.y * -15}px) scale(1.05)`,
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

                {/* Enhanced name and role */}
                <div className="mt-auto relative z-10">
                  <div className="bg-[#141b33] text-white py-3 px-4 text-center rounded-xl shadow-lg">
                    <h3 className="text-lg md:text-2xl font-bold uppercase tracking-wide">
                      {selectedMember.designation}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced description card */}
            <div
              ref={descriptionCardRef}
              className="w-[320px] md:w-[450px] h-[550px] md:h-[650px] rounded-2xl border-4 border-white shadow-2xl bg-[#141b33] text-white p-6 md:p-8 physics-card-right overflow-y-auto"
              style={{
                transform: `perspective(1000px) rotateY(${modalMousePosition.x * 15}deg) rotateX(${modalMousePosition.y * -15}deg) rotate(5deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-yellow-400">{selectedMember.designation}</h2>

              <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-6 leading-relaxed">
                {selectedMember.headline}
              </h3>

              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                  <span className="mr-2">🎯</span>
                  What We Do:
                </h4>
                <p className="text-sm md:text-base mb-4 leading-relaxed text-gray-200">{selectedMember.whatWeDo}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                  <span className="mr-2">⚡</span>
                  Expertise Includes:
                </h4>
                <ul className="text-sm md:text-base space-y-2">
                  {selectedMember.expertiseIncludes.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-3 mt-1">•</span>
                      <span className="text-gray-200">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                  <span className="mr-2">🏆</span>
                  Past Work:
                </h4>
                <ul className="text-sm md:text-base space-y-3 mb-6">
                  {selectedMember.pastWork.map((work, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-3 mt-1">•</span>
                      <span className="text-gray-200">{work}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#141b33] py-3 px-6 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  onClick={() => {
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
