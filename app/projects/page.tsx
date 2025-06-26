"use client"
import Image from "next/image"
import Link from "next/link"
import ElasticNav from "@/components/elastic-nav"
import { ProjectsJsonLd } from "@/components/json-ld"
import { useState } from "react"
import { projects } from "@/data/projects"

export default function ProjectsPage() {
  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState<string>("All Projects")

  // Get unique categories for filtering
  const categories = [...new Set(projects.map((project) => project.category))]

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "All Projects" ? projects : projects.filter((project) => project.category === selectedCategory)

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
              <span className="font-bold">7+ Projects Delivered</span>
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-[#141b33]">{project.title}</h3>
                  {project.projectLink !== "#" && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#141b33] hover:text-blue-600 transition-colors"
                      aria-label={`Visit ${project.title} website`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-[#141b33] mb-2 font-medium text-sm">Role: {project.role}</p>
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

                {/* Key Deliverables */}
                <div className="bg-white p-4 rounded border-2 border-[#141b33] mb-4">
                  <h4 className="font-bold text-[#141b33] mb-2">Key Deliverables:</h4>
                  <ul className="text-sm text-[#141b33] space-y-1">
                    {project.keyDeliverables.slice(0, 2).map((deliverable, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics & Impact */}
                <div className="bg-[#141b33] text-white p-4 rounded mb-4">
                  <h4 className="font-bold mb-2">Metrics & Impact:</h4>
                  <ul className="text-sm space-y-1">
                    {project.metricsImpact.slice(0, 2).map((metric, idx) => (
                      <li key={idx} className="flex items-start">
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View Details Button */}
                {project.projectLink !== "#" ? (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#141b33] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#1f2b4d] transition-colors block text-center"
                  >
                    Visit Live Project →
                  </a>
                ) : (
                  <div className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-bold text-center cursor-not-allowed">
                    Project Details Available on Request
                  </div>
                )}
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
              description:
                "We dive into your business goals, market position, and target audience to create a data-driven strategy that works.",
              color: "#ffcdb2",
            },
            {
              step: "02",
              title: "Plan & Strategize",
              description:
                "Whether it's a website, marketing campaign, or SEO strategy, we craft a detailed roadmap for success.",
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
              description:
                "We measure results, identify opportunities, and help you scale your success across all channels.",
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
