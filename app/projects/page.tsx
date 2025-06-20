"use client"
import Image from "next/image"
import Link from "next/link"
import ElasticNav from "@/components/elastic-nav"
import { metadata } from "./metadata"
import { ProjectsJsonLd } from "@/components/json-ld"
import { useState } from "react"


export default function ProjectsPage() {
  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState<string>("All Projects")

  // Project data with more detailed information
  const projects = [
    {
      id: 1,
      title: "Swipe Right Fashion",
      category: "Comic Designing",
      client: "Fashion Startup",
      year: "2024",
      description: "Built a Shopify store + Instagram strategy that boosted sales by 300%.",
      fullDescription:
        "A complete digital transformation for a fashion startup, including custom Shopify development, brand identity design, and a comprehensive social media strategy that resulted in explosive growth.",
      services: ["Shopify Development", "Brand Design", "Social Media Strategy", "Content Creation"],
      results: ["150% increase in sales", "2.5K+ Instagram followers", "2.1x ROAS on ads"],
      testimonial: "These guys get it. Also, their Slack GIF game? 10/10.",
      clientName: "Sarah, Founder",
      backgroundColor: "#ffcdb2",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&crop=center",
      tags: ["E-commerce", "Shopify", "Social Media", "Fashion"],
    },
    {
      id: 2,
      title: "NFTs for Dog Lovers",
      category: "Web3 & Blockchain",
      client: "Pet Tech Startup",
      year: "2024",
      description: "Designed + developed a Web3 platform for adoptable pup NFTs (yes, it's as cute as it sounds).",
      fullDescription:
        "Revolutionary Web3 platform connecting NFT technology with pet adoption, featuring smart contracts, custom marketplace, and integration with local animal shelters.",
      services: ["Smart Contract Development", "Web3 Frontend", "UI/UX Design", "Blockchain Integration"],
      results: ["500+ NFTs minted", "25+ pets adopted", "15+ shelters partnered"],
      testimonial: "Went from idea to launch in 4 weeks. Sorcery.",
      clientName: "Mike, CEO",
      backgroundColor: "#c1e1c1",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop&crop=center",
      tags: ["Web3", "NFT", "Blockchain", "Social Impact"],
    },
    {
      id: 3,
      title: "Fitness App Revolution",
      category: "Mobile App Development",
      client: "Fitness Coach",
      year: "2024",
      description: "Created a gamified fitness app with social features that got 10K downloads in the first month.",
      fullDescription:
        "Gamified fitness application with social challenges, progress tracking, and AI-powered workout recommendations that revolutionized how users approach fitness.",
      services: ["Mobile App Development", "UI/UX Design", "Backend Development", "Gamification"],
      results: ["1.2K+ downloads in month 1", "65% user retention", "4.6 App Store rating"],
      testimonial: "My users are actually excited about working out now. Magic!",
      clientName: "Lisa, Fitness Coach",
      backgroundColor: "#ffc8dd",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center",
      tags: ["Mobile App", "Fitness", "Gamification", "Social"],
    },
    {
      id: 4,
      title: "Corporate Rebrand Magic",
      category: "Brand & Web Design",
      client: "Tech Corporation",
      year: "2023",
      description: "Complete brand overhaul + website redesign that increased lead generation by 250%.",
      fullDescription:
        "Comprehensive rebranding project including logo design, brand guidelines, website redesign, and marketing collateral that transformed a corporate image.",
      services: ["Brand Strategy", "Logo Design", "Website Development", "Marketing Materials"],
      results: ["85% increase in leads", "30% boost in brand recognition", "40% more qualified prospects"],
      testimonial: "We went from boring to brilliant. Our competitors are shook.",
      clientName: "David, Marketing Director",
      backgroundColor: "#ffd166",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center",
      tags: ["Branding", "Web Design", "Corporate", "Lead Generation"],
    },
    {
      id: 5,
      title: "SaaS Dashboard UX Revamp",
      category: "UI/UX Design",
      client: "SaaS Platform",
      year: "2024",
      description: "Complete user experience overhaul that reduced churn by 20% and improved user satisfaction.",
      fullDescription:
        "Comprehensive UX research and redesign of a complex SaaS dashboard, focusing on user flow optimization and intuitive interface design.",
      services: ["UX Research", "UI Design", "Prototyping", "User Testing"],
      results: ["15% reduction in churn", "25% faster task completion", "4.5/5 user satisfaction"],
      testimonial: "Our users finally understand our product. Game changer.",
      clientName: "Alex, Product Manager",
      backgroundColor: "#c8b6e2",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
      tags: ["SaaS", "UX Design", "Dashboard", "User Research"],
    },
    {
      id: 6,
      title: "Digital Asset Trading Platform",
      category: "Fintech Development",
      client: "Fintech Startup",
      year: "2023",
      description: "Built a secure crypto trading platform with real-time data and advanced charting tools.",
      fullDescription:
        "High-performance cryptocurrency trading platform with real-time market data, advanced charting, portfolio management, and institutional-grade security.",
      services: ["Full-Stack Development", "Security Implementation", "API Integration", "Real-time Data"],
      results: ["10K+ active traders", "99.5% uptime", "Bank-level security"],
      testimonial: "The platform handles our trading volume like a dream.",
      clientName: "Jordan, CTO",
      backgroundColor: "#a0c4ff",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&crop=center",
      tags: ["Fintech", "Crypto", "Trading", "Security"],
    },
    {
      id: 7,
      title: "AI-Powered Content Platform",
      category: "Digital Marketing",
      client: "Content Agency",
      year: "2024",
      description: "Developed an AI content generation platform that streamlined content creation workflows.",
      fullDescription:
        "AI-powered content creation platform with natural language processing, automated editing, and workflow management for content teams.",
      services: ["AI Development", "Machine Learning", "API Development", "Workflow Automation"],
      results: ["40% faster content creation", "85% client satisfaction", "50+ active users"],
      testimonial: "This AI actually understands our brand voice. Incredible.",
      clientName: "Maria, Creative Director",
      backgroundColor: "#ffb3ba",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
      tags: ["AI", "Content", "Automation", "Machine Learning"],
    },
    {
      id: 8,
      title: "Sustainable Fashion Marketplace",
      category: "E-commerce Platform",
      client: "Sustainability Startup",
      year: "2023",
      description: "Created a marketplace connecting sustainable fashion brands with conscious consumers.",
      fullDescription:
        "Comprehensive marketplace platform featuring vendor management, sustainability scoring, carbon footprint tracking, and community features.",
      services: ["Marketplace Development", "Vendor Portal", "Sustainability Metrics", "Community Features"],
      results: ["25+ brands onboarded", "3K+ registered users", "Carbon neutral shipping"],
      testimonial: "Finally, a platform that matches our values with great UX.",
      clientName: "Emma, Founder",
      backgroundColor: "#bae1ff",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center",
      tags: ["Marketplace", "Sustainability", "Fashion", "Community"],
    },
  ]

  // Get unique categories for filtering
  const categories = [...new Set(projects.map((project) => project.category))]

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === "All Projects" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-24">
      <ProjectsJsonLd />
      <ElasticNav />

      {/* Hero Section */}
      <section className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-t-4 border-[#141b33] bg-[#a7d8f2] py-16 px-4 md:px-8">
        <div className="text-center">
          <div className="bg-[#141b33] text-white py-3 px-8 inline-block transform mb-8">
            <h1 className="text-3xl md:text-5xl font-bold uppercase">Our Portfolio</h1>
          </div>
          <p className="text-xl md:text-2xl text-[#141b33] max-w-4xl mx-auto mb-8">
            From wild ideas to world-class execution. Here's the proof that we don't just talk the talk—we build the
            walk.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[#141b33] mb-8">
            <div className="bg-white border-2 border-[#141b33] px-4 py-2 rounded-full">
              <span className="font-bold">30+ Projects Delivered</span>
            </div>
            <div className="bg-white border-2 border-[#141b33] px-4 py-2 rounded-full">
              <span className="font-bold">100% Client Satisfaction</span>
            </div>
            <div className="bg-white border-2 border-[#141b33] px-4 py-2 rounded-full">
              <span className="font-bold">∞ Coffee Consumed</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block bg-white text-[#141b33] border-2 border-[#141b33] px-6 py-2 rounded-full font-bold hover:bg-[#141b33] hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white py-8 px-4 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#141b33] mb-4">Filter by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setSelectedCategory("All Projects")}
              className={`px-6 py-2 rounded-full font-bold transition-colors ${
                selectedCategory === "All Projects"
                  ? "bg-[#141b33] text-white"
                  : "bg-white text-[#141b33] border-2 border-[#141b33] hover:bg-[#141b33] hover:text-white"
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-bold transition-colors ${
                  selectedCategory === category
                    ? "bg-[#141b33] text-white"
                    : "bg-white text-[#141b33] border-2 border-[#141b33] hover:bg-[#141b33] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white py-8 px-4 md:px-8">
        <h2 className="sr-only">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className="border-4 border-[#141b33] rounded-lg overflow-hidden hover:transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: project.backgroundColor }}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={project.image || "/placeholder.svg"} 
                  alt={`${project.title} - ${project.category} project showcasing ${project.description}`}
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#141b33] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {project.year}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-[#141b33] px-3 py-1 rounded-full text-sm font-bold border-2 border-[#141b33]">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#141b33] mb-2">{project.title}</h3>
                <p className="text-[#141b33] mb-4 font-medium">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-[#141b33] px-2 py-1 rounded text-xs font-bold border border-[#141b33]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Results Preview */}
                <div className="bg-white p-4 rounded border-2 border-[#141b33] mb-4">
                  <h4 className="font-bold text-[#141b33] mb-2">Key Results:</h4>
                  <ul className="text-sm text-[#141b33] space-y-1">
                    {project.results.slice(0, 2).map((result, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Testimonial */}
                <div className="bg-[#141b33] text-white p-4 rounded mb-4">
                  <p className="italic mb-2">"{project.testimonial}"</p>
                  <p className="text-sm font-bold">— {project.clientName}</p>
                </div>

                {/* View Details Button */}
                <button className="w-full bg-[#141b33] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#1f2b4d] transition-colors">
                  View Full Case Study 
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-[#ffda55] py-16 px-4 md:px-8">
        <div className="text-center">
          <div className="bg-[#141b33] text-white py-3 px-8 inline-block transform mb-8">
            <h2 className="text-2xl md:text-4xl font-bold uppercase">Ready to Join This List?</h2>
          </div>
          <p className="text-xl text-[#141b33] max-w-3xl mx-auto mb-8">
            Your project could be our next success story. Let's build something that makes your competitors wonder "how
            did they do that?"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-[#141b33] text-white py-4 px-8 rounded-full text-lg font-bold hover:bg-[#1f2b4d] transition-colors inline-block"
            >
              Start Your Project 
            </Link>
            <Link
              href="/#team"
              className="bg-white text-[#141b33] border-4 border-[#141b33] py-4 px-8 rounded-full text-lg font-bold hover:bg-[#141b33] hover:text-white transition-colors inline-block"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full max-w-[1500px] mx-auto border-x-4 border-b-4 border-[#141b33] bg-white py-16 px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="bg-[#141b33] text-white py-3 px-8 inline-block transform mb-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase">Our Approach (Works for Everything)</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Understand & Analyze",
              description: "We dive into your business goals, market position, and target audience to create a data-driven strategy that works.",
              color: "#ffcdb2",
            },
            {
              step: "02",
              title: "Plan & Strategize",
              description: "Whether it's a website, marketing campaign, or SEO strategy, we craft a detailed roadmap for success.",
              color: "#c1e1c1",
            },
            {
              step: "03",
              title: "Execute & Optimize",
              description: "Our team brings the plan to life, continuously monitoring and refining for maximum impact.",
              color: "#ffc8dd",
            },
            {
              step: "04",
              title: "Scale & Grow",
              description: "We measure results, identify opportunities, and help you scale your success across all channels.",
              color: "#ffd166",
            },
          ].map((process, index) => (
            <article
              key={index}
              className="border-4 border-[#141b33] p-6 rounded-lg hover:transform hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: process.color }}
            >
              <div className="text-4xl font-black text-[#141b33] mb-4">{process.step}</div>
              <h3 className="text-xl font-bold text-[#141b33] mb-3">{process.title}</h3>
              <p className="text-[#141b33]">{process.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer spacing */}
      <div className="w-full py-8 bg-white"></div>
    </main>
  )
}
