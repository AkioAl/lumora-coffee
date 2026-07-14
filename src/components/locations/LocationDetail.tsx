import { Location } from '@/types'

interface LocationDetailProps {
  location: Location
}

export default function LocationDetail({ location }: LocationDetailProps) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <p className="text-brand-muted font-mono text-sm">LocationDetail — Sprint 4</p>
      <h1 className="text-brand-white text-2xl font-bold">{location.name}</h1>
    </div>
  )
}
