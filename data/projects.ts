export interface Project {
  id: number
  title: string
  category: string
  client: string
  year: string
  description: string
  fullDescription: string
  services: string[]
  results: string[]
  testimonial?: string
  clientName?: string
  backgroundColor: string
  image: string
  tags: string[]
  projectLink: string
  role: string
  keyDeliverables: string[]
  metricsImpact: string[]
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Elysian Innovations",
    category: "Website Design & Development",
    client: "Elysian Innovations",
    year: "2024",
    description:
      "Modern, responsive website showcasing the brand's tech-forward identity with optimized performance and SEO-friendly structure.",
    fullDescription:
      "Complete website design and development project featuring modern responsive design, custom UI/UX with focus on usability and visual appeal, and optimized performance achieving 90+ Lighthouse score.",
    services: ["Website Design", "UI/UX Design", "Performance Optimization", "SEO Implementation"],
    results: [
      "40% faster load time than previous site",
      "25% increase in contact form submissions",
      "100% mobile-responsive across all devices",
      "90+ Lighthouse performance score",
    ],
    role: "Sole Designer & Developer",
    keyDeliverables: [
      "Modern, responsive website showcasing the brand's tech-forward identity",
      "Custom UI/UX design with a focus on usability and visual appeal",
      "Optimized performance (90+ Lighthouse score) and SEO-friendly structure",
    ],
    metricsImpact: [
      "✅ 40% faster load time than the previous site after optimization",
      "✅ 25% increase in contact form submissions post-launch",
      "✅ 100% mobile-responsive across all devices",
    ],
    backgroundColor: "#a7d8f2",
    image: "/images/projects/elysian.png",
    tags: ["Website Design", "UI/UX", "Performance", "SEO"],
    projectLink: "https://elysian-innovations.com/",
  },
  {
    id: 2,
    title: "Sun Studios",
    category: "Solar Configuration Web App",
    client: "Sun Studios",
    year: "2024",
    description:
      "Interactive web app using Google Solar API to visualize solar panel layouts with dynamic mapping and ROI calculations.",
    fullDescription:
      "Advanced solar configuration web application featuring custom CMS integration, interactive Google Solar API integration for visualizing solar panel layouts, and dynamic mapping tools for residential/commercial properties with comprehensive ROI calculations.",
    services: ["Web App Development", "API Integration", "CMS Integration", "Dynamic Mapping"],
    results: [
      "15% conversion rate for solar inquiries",
      "3,000+ monthly users engaging with solar planner",
      "50% faster API response time after optimizations",
    ],
    role: "Lead Developer & Designer",
    keyDeliverables: [
      "Custom CMS integration (Sanity) for blog management",
      "Interactive web app using Google Solar API to visualize solar panel layouts on user-submitted addresses",
      "Dynamic mapping tool for residential/commercial properties with ROI calculations",
    ],
    metricsImpact: [
      "✅ 15% conversion rate for solar inquiries via the app",
      "✅ 3,000+ monthly users engaging with the solar planner",
      "✅ 50% faster API response time after backend optimizations",
    ],
    backgroundColor: "#ffda55",
    image: "/images/projects/solar.png",
    tags: ["Web App", "Solar", "API Integration", "Mapping"],
    projectLink: "https://www.sunstudios.com/",
  },
  {
    id: 3,
    title: "Lahore Ambulance",
    category: "Service-Oriented Website",
    client: "Lahore Ambulance",
    year: "2024",
    description:
      "Urgent, accessible design with clear call-to-actions, multilingual support, and geo-location integration for dispatch efficiency.",
    fullDescription:
      "Critical service-oriented website design focusing on urgent accessibility, featuring clear emergency call-to-actions, comprehensive multilingual support for broader community reach, and integrated geo-location services for improved dispatch efficiency.",
    services: ["UI/UX Design", "Multilingual Implementation", "Geo-location Integration", "Accessibility Design"],
    results: [
      "60% reduction in bounce rate",
      "200+ monthly service requests via website",
      "4.8/5 user satisfaction in post-launch surveys",
    ],
    role: "UI/UX Designer",
    keyDeliverables: [
      "Urgent, accessible design with clear call-to-actions (e.g., emergency contact buttons)",
      "Multilingual support (English/Urdu) for broader reach",
      "Geo-location integration for dispatch efficiency",
    ],
    metricsImpact: [
      "✅ 60% reduction in bounce rate due to improved navigation",
      "✅ 200+ monthly service requests via the website",
      "✅ 4.8/5 user satisfaction in post-launch surveys",
    ],
    backgroundColor: "#ffcdb2",
    image: "/images/projects/lahore.png",
    tags: ["Healthcare", "Emergency Services", "Multilingual", "Accessibility"],
    projectLink: "https://www.lahoreambulance.com/",
  },
  {
    id: 4,
    title: "Alif Se Aman",
    category: "Digital Campaign Website",
    client: "USIP (United States Institute of Peace)",
    year: "2024",
    description:
      "Pakistan's first national audio-visual digital campaign advocating for peace, inclusion, and cultural dialogue with multimedia storytelling.",
    fullDescription:
      "Alif Se Aman is Pakistan's first national audio-visual digital campaign advocating for peace, inclusion, and cultural dialogue. USIP needed a website that would bridge modern digital design with deep cultural authenticity to reflect the voices of Pakistan through multimedia.",
    services: ["UI/UX Design", "Cultural Design Research", "Multimedia Integration", "Interactive Storytelling"],
    results: [
      "Successfully launched Pakistan's first national peace campaign",
      "Engaged diverse communities across Pakistan",
      "Bridged modern design with cultural authenticity",
      "Created platform for multimedia storytelling",
    ],
    role: "Lead UI/UX Designer",
    keyDeliverables: [
      "Culturally authentic design reflecting Pakistani voices and values",
      "Interactive multimedia platform for audio-visual content",
      "Engaging user experience promoting peace and inclusion",
      "Responsive design optimized for diverse user demographics",
    ],
    metricsImpact: [
      "✅ Successfully launched Pakistan's first national digital peace campaign",
      "✅ Created culturally resonant design bridging tradition and modernity",
      "✅ Delivered engaging platform for multimedia storytelling",
      "✅ Established foundation for ongoing cultural dialogue initiatives",
    ],
    backgroundColor: "#c1e1c1",
    image: "/images/projects/alif.png",
    tags: ["Cultural Design", "Peace Campaign", "Multimedia", "Social Impact"],
    projectLink: "#",
  },
  {
    id: 5,
    title: "Trillium",
    category: "Real Estate Website",
    client: "Elprime Properties",
    year: "2024",
    description:
      "Premium real estate project website highlighting elegance and sophistication to encourage user inquiries and showcase luxury properties.",
    fullDescription:
      "Trillium is a premium real estate project by Elprime Properties. The goal was to design a modern, responsive website that highlights the project's elegance and encourages user inquiries. The design process encompassed the complete UX and UI process from research to final interface design.",
    services: ["UI/UX Design", "Real Estate Marketing", "Responsive Design", "User Research"],
    results: [
      "Modern, elegant design reflecting premium positioning",
      "Optimized user journey for property inquiries",
      "Responsive design across all devices",
      "Enhanced brand perception and market positioning",
    ],
    role: "UI/UX Designer",
    keyDeliverables: [
      "Modern, responsive website highlighting project elegance",
      "User-centered design encouraging property inquiries",
      "Complete UX research and UI design process",
      "Premium brand experience reflecting luxury positioning",
    ],
    metricsImpact: [
      "✅ Delivered modern, elegant design reflecting premium real estate positioning",
      "✅ Created optimized user journey for property inquiries",
      "✅ Achieved responsive design excellence across all devices",
      "✅ Enhanced brand perception in competitive real estate market",
    ],
    backgroundColor: "#ffc8dd",
    image: "/images/projects/trillium.png",
    tags: ["Real Estate", "Premium Design", "Luxury", "Property Marketing"],
    projectLink: "#",
  },
  {
    id: 6,
    title: "A On-Fi",
    category: "Website Design & Development",
    client: "A On-Fi",
    year: "2024",
    description:
      "Modern, intuitive interface design focused on collaboration, wireframing, and prototyping with responsive implementation.",
    fullDescription:
      "The design process focused on collaboration, wireframing, and prototyping, culminating in a modern, intuitive interface. Implementation involved translating concepts into a functional, responsive website with integrated technologies and rigorous testing.",
    services: ["UI/UX Design", "Wireframing", "Prototyping", "Responsive Development"],
    results: [
      "Modern, intuitive user interface",
      "Successful collaboration-focused design process",
      "Functional, responsive website implementation",
      "Integrated technologies with rigorous testing",
    ],
    role: "UI/UX Designer & Developer",
    keyDeliverables: [
      "Collaborative design process with comprehensive wireframing",
      "Modern, intuitive interface design and prototyping",
      "Responsive website implementation with integrated technologies",
      "Rigorous testing and quality assurance processes",
    ],
    metricsImpact: [
      "✅ Delivered modern, intuitive interface through collaborative design",
      "✅ Successfully translated concepts into functional, responsive website",
      "✅ Implemented integrated technologies with comprehensive testing",
      "✅ Achieved seamless user experience across all platforms",
    ],
    backgroundColor: "#ffd166",
    image: "/images/projects/onfi.png",
    tags: ["Collaboration", "Wireframing", "Prototyping", "Modern Design"],
    projectLink: "#",
  },
  {
    id: 7,
    title: "AKRU",
    category: "Website Redesign",
    client: "AKRU",
    year: "2024",
    description:
      "Comprehensive website redesign for real estate tokenization platform, enhancing user experience and modernizing design for improved engagement.",
    fullDescription:
      "AKRU sought to elevate its online presence through a website redesign. As the lead designer, I embarked on a comprehensive overhaul of the existing website to align with AKRU's mission of tokenization the real estate assets. The primary objectives included enhancing user experience, modernizing the design, and improving engagement metrics.",
    services: ["Website Redesign", "UX Enhancement", "Modern Design", "Engagement Optimization"],
    results: [
      "Comprehensive website overhaul completed",
      "Enhanced user experience and navigation",
      "Modernized design aligned with tokenization mission",
      "Improved engagement metrics and user interaction",
    ],
    role: "Lead Designer",
    keyDeliverables: [
      "Comprehensive website redesign aligned with tokenization mission",
      "Enhanced user experience and modernized design approach",
      "Improved engagement metrics and user interaction patterns",
      "Elevated online presence for real estate tokenization platform",
    ],
    metricsImpact: [
      "✅ Completed comprehensive overhaul of existing website",
      "✅ Enhanced user experience with modernized design approach",
      "✅ Improved engagement metrics and user interaction",
      "✅ Successfully aligned design with real estate tokenization mission",
    ],
    backgroundColor: "#b8860b",
    image: "/images/projects/akru.png",
    tags: ["Redesign", "Real Estate", "Tokenization", "UX Enhancement"],
    projectLink: "#",
  },
]
