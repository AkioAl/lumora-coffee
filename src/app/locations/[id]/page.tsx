import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locations } from '@/data/locations'
import LocationDetail from '@/components/locations/LocationDetail'

interface LocationPageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return locations.map((loc) => ({
    id: loc.id,
  }))
}

export function generateMetadata({ params }: LocationPageProps): Metadata {
  const location = locations.find((l) => l.id === params.id)
  if (!location) {
    return {
      title: 'Cabang Tidak Ditemukan — Lumora Coffee',
    }
  }
  return {
    title: `Lumora Coffee ${location.name} (${location.city}) — Jam Buka & Lokasi`,
    description: `Kunjungi Lumora Coffee ${location.name} di ${location.address}. Jam operasional ${location.operationalHours} dengan fasilitas ${location.facilities.join(', ')}.`,
  }
}

export default function LocationDetailPage({ params }: LocationPageProps) {
  const location = locations.find((l) => l.id === params.id)

  if (!location) {
    notFound()
  }

  const otherLocations = locations
    .filter((l) => l.id !== location.id)
    .slice(0, 3)

  return <LocationDetail location={location} otherLocations={otherLocations} />
}
