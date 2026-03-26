import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fiestaco',
    short_name: 'Fiestaco',
    description: 'Authentic Mexican Match Night Taco Kits',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#E6399B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/x-icon',
      },
    ],
  }
}
