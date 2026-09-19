import { MetadataRoute } from 'next';
import { getMotos } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisonmoto.dz';
  const motos = await getMotos();

  const motoUrls = motos.map((m) => ({
    url: `${baseUrl}/motos/${m.id}`,
    lastModified: new Date(m.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/motos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...motoUrls,
  ];
}
