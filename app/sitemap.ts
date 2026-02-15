import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://matlosen.no',
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://matlosen.no/personvern',
      lastModified: new Date('2024-01-15'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://matlosen.no/vilkar',
      lastModified: new Date('2024-01-15'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
