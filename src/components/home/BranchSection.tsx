'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Navigation } from 'lucide-react'
import { useEffect, useState } from 'react'
import { locations } from '@/data/locations'
import { Location } from '@/types'
import {
  BranchLiveStatus,
  calculateHaversineKm,
  formatDistanceAndEta,
  getBranchLiveStatus,
} from '@/lib/format'

const defaultShowcaseIds = ['tomang', 'vida-bekasi', 'malabar']

function BranchPhoto({
  location,
  distanceKm,
  liveStatus,
}: {
  location: Location
  distanceKm?: number
  liveStatus: BranchLiveStatus | null
}) {
  const [error, setError] = useState(false)
  const distanceInfo =
    typeof distanceKm === 'number' ? formatDistanceAndEta(distanceKm) : null

  return (
    <Link
      href={`/locations/${location.id}`}
      className="group relative block overflow-hidden border border-brand-border hover:border-brand-tosca transition-colors duration-300"
      style={{ height: '340px' }}
    >
      {!error ? (
        <Image
          src={location.image}
          alt={`Lumora Coffee ${location.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-brand-surface flex items-center justify-center">
          <MapPin className="w-6 h-6 text-brand-tosca opacity-50" />
        </div>
      )}

      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.35) 55%, rgba(5,5,5,0.15) 100%)',
        }}
      />

      {liveStatus && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-brand-bg/90 border border-brand-border px-2.5 py-1">
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

      {distanceInfo && (
        <div className="absolute top-4 right-4 z-10 bg-brand-tosca text-brand-bg px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
          {distanceInfo.distanceText} · {distanceInfo.etaText}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-brand-white font-bold text-xl tracking-tight uppercase group-hover:text-brand-tosca transition-colors">
            {location.name}
          </p>
          <p className="text-brand-tosca text-xs font-mono tracking-widest uppercase mt-1">
            {location.city} {location.area === 'HQ' ? '— HQ' : ''}
          </p>
          <p className="text-brand-muted text-xs mt-1">{location.operationalHours}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-brand-white group-hover:text-brand-tosca text-xs font-bold tracking-widest uppercase shrink-0">
          DETAIL
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}

export default function BranchSection() {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleDetectNearest = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoStatus('active')
      },
      () => {
        setGeoStatus('error')
      },
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  const displayedBranches = userCoords
    ? [...locations]
        .map((loc) => ({
          location: loc,
          distanceKm: calculateHaversineKm(
            userCoords.lat,
            userCoords.lng,
            loc.lat,
            loc.lng
          ),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 3)
    : defaultShowcaseIds
        .map((id) => locations.find((l) => l.id === id))
        .filter((l): l is Location => Boolean(l))
        .map((location) => ({ location, distanceKm: undefined }))

  return (
    <section className="bg-brand-bg py-16 sm:py-20">
      <div className="px-6 sm:px-8 lg:px-16 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-brand-white font-bold tracking-tight leading-none uppercase"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            <span className="text-brand-tosca">10</span> CABANG.<br />
            SATU RUMAH.
          </h2>
          <p className="text-brand-muted text-sm mt-2 max-w-md">
            Status operasional waktu nyata (WIB) dan radar jarak langsung dari posisimu.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDetectNearest}
            disabled={geoStatus === 'loading'}
            className="inline-flex items-center min-h-[44px] gap-2 border border-brand-border hover:border-brand-tosca bg-brand-surface text-brand-white hover:text-brand-tosca px-4 py-2.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-brand-tosca" />
            {geoStatus === 'loading'
              ? 'MENDETEKSI RADAR...'
              : geoStatus === 'active'
              ? '3 CABANG TERDEKAT DARI POSISIMU'
              : 'DETEKSI CABANG TERDEKAT'}
          </button>

          <Link
            href="/locations"
            className="inline-flex items-center min-h-[44px] gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors"
          >
            SEMUA LOKASI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {geoStatus === 'error' && (
        <p className="px-6 sm:px-8 lg:px-16 mb-4 text-xs font-mono text-amber-400">
          Izin lokasi tidak aktif di browser. Menampilkan cabang sorotan utama.
        </p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {displayedBranches.map(({ location, distanceKm }) => (
          <BranchPhoto
            key={location.id}
            location={location}
            distanceKm={distanceKm}
            liveStatus={now ? getBranchLiveStatus(location, now) : null}
          />
        ))}
      </motion.div>
    </section>
  )
}
