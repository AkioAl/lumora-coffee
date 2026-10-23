'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Wifi, Navigation, ArrowUpRight } from 'lucide-react'
import { Location } from '@/types'
import { brand } from '@/data/brand'
import LocationCard from '@/components/locations/LocationCard'
import {
  calculateHaversineKm,
  formatDistanceAndEta,
  getBranchLiveStatus,
} from '@/lib/format'

interface LocationDetailProps {
  location: Location
  otherLocations: Location[]
}

export default function LocationDetail({
  location,
  otherLocations,
}: LocationDetailProps) {
  const [imgError, setImgError] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleMeasureDistance = () => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = calculateHaversineKm(
          pos.coords.latitude,
          pos.coords.longitude,
          location.lat,
          location.lng
        )
        setDistanceKm(km)
      },
      () => {
        setDistanceKm(null)
      },
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  const liveStatus = now ? getBranchLiveStatus(location, now) : null
  const distanceInfo =
    typeof distanceKm === 'number' ? formatDistanceAndEta(distanceKm) : null
  const waReservationUrl = `${brand.socialLinks.whatsapp}?text=${encodeURIComponent(
    `Halo Lumora Coffee, saya ingin reservasi / tanya ketersediaan meja di cabang ${location.name} (${location.city}).`
  )}`
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">
      <div className="px-6 sm:px-8 lg:px-16 pt-10 pb-6">
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-brand-muted text-xs font-mono tracking-widest">
            <li>
              <Link href="/" className="hover:text-brand-white transition-colors">
                HOME
              </Link>
            </li>
            <li className="text-brand-border">/</li>
            <li>
              <Link href="/locations" className="hover:text-brand-white transition-colors">
                LOCATIONS
              </Link>
            </li>
            <li className="text-brand-border">/</li>
            <li className="text-brand-tosca uppercase">{location.name}</li>
          </ol>
        </nav>

        <Link
          href="/locations"
          className="inline-flex items-center min-h-[44px] text-brand-tosca text-xs font-bold tracking-widest mt-2 hover:underline transition-all uppercase"
        >
          ← KEMBALI KE SEMUA LOKASI
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-brand-border mt-2">
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-brand-border bg-brand-surface">
          <div className="relative aspect-video md:aspect-auto md:flex-1 min-h-[280px] overflow-hidden bg-brand-border flex items-center justify-center">
            {imgError ? (
              <MapPin className="w-12 h-12 text-brand-tosca opacity-40" />
            ) : (
              <Image
                src={location.image}
                alt={`Suasana Lumora Coffee ${location.name}`}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImgError(true)}
              />
            )}

            {liveStatus && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-brand-bg/90 border border-brand-border px-3 py-1.5">
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
                  {liveStatus.label} · {liveStatus.detail}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 border-t border-brand-border bg-brand-bg text-center">
            <div className="p-3.5 border-r border-brand-border">
              <span className="text-[10px] font-mono text-brand-muted uppercase block">
                KOORDINAT
              </span>
              <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
              </span>
            </div>
            <div className="p-3.5 border-r border-brand-border">
              <span className="text-[10px] font-mono text-brand-muted uppercase block">
                ZONA WFC
              </span>
              <span className="text-xs font-mono font-bold text-brand-tosca mt-0.5 block">
                WIFI + POWER READY
              </span>
            </div>
            <div className="p-3.5">
              <span className="text-[10px] font-mono text-brand-muted uppercase block">
                JARAK RADAR
              </span>
              {distanceInfo ? (
                <span className="text-xs font-mono font-bold text-brand-tosca mt-0.5 block">
                  {distanceInfo.distanceText} ({distanceInfo.etaText})
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleMeasureDistance}
                  className="text-xs font-mono font-bold text-brand-white hover:text-brand-tosca underline underline-offset-2 mt-0.5"
                >
                  HITUNG JARAK
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10 bg-brand-surface flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-tosca text-xs font-mono font-bold tracking-widest uppercase">
              {location.city}
            </span>
            {location.area === 'HQ' && (
              <span className="bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                HQ PUSAT
              </span>
            )}
          </div>

          <h1
            className="text-brand-white font-bold tracking-tight uppercase leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {location.name}
          </h1>

          <div className="border-t border-brand-border my-6" />

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-brand-tosca mt-1 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-1">
                  Alamat Lengkap
                </p>
                <p className="text-brand-white text-sm leading-relaxed">
                  {location.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-4 h-4 text-brand-tosca mt-1 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-1">
                  Jam Operasional
                </p>
                <p className="text-brand-white text-sm leading-relaxed">
                  {location.operationalHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Wifi className="w-4 h-4 text-brand-tosca mt-1 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-2">
                  Fasilitas Cabang
                </p>
                <div className="flex flex-wrap gap-2">
                  {location.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="bg-brand-bg border border-brand-border text-brand-white text-xs font-mono px-3 py-1"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={waReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-6 py-3 rounded-none transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
            >
              RESERVASI / PESAN VIA WA
            </a>
            <a
              href={googleMapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] gap-2 border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold px-6 py-3 rounded-none transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
            >
              BUKA RUTE MAPS
              <ArrowUpRight className="w-4 h-4" />
            </a>
            {!distanceInfo && (
              <button
                type="button"
                onClick={handleMeasureDistance}
                className="inline-flex items-center justify-center min-h-[44px] gap-2 border border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-white px-4 py-3 text-xs font-mono tracking-widest uppercase transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-tosca" />
                CEK JARAK DARI SINI
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <h2 className="text-brand-white font-bold text-sm tracking-widest mb-6 uppercase">
          PETA LOKASI CABANG — {location.name.toUpperCase()}
        </h2>
        {location.mapsEmbedUrl ? (
          <iframe
            title={`Peta interaktif lokasi Lumora Coffee cabang ${location.name}`}
            width="100%"
            height="420"
            src={location.mapsEmbedUrl}
            referrerPolicy="no-referrer-when-downgrade"
            className="border border-brand-border grayscale contrast-125"
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <div className="bg-brand-surface border border-brand-border h-48 flex items-center justify-center">
            <p className="text-brand-muted text-sm tracking-wider">
              Peta belum tersedia untuk cabang ini.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 sm:px-8 lg:px-16 py-12 border-t border-brand-border">
        <h2 className="text-brand-white font-bold text-sm tracking-widest mb-6 uppercase">
          CABANG LAINNYA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherLocations.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              liveStatus={now ? getBranchLiveStatus(loc, now) : null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
