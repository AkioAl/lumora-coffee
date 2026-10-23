'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, ArrowUpRight, Navigation, Search, RotateCcw } from 'lucide-react'
import { locations } from '@/data/locations'
import LocationCard from '@/components/locations/LocationCard'
import {
  calculateHaversineKm,
  formatDistanceAndEta,
  getBranchLiveStatus,
} from '@/lib/format'

const cities = ['SEMUA', ...Array.from(new Set(locations.map((l) => l.city.toUpperCase())))]

export default function LocationsClient() {
  const [activeCity, setActiveCity] = useState('SEMUA')
  const [searchQuery, setSearchQuery] = useState('')
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoStatus('active')
        setActiveCity('SEMUA')
      },
      () => {
        setGeoStatus('error')
      },
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  const handleResetRadar = () => {
    setUserCoords(null)
    setGeoStatus('idle')
  }

  const hq = locations.find((l) => l.area === 'HQ')
  const hqDistance =
    hq && userCoords
      ? calculateHaversineKm(userCoords.lat, userCoords.lng, hq.lat, hq.lng)
      : undefined
  const hqDistanceInfo =
    typeof hqDistance === 'number' ? formatDistanceAndEta(hqDistance) : null
  const hqStatus = hq && now ? getBranchLiveStatus(hq, now) : null

  const filteredWithDistance = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const baseList = userCoords
      ? locations
      : locations.filter((l) => l.area !== 'HQ')

    const matched = baseList.filter((l) => {
      const cityMatch =
        activeCity === 'SEMUA' || l.city.toUpperCase() === activeCity
      const queryMatch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.facilities.some((f) => f.toLowerCase().includes(q))
      return cityMatch && queryMatch
    })

    const withDist = matched.map((loc) => ({
      location: loc,
      distanceKm: userCoords
        ? calculateHaversineKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng)
        : undefined,
    }))

    if (userCoords) {
      withDist.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    }

    return withDist
  }, [activeCity, searchQuery, userCoords])

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">
      <div
        className="relative px-6 sm:px-8 lg:px-16 pt-16 pb-16 overflow-hidden border-b border-brand-border"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 70% 50%, rgba(42,157,143,0.08) 0%, transparent 70%)',
        }}
      >
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-brand-muted text-xs font-mono tracking-widest">
            <li>
              <Link href="/" className="hover:text-brand-white transition-colors">
                HOME
              </Link>
            </li>
            <li className="text-brand-border">/</li>
            <li className="text-brand-tosca">LOCATIONS</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-4 relative z-10">
          <div>
            <h1
              className="text-brand-white font-bold tracking-tight uppercase leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)' }}
            >
              OUR <span className="text-brand-tosca">LOCATIONS.</span>
            </h1>
            <p className="text-brand-muted text-sm sm:text-base mt-4 max-w-md leading-relaxed">
              10 cabang di 7 kota dengan pantauan status jam operasional waktu nyata (WIB) dan radar jarak langsung dari posisimu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoStatus === 'loading'}
              className="inline-flex items-center justify-center min-h-[44px] gap-2.5 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-6 py-3 text-xs tracking-widest uppercase transition-colors"
            >
              <Navigation className="w-4 h-4" />
              {geoStatus === 'loading'
                ? 'MEMINDAI KOORDINAT...'
                : geoStatus === 'active'
                ? 'RADAR JARAK AKTIF (TERDEKAT)'
                : 'DETEKSI CABANG TERDEKAT'}
            </button>

            {userCoords && (
              <button
                type="button"
                onClick={handleResetRadar}
                aria-label="Reset urutan radar jarak"
                className="inline-flex items-center justify-center min-h-[44px] gap-2 border border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-white px-4 py-3 text-xs font-mono tracking-widest uppercase transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET
              </button>
            )}
          </div>
        </div>

        {geoStatus === 'error' && (
          <p className="mt-4 text-xs font-mono text-amber-400">
            Akses lokasi browser ditolak atau tidak tersedia. Gunakan pencarian kota di bawah untuk menyaring cabang.
          </p>
        )}

        <div
          className="absolute right-8 bottom-0 font-bold leading-none select-none pointer-events-none hidden lg:block"
          style={{ fontSize: '170px', color: 'rgba(42,157,143,0.04)' }}
          aria-hidden="true"
        >
          10
        </div>
      </div>

      {hq && !userCoords && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="px-6 sm:px-8 lg:px-16 mt-10 mb-8"
        >
          <Link
            href={`/locations/${hq.id}`}
            className="group relative grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-brand-border hover:border-brand-tosca transition-colors duration-300 bg-brand-surface"
          >
            <div className="relative min-h-[240px] sm:min-h-[280px] md:min-h-[320px] overflow-hidden bg-brand-border">
              <Image
                src={hq.image}
                alt={hq.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {hqStatus && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-brand-bg/90 border border-brand-border px-3 py-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hqStatus.state === 'OPEN'
                        ? 'bg-brand-tosca'
                        : hqStatus.state === 'CLOSING_SOON'
                        ? 'bg-amber-400'
                        : 'bg-brand-muted'
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-white uppercase">
                    {hqStatus.label} · {hqStatus.detail}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-block bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold tracking-widest px-2.5 py-1">
                  HQ — CABANG PUSAT
                </span>
                {hqDistanceInfo && (
                  <span className="inline-block border border-brand-tosca text-brand-tosca text-[10px] font-mono font-bold tracking-widest px-2.5 py-1">
                    {hqDistanceInfo.distanceText} · {hqDistanceInfo.etaText}
                  </span>
                )}
              </div>

              <h2 className="text-brand-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase leading-none">
                Lumora Coffee{' '}
                <span className="text-brand-tosca">{hq.name}</span>
              </h2>
              <p className="text-brand-muted text-sm mt-3 leading-relaxed max-w-md">
                {hq.address}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <MapPin className="w-3.5 h-3.5 text-brand-tosca" />
                <span className="text-brand-tosca text-xs font-mono font-bold tracking-widest">
                  {hq.city}
                </span>
                <span className="text-brand-border mx-1">·</span>
                <span className="text-brand-muted text-xs">
                  {hq.operationalHours}
                </span>
              </div>
              <div className="inline-flex items-center min-h-[44px] gap-2 mt-5 text-brand-tosca text-xs font-bold tracking-widest uppercase group-hover:underline underline-offset-4 transition-all">
                LIHAT DETAIL CABANG <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="px-6 sm:px-8 lg:px-16 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {cities.map((city) => {
            const isActive = activeCity === city
            return (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className="relative inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-xs font-mono font-bold tracking-widest transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="city-pill"
                    className="absolute inset-0 bg-brand-tosca"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 border border-brand-border hover:border-brand-tosca transition-colors duration-200" />
                )}
                <span
                  className={`relative z-10 ${
                    isActive
                      ? 'text-brand-bg'
                      : 'text-brand-muted hover:text-brand-white'
                  }`}
                >
                  {city}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari cabang, kota, atau fasilitas..."
            aria-label="Cari cabang, kota, atau fasilitas"
            className="w-full min-h-[44px] bg-brand-surface border border-brand-border focus:border-brand-tosca text-brand-white placeholder:text-brand-muted text-xs pl-10 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="px-6 sm:px-8 lg:px-16 pb-12">
        <AnimatePresence mode="wait">
          {filteredWithDistance.length > 0 ? (
            <motion.div
              key={`${activeCity}-${Boolean(userCoords)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredWithDistance.map(({ location, distanceKm }, i) => (
                <motion.div
                  key={location.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <LocationCard
                    location={location}
                    distanceKm={distanceKm}
                    liveStatus={now ? getBranchLiveStatus(location, now) : null}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4 border border-brand-border bg-brand-surface text-center gap-3"
            >
              <MapPin className="w-8 h-8 text-brand-tosca" />
              <p className="text-brand-white font-bold text-sm tracking-widest uppercase">
                TIDAK ADA CABANG YANG COCOK DENGAN PENCARIAN
              </p>
              <p className="text-brand-muted text-xs font-mono max-w-sm">
                Coba kata kunci fasilitas lain (seperti Rooftop, Musholla, atau Outdoor) atau tampilkan seluruh kota.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCity('SEMUA')
                  setSearchQuery('')
                }}
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 bg-brand-tosca text-brand-bg text-xs font-bold tracking-widest uppercase mt-2"
              >
                TAMPILKAN SEMUA CABANG
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-6 sm:mx-8 lg:mx-16 mb-16">
        <div
          className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-10 sm:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-brand-tosca/40"
          style={{ background: 'linear-gradient(135deg, #2A9D8F 0%, #1a7a6e 100%)' }}
        >
          <div
            className="absolute right-6 -bottom-4 font-mono font-bold leading-none select-none pointer-events-none opacity-15 hidden sm:block"
            style={{ fontSize: '120px', color: '#050505' }}
            aria-hidden="true"
          >
            10/10
          </div>

          <div className="relative z-10">
            <h2 className="text-brand-bg font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight uppercase">
              Mau ngopi di cabang mana hari ini?
            </h2>
            <p className="text-brand-bg/80 text-xs sm:text-sm font-mono mt-2">
              Buka navigasi langsung di Google Maps untuk rute tercepat dari lokasimu.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Kopitagram"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center justify-center min-h-[44px] gap-2 bg-brand-bg text-brand-tosca font-bold px-7 py-3.5 text-xs sm:text-sm tracking-widest uppercase hover:bg-brand-surface transition-colors duration-200 flex-shrink-0"
          >
            BUKA GOOGLE MAPS
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
