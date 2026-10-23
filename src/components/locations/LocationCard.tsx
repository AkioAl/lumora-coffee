'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { Location } from '@/types'
import { BranchLiveStatus, formatDistanceAndEta } from '@/lib/format'

interface LocationCardProps {
  location: Location
  liveStatus?: BranchLiveStatus | null
  distanceKm?: number
}

const MAX_FACILITIES = 3

export default function LocationCard({
  location,
  liveStatus,
  distanceKm,
}: LocationCardProps) {
  const [imgError, setImgError] = useState(false)

  const visibleFacilities = location.facilities.slice(0, MAX_FACILITIES)
  const extraCount = location.facilities.length - MAX_FACILITIES
  const distanceInfo =
    typeof distanceKm === 'number' ? formatDistanceAndEta(distanceKm) : null

  return (
    <Link
      href={`/locations/${location.id}`}
      className="
        group flex flex-col h-full
        bg-brand-surface border border-brand-border
        hover:border-brand-tosca
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="relative aspect-video overflow-hidden bg-brand-border">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-brand-tosca opacity-40" />
          </div>
        ) : (
          <Image
            src={location.image}
            alt={`Lumora Coffee ${location.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-surface to-transparent pointer-events-none z-10" />

        {liveStatus && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-brand-bg/90 border border-brand-border px-2.5 py-1">
            <span
              className={`w-2 h-2 rounded-full ${
                liveStatus.state === 'OPEN'
                  ? 'bg-brand-tosca'
                  : liveStatus.state === 'CLOSING_SOON'
                  ? 'bg-amber-400'
                  : 'bg-brand-muted'
              }`}
            />
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-white uppercase">
              {liveStatus.label}
            </span>
          </div>
        )}

        {distanceInfo ? (
          <span className="absolute top-3 right-3 z-20 bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase">
            {distanceInfo.distanceText} · {distanceInfo.etaText}
          </span>
        ) : (
          location.area === 'HQ' && (
            <span className="absolute top-3 right-3 z-20 bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase">
              HQ
            </span>
          )
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-brand-white font-bold text-base tracking-wide group-hover:text-brand-tosca transition-colors">
            {location.name}
          </p>

          <p className="text-brand-tosca text-xs font-mono font-bold tracking-widest mt-1 uppercase">
            {location.city}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5">
            <Clock className="w-3.5 h-3.5 text-brand-muted shrink-0" />
            <span className="text-brand-muted text-xs">
              {location.operationalHours}
              {liveStatus ? ` · ${liveStatus.detail}` : ''}
            </span>
          </div>

          {visibleFacilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {visibleFacilities.map((f) => (
                <span
                  key={f}
                  className="bg-brand-border text-brand-muted text-[10px] font-mono px-2 py-1"
                >
                  {f}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="bg-brand-border text-brand-muted text-[10px] font-mono px-2 py-1">
                  +{extraCount} lagi
                </span>
              )}
            </div>
          )}
        </div>

        <span className="
          inline-flex items-center min-h-[44px] gap-1.5 mt-4 pt-3 border-t border-brand-border/60
          text-brand-tosca text-xs font-bold tracking-widest
          group-hover:underline underline-offset-4
          transition-all duration-200
          uppercase
        ">
          LIHAT CABANG
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}
