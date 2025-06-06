import { Metadata } from "next"

const siteConfig = {
  name: "The Friendly Vertical",
  description: "Digital Magic, Minus the BS. Your all-in-one creative tech squad mixing killer designs, code, and marketing strategy.",
  url: "https://thefriendlyvertical.com", // Replace with your actual domain
  ogImage: "/images/2.png", // You'll need to add this image
  links: {
    twitter: "https://twitter.com/thefriendlyvertical",
    instagram: "https://instagram.com/thefriendlyvertical",
  },
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "web development",
    "digital marketing",
    "creative agency",
    "design",
    "branding",
    "tech solutions",
    "digital transformation",
    "UI/UX design",
    "marketing strategy",
    "web design",
  ],
  authors: [
    {
      name: "The Friendly Vertical",
      url: siteConfig.url,
    },
  ],
  creator: "The Friendly Vertical",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@thefriendlyvertical",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "xyZxxuEhpLEwvVHNmQ09A-Y9rGdFNQp_aNsDRpQqc-8", // Add your Google Search Console verification code
  },
} 