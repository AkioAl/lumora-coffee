'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { Location } from '@/types'

interface LocationCardProps {
  location: Location
}

const MAX_FACILITIES = 3

export default function LocationCard({ location }: LocationCardProps) {
  const [imgError, setImgError] = useState(false)

  const visibleFacilities = location.facilities.slice(0, MAX_FACILITIES)
  const extraCount = location.facilities.length - MAX_FACILITIES

  return (
    <Link
      href={`/locations/${location.id}`}
      className="
        group flex flex-col
        bg-brand-surface border border-brand-border
        hover:border-brand-tosca
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* ── Foto area ──────────────────────────────────── */}
      <div className="relative aspect-video overflow-hidden bg-brand-border">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-brand-tosca opacity-40" />
          </div>
        ) : (
          <Image
            src={location.image}
            alt={location.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient overlay bawah */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-surface to-transparent pointer-events-none z-10" />

        {/* Badge area (HQ / label) */}
        {location.area && (
          <span className="
            absolute top-3 left-3 z-20
            bg-brand-tosca text-brand-bg
            text-[10px] font-bold tracking-widest
            px-2 py-1
          ">
            {location.area}
          </span>
        )}
      </div>

      {/* ── Konten bawah ───────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Nama */}
        <p className="text-brand-white font-bold text-base tracking-wide">
          {location.name}
        </p>

        {/* Kota */}
        <p className="text-brand-tosca text-xs font-bold tracking-widest mt-1 uppercase">
          {location.city}
        </p>

        {/* Jam operasional */}
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-3 h-3 text-brand-muted shrink-0" />
          <span className="text-brand-muted text-xs">
            {location.operationalHours}
          </span>
        </div>

        {/* Fasilitas tags */}
        {visibleFacilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {visibleFacilities.map((f) => (
              <span
                key={f}
                className="bg-brand-border text-brand-muted text-[10px] px-2 py-1"
              >
                {f}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="bg-brand-border text-brand-muted text-[10px] px-2 py-1">
                +{extraCount} lagi
              </span>
            )}
          </div>
        )}

        {/* CTA link */}
        <span className="
          inline-flex items-center gap-1 mt-4
          text-brand-tosca text-xs font-bold tracking-widest
          group-hover:underline underline-offset-2
          transition-all duration-200
          uppercase
        ">
          LIHAT LOKASI
          <ArrowRight className="w-3 h-3" />
        </span>

      </div>
    </Link>
  )
}
