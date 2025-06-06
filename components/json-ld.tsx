import { Organization, WithContext } from 'schema-dts'

export function OrganizationJsonLd() {
  const organization: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Friendly Vertical',
    url: 'https://thefriendlyvertical.com',
    logo: 'https://thefriendlyvertical.com/logo.png',
    description: 'Digital Magic, Minus the BS. Your all-in-one creative tech squad mixing killer designs, code, and marketing strategy.',
    sameAs: [
      'https://twitter.com/thefriendlyvertical',
      'https://instagram.com/thefriendlyvertical',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'customer service',
      email: 'sarimali2000@gmail.com',
      availableLanguage: ['English'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  )
}

export function ProjectsJsonLd() {
  const projects = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          name: 'Swipe Right Fashion',
          description: 'Built a Shopify store + Instagram strategy that boosted sales by 300%.',
          url: 'https://thefriendlyvertical.com/projects#swipe-right-fashion',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'CreativeWork',
          name: 'NFTs for Dog Lovers',
          description: 'Designed + developed a Web3 platform for adoptable pup NFTs.',
          url: 'https://thefriendlyvertical.com/projects#nfts-for-dog-lovers',
        },
      },
      // Add more projects as needed
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projects) }}
    />
  )
} 