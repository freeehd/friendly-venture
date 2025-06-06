import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thefriendlyvertical.com'
  
  // Define your static routes
  const routes = [
    '',
    '/projects',
    '/#about',
    '/#services',
    '/#team',
    '/#contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 