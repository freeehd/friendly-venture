"use client"
import CardCarousel from "@/components/card-carousel"
import InfiniteLetterCarousel from "@/components/infinite-letter-carousel"
import ElasticNav from "@/components/elastic-nav"
import AboutUsAnimation from "@/components/about-us-animation"
import ParallaxColleagues from "@/components/parallax-colleagues"
import Image from "next/image"
import Link from "next/link"
import MeetTheTeam from "@/components/meet-the-team"
import ScrollProgress from "@/components/scroll-progress"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  // Create team member cards for the carousel
  const cards = [
    <div key="1" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-1-intern-female.png" alt="Design Team Member" fill className="object-cover" />
    </div>,
    <div key="2" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-2-developer.png" alt="Developer" fill className="object-cover" />
    </div>,
    <div key="3" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-3-finance.png" alt="Business Strategist" fill className="object-cover" />
    </div>,
    <div key="4" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-4-project-manager.png" alt="Project Manager" fill className="object-cover" />
    </div>,
    <div key="5" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-5-designer-male.png" alt="Creative Director" fill className="object-cover" />
    </div>,
    <div key="6" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-6-strategist.png" alt="Marketing Strategist" fill className="object-cover" />
    </div>,
    <div key="7" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-8-creative-director.png" alt="Tech Lead" fill className="object-cover" />
    </div>,
    <div key="8" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-1-intern-female.png" alt="UX/UI Designer" fill className="object-cover" />
    </div>,
    <div key="9" className="w-full h-full overflow-hidden rounded-xl">
      <Image src="/images/card-2-developer.png" alt="Blockchain Developer" fill className="object-cover" />
    </div>,
  ]

  const { ref: valuesRef, isIntersecting: valuesVisible } = useIntersectionObserver()
  const emojiCursorRef = useRef<HTMLDivElement>(null)

  // Emoji cursor functionality
  useEffect(() => {
    const animationContainer = document.getElementById('animation-container')
    
    const handleMouseMove = (e: MouseEvent) => {
      if (emojiCursorRef.current) {
        emojiCursorRef.current.style.left = e.clientX + 'px'
        emojiCursorRef.current.style.top = e.clientY + 'px'
      }
    }

    const handleMouseEnter = () => {
      if (emojiCursorRef.current) {
        emojiCursorRef.current.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      if (emojiCursorRef.current) {
        emojiCursorRef.current.style.opacity = '0'
      }
    }

    // Add event listeners to the animation container specifically
    if (animationContainer) {
      animationContainer.addEventListener('mousemove', handleMouseMove)
      animationContainer.addEventListener('mouseenter', handleMouseEnter)
      animationContainer.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (animationContainer) {
        animationContainer.removeEventListener('mousemove', handleMouseMove)
        animationContainer.removeEventListener('mouseenter', handleMouseEnter)
        animationContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setFormStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send message",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-20 sm:pt-32 md:pt-44">
      <ScrollProgress />
      {/* Elastic Navigation Bar */}
      <ElasticNav />

      {/* Global emoji cursor */}
      <div 
        ref={emojiCursorRef}
        className="fixed pointer-events-none z-[9999] text-2xl"
        style={{ 
          cursor: "none",
          transform: "translate(-50%, -50%)",
          transition: "all 0.1s ease",
          opacity: "0",
          left: "0px",
          top: "0px"
        }}
        id="emoji-cursor"
      >
        🌟
      </div>

      {/* Home section */}
      <div id="home" className="w-full">
        {/* Blue container with border */}
        <div
          className="relative w-full max-w-[1500px] mx-auto bg-[#a7d8f2] border-4 border-[#141b33] shadow-2xl overflow-visible py-8 sm:py-12 md:py-16 px-4 md:px-8"
          style={{ minHeight: "950px" }}
        >
          {/* Title banner */}
          <div className="absolute left-0 right-0 z-10" style={{ top: "clamp(-20px, -2vh, -30px)" }}>
            <div className="relative mx-auto px-4 sm:px-6 md:px-8" style={{ 
              maxWidth: "clamp(300px, 90vw, 780px)",
              width: "100%"
            }}>
              <div
                className="bg-[#141b33] text-white py-3 sm:py-4 md:py-6 px-4 sm:px-6 md:px-8 w-full"
                style={{
                  height: "clamp(60px, 8vh, 110px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1
                  className="concept-capers-title text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl whitespace-nowrap"
                  style={{
                    lineHeight: "0.9",
                    letterSpacing: "-0.01em",
                    fontSize: "clamp(1.5rem, 3vw, 2.9rem)",
                  }}
                >
                  THE FRIENDLY VERTICAL
                </h1>
              </div>
            </div>
          </div>

          {/* Hero description */}
          <div className="relative z-30 mt-[600px] sm:mt-[650px] text-center px-4 mb-8 sm:mb-12">
            <div className="max-w-3xl mx-auto text-[#141b33]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"> Digital Magic, Minus the BS.</h2>
              <p className="text-lg sm:text-xl font-medium mb-6 sm:mb-8">
                We're your all-in-one creative tech squad mixing killer designs, code, and marketing strategy so you
                don't have to juggle 10 freelancers.
              </p>

              <div className="mt-6 sm:mt-8 flex justify-center">
                <Link
                  href="#contact"
                  className="bg-[#141b33] text-white py-2 sm:py-3 px-8 sm:px-10 rounded-full text-base sm:text-lg font-bold hover:bg-[#1f2b4d] transition-colors"
                >
                  Let's make cool stuff 
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card carousel positioned absolutely to overlay the container */}
        <div className="absolute top-[400px] sm:top-[500px] left-0 w-full z-20">
          <CardCarousel autoScrollInterval={5000}>{cards}</CardCarousel>
        </div>
      </div>

      {/* Letter tiles carousel
      <div className="w-full max-w-[1500px] flex justify-center">
        <InfiniteLetterCarousel />
      </div> */}

      {/* Our Values section - improved responsiveness */}
      <div
        ref={valuesRef}
        id="values"
        className={`w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white transition-all duration-1000 ${
          valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ height: "1000px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0 h-full">
          {/* Left column - Values content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-2xl mx-auto md:mx-0">
              <div className="bg-[#141b33] text-white py-2 px-4 sm:px-6 inline-block transform  mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Our Energy? Purpose Driven, Always.</h2>
              </div>
              <div className="space-y-6 sm:space-y-8 text-[#141b33]">
                <p className="text-base sm:text-lg lg:text-xl font-medium">
                  We hacked the system: happy clients + happy creatives = work that slaps.
                </p>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ Talent-First</h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      We cherry-pick the dopest designers, devs, and marketers, no mediocre "yes men" here.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ No Exploitation, Just Vibes</h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      Our team gets paid fairly, works flexibly, and actually likes Mondays.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ No Nonsense. Just Results.                    </h3>
                    <p className="text-sm sm:text-base md:text-lg">
                    We cut through the noise and focus on what moves the needle.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-[#ffda55] rounded-lg border-2 border-[#141b33]">
                  <p className="text-sm sm:text-base md:text-lg font-medium italic">
                    "Think of us as your business's backstage crew, we make you look good while having a blast doing it."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Interactive animation - improved responsiveness */}
          <div className="relative border-t-4 md:border-t-0 md:border-l-4 border-[#141b33] w-full md:w-auto h-[min(400px,40vh)] md:h-full">
            <div
              className="relative w-full h-full overflow-hidden"
              id="animation-container"
              style={{ 
                cursor: "none", 
                aspectRatio: "3/4",
                margin: "0 auto"
              }}
            >
              <AboutUsAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Agency Stats */}
      <div className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-8">
          {/* Happy Clients */}
          <div
            className="border-4 border-[#141b33] bg-white p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:bg-[#ffccd5] cursor-pointer"
            style={{ minHeight: "220px" }}
          >
            <div className="flex items-baseline mb-4">
              <span className="text-7xl font-black text-[#141b33]">30</span>
              <span className="text-4xl font-black text-[#141b33]">+</span>
            </div>
            <h3 className="text-2xl font-bold tracking-wider text-[#141b33] uppercase">Happy Clients</h3>
          </div>

          {/* Projects Delivered */}
          <div
            className="border-4 border-[#141b33] bg-white p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:bg-[#a0e7e5] cursor-pointer"
            style={{ minHeight: "220px" }}
          >
            <div className="flex items-baseline mb-4">
              <span className="text-7xl font-black text-[#141b33]">70</span>
              <span className="text-4xl font-black text-[#141b33]">+</span>
            </div>
            <h3 className="text-2xl font-bold tracking-wider text-[#141b33] uppercase">Projects Delivered</h3>
          </div>

          {/* Coffee Consumed */}
          <div
            className="border-4 border-[#141b33] bg-white p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:bg-[#b5ead7] cursor-pointer"
            style={{ minHeight: "220px" }}
          >
            <div className="flex items-baseline mb-4">
              <span className="text-7xl font-black text-[#141b33]">∞</span>
            </div>
            <h3 className="text-2xl font-bold tracking-wider text-[#141b33] uppercase">Cups of Coffee</h3>
          </div>
        </div>
      </div>

      {/* Parallax Team Section */}
      <ParallaxColleagues />

      {/* Meet the Team section */}
      <MeetTheTeam />

      {/* Contact Us section */}
      <div
        id="contact"
        className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white p-4 md:p-8 lg:p-12"
      >
        <div className="bg-[#141b33] text-white py-2 px-6 inline-block transform  mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Hit Us Up </h2>
        </div>

        <p className="text-xl text-[#141b33] mb-8">
          Whether you're ready to collab or just wanna nerd out over 3D modeling, slide into our DMs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
            {formStatus.type && (
              <div
                className={`p-4 rounded-lg ${
                  formStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {formStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-[#141b33] mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Batman works, we don't judge"
                  className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-[#141b33] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="not_a_scam@trustmebro.com"
                  className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-[#141b33] mb-2">What's the vibe?</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="I need a website">I need a website</option>
                  <option value="Marketing SOS">Marketing SOS</option>
                  <option value="Just wanna say hi">Just wanna say hi</option>
                  <option value="Let's build something epic">Let's build something epic</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-[#141b33] mb-2">Tell us more</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Spill the tea about your project..."
                  className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#141b33] text-white py-4 px-8 rounded-lg text-lg font-bold transition-colors ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#1f2b4d]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send it!"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 border-4 border-[#141b33] rounded-lg bg-[#ffda55]">
              <h3 className="text-xl font-bold text-[#141b33] mb-3">💬 Prefer memes over emails?</h3>
              {/* <p className="text-[#141b33]">DM us on Instagram @thefriendlyventure</p> */}
            </div>

            <div className="p-6 border-4 border-[#141b33] rounded-lg bg-[#a0e7e5]">
              <h3 className="text-xl font-bold text-[#141b33] mb-3">⏰ Office Hours</h3>
              <p className="text-[#141b33]">
                Open 9-5 (but we'll reply to your 2 AM idea dump because ✨time zones✨).
              </p>
            </div>

            <div className="p-6 border-4 border-[#141b33] rounded-lg bg-[#ffcdb2]">
              <h3 className="text-xl font-bold text-[#141b33] mb-3">🎯 Want to join the squad?</h3>
              <p className="text-[#141b33] mb-3">We're always scouting talent.</p>
              <button className="bg-[#141b33] text-white py-2 px-6 rounded-full font-bold hover:bg-[#1f2b4d] transition-colors">
                Drop your portfolio here
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects CTA Section */}
      <div className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-[#a7d8f2] p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#141b33]">Want to see what we've built?</h2>
        <p className="text-xl text-[#141b33] mb-8 max-w-2xl mx-auto">
          Check out our portfolio of projects that showcase our skills, creativity, and results.
        </p>
        <Link
          href="/projects"
          className="inline-block bg-[#141b33] text-white py-3 px-10 rounded-full text-lg font-bold hover:bg-[#1f2b4d] transition-colors"
        >
          View Our Projects →
        </Link>
      </div>

      {/* Footer with some spacing */}
      <div className="w-full py-8 bg-white"></div>
    </main>
  )
}
