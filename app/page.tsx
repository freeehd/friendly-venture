"use client"
import CardCarousel from "@/components/card-carousel"
import InfiniteLetterCarousel from "@/components/infinite-letter-carousel"
import ElasticNav from "@/components/elastic-nav"
import AboutUsAnimation from "@/components/about-us-animation"
import ParallaxColleagues from "@/components/parallax-colleagues"
import Image from "next/image"
import Link from "next/link"
import SparkCursor from "@/components/spark-cursor"
import MeetTheTeam from "@/components/meet-the-team"
import ScrollProgress from "@/components/scroll-progress"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

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
  ]

  const { ref: valuesRef, isIntersecting: valuesVisible } = useIntersectionObserver()

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-44">
      <ScrollProgress />
      {/* Elastic Navigation Bar */}
      <ElasticNav />

      {/* Home section */}
      <div id="home" className="w-full">
        {/* Blue container with border */}
        <div
          className="relative w-full max-w-[1500px] mx-auto bg-[#a7d8f2] border-4 border-[#141b33] shadow-2xl overflow-visible py-16 px-4 md:px-8"
          style={{ minHeight: "950px" }}
        >
          {/* Title banner */}
          <div className="absolute left-0 right-0 z-10" style={{ top: "-40px" }}>
            <div className="relative mx-auto" style={{ maxWidth: "780px" }}>
              <div
                className="bg-[#141b33] text-white py-6 px-8 w-full"
                style={{
                  height: "110px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1
                  className="concept-capers-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap"
                  style={{
                    lineHeight: "0.9",
                    letterSpacing: "-0.01em",
                    fontSize: "clamp(1.5rem, 4vw, 4rem)",
                  }}
                >
                  THE FRIENDLY VENTURE
                </h1>
              </div>
            </div>
          </div>

          {/* Hero description */}
          <div className="relative z-30 mt-[650px] text-center px-4 mb-12">
            <div className="max-w-3xl mx-auto text-[#141b33]">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">🚀 Digital Magic, Minus the BS.</h2>
              <p className="text-xl font-medium mb-8">
                We're your all-in-one creative tech squad—mixing killer designs, code, and marketing strategy so you
                don't have to juggle 10 freelancers.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="#contact"
                  className="bg-[#141b33] text-white py-3 px-10 rounded-full text-lg font-bold hover:bg-[#1f2b4d] transition-colors"
                >
                  Let's make cool stuff →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card carousel positioned absolutely to overlay the container */}
        <div className="absolute top-[500px] left-0 w-full z-20">
          <CardCarousel autoScrollInterval={5000}>{cards}</CardCarousel>
        </div>
      </div>

      {/* Letter tiles carousel */}
      <div className="w-full max-w-[1500px] flex justify-center">
        <InfiniteLetterCarousel />
      </div>

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
              <div className="bg-[#141b33] text-white py-2 px-4 sm:px-6 inline-block transform -rotate-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Our Vibe? Win-Win-Win.</h2>
              </div>
              <div className="space-y-6 sm:space-y-8 text-[#141b33]">
                <p className="text-base sm:text-lg lg:text-xl font-medium">
                  We hacked the system: happy clients + happy creatives = work that slaps.
                </p>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ Talent-First</h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      We cherry-pick the dopest designers, devs, and marketers—no mediocre "yes men" here.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ No Exploitation, Just Vibes</h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      Our team gets paid fairly, works flexibly, and actually likes Mondays.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">✨ Zero Fluff</h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      We skip the jargon and deliver real results (with memes sprinkled in).
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-[#ffda55] rounded-lg border-2 border-[#141b33]">
                  <p className="text-sm sm:text-base md:text-lg font-medium italic">
                    "Think of us as your business's backstage crew—we make you look good while having a blast doing it."
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
              <SparkCursor
                containerId="animation-container"
                size={80}
                textColor="#141b33"
                backgroundColor="white"
                iconColor="#ffb17a"
                text="SPARK AN IDEA"
                fontSize={19}
                iconSize={24}
                rotationSpeed={120}
                followDelay={0.3}
                textPadding={8}
              />
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
              <span className="text-7xl font-black text-[#141b33]">50</span>
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
              <span className="text-7xl font-black text-[#141b33]">100</span>
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
        <div className="bg-[#141b33] text-white py-2 px-6 inline-block transform -rotate-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Hit Us Up (We Don't Bite… Hard)</h2>
        </div>

        <p className="text-xl text-[#141b33] mb-8">
          Whether you're ready to collab or just wanna nerd out over 3D modeling, slide into our DMs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-[#141b33] mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Batman works, we don't judge"
                className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-[#141b33] mb-2">Email</label>
              <input
                type="email"
                placeholder="not_a_scam@trustmebro.com"
                className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-[#141b33] mb-2">What's the vibe?</label>
              <select className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg">
                <option>I need a website</option>
                <option>Marketing SOS</option>
                <option>Just wanna say hi</option>
                <option>Let's build something epic</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold text-[#141b33] mb-2">Tell us more</label>
              <textarea
                rows={4}
                placeholder="Spill the tea about your project..."
                className="w-full p-4 border-4 border-[#141b33] rounded-lg text-lg"
              ></textarea>
            </div>

            <button className="w-full bg-[#141b33] text-white py-4 px-8 rounded-lg text-lg font-bold hover:bg-[#1f2b4d] transition-colors">
              Send it! 🚀
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 border-4 border-[#141b33] rounded-lg bg-[#ffda55]">
              <h3 className="text-xl font-bold text-[#141b33] mb-3">💬 Prefer memes over emails?</h3>
              <p className="text-[#141b33]">DM us on Instagram @thefriendlyventure</p>
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
