import type { Metadata } from 'next'
import LocationsClient from '@/components/locations/LocationsClient'

export const metadata: Metadata = {
  title: 'Locations — Lumora Coffee',
  description:
    'Temukan 10 cabang Lumora Coffee di Jakarta, Tangerang, Depok, Bogor, Bekasi, Bandung, Semarang, dan Surabaya lengkap dengan radar jarak terdekat.',
}

export default function LocationsPage() {
  return <LocationsClient />
}
