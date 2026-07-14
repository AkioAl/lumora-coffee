'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react'
import { locations } from '@/data/locations'
import LocationCard from '@/components/locations/LocationCard'

// Ambil daftar kota unik
const cities = ['SEMUA', ...Array.from(new Set(locations.map((l) => l.city.toUpperCase())))]

export default function LocationsPage() {
  const [activeCity, setActiveCity] = useState('SEMUA')

  const filtered = useMemo(() => {
    if (activeCity === 'SEMUA') return locations.filter((l) => l.area !== 'HQ')
    return locations.filter(
      (l) => l.city.toUpperCase() === activeCity && l.area !== 'HQ'
    )
  }, [activeCity])

  const hq = locations.find((l) => l.area === 'HQ')

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">

      {/* ── Hero Header ────────────────────────────────── */}
      <div
        className="relative px-8 lg:px-16 pt-20 pb-24 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(42,157,143,0.08) 0%, transparent 70%)',
        }}
      >
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-brand-muted text-xs tracking-widest">
            <li><Link href="/" className="hover:text-brand-white transition-colors">HOME</Link></li>
            <li className="text-brand-border">/</li>
            <li className="text-brand-white">LOCATIONS</li>
          </ol>
        </nav>
        <h1 className="text-brand-white font-bold text-5xl lg:text-8xl tracking-tight mt-4 uppercase leading-none">
          OUR<br /><span className="text-brand-tosca">LOCATIONS.</span>
        </h1>
        <p className="text-brand-muted text-base mt-4 max-w-sm">
          10 cabang di berbagai kota siap menyambutmu kapan saja.
        </p>

        {/* Dekor angka */}
        <div
          className="absolute right-8 bottom-0 font-bold leading-none select-none pointer-events-none hidden lg:block"
          style={{ fontSize: '180px', color: 'rgba(42,157,143,0.04)' }}
          aria-hidden="true"
        >
          10
        </div>
      </div>

      {/* ── HQ Spotlight Card ──────────────────────────── */}
      {hq && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-8 lg:px-16 mb-6"
        >
          <Link
            href={`/locations/${hq.id}`}
            className="group relative flex flex-col lg:flex-row overflow-hidden border border-brand-border hover:border-brand-tosca transition-colors duration-300 bg-brand-surface"
          >
            {/* Foto HQ */}
            <div className="relative h-56 lg:h-72 lg:w-1/2 overflow-hidden bg-brand-border flex-shrink-0">
              <Image
                src={hq.image}
                alt={hq.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent 60%, rgba(17,17,17,1) 100%)' }}
              />
            </div>

            {/* Info HQ */}
            <div className="flex flex-col justify-center px-8 lg:px-12 py-8 lg:py-0 flex-1">
              <span className="inline-block bg-brand-tosca text-brand-bg text-[10px] font-bold tracking-widest px-2 py-1 w-fit mb-4">
                HQ — PUSAT
              </span>
              <h2 className="text-brand-white font-bold text-3xl lg:text-4xl tracking-tight uppercase leading-none">
                Lumora Coffee<br />
                <span className="text-brand-tosca">{hq.name}</span>
              </h2>
              <p className="text-brand-muted text-sm mt-3 leading-relaxed max-w-sm">
                {hq.address}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="w-3 h-3 text-brand-tosca" />
                <span className="text-brand-tosca text-xs font-bold tracking-widest">{hq.city}</span>
                <span className="text-brand-border mx-1">·</span>
                <span className="text-brand-muted text-xs">{hq.operationalHours}</span>
              </div>
              <div className="flex items-center gap-2 mt-6 text-brand-tosca text-xs font-bold tracking-widest uppercase group-hover:underline underline-offset-4 transition-all">
                LIHAT DETAIL <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── Filter by City Pills ─────────────────────── */}
      <div className="px-8 lg:px-16 mb-6">
        <div className="flex gap-2 flex-wrap">
          {cities.map((city) => {
            const isActive = activeCity === city
            return (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className="relative px-4 py-2 text-[10px] font-bold tracking-widest transition-colors duration-200"
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
                <span className={`relative z-10 ${isActive ? 'text-brand-bg' : 'text-brand-muted hover:text-brand-white'}`}>
                  {city}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid Cabang ─────────────────────────────── */}
      <div className="px-8 lg:px-16 pb-10">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCity}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((location, i) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <LocationCard location={location} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <MapPin className="w-8 h-8 text-brand-border" />
              <p className="text-brand-muted text-sm tracking-wider">Cabang tidak ditemukan.</p>
              <button
                onClick={() => setActiveCity('SEMUA')}
                className="text-brand-tosca text-xs font-bold tracking-widest hover:underline mt-1"
              >
                Lihat semua cabang
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Map CTA Banner ───────────────────────────── */}
      <div className="mx-8 lg:mx-16 mb-16">
        <div
          className="relative overflow-hidden px-10 lg:px-16 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #2A9D8F 0%, #1a7a6e 100%)' }}
        >
          {/* Dekor background */}
          <div
            className="absolute right-0 top-0 font-bold leading-none select-none pointer-events-none opacity-10"
            style={{ fontSize: '160px', color: '#fff' }}
            aria-hidden="true"
          >
            📍
          </div>

          <div className="relative z-10">
            <p className="text-brand-bg/70 text-xs font-bold tracking-[0.3em] uppercase mb-2">
              TEMUKAN KAMI
            </p>
            <h2 className="text-brand-bg font-bold text-3xl lg:text-4xl tracking-tight leading-tight uppercase">
              Mau ngopi<br />di mana hari ini?
            </h2>
          </div>

          <a
            href="https://maps.google.com/?q=Lumora+Coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 bg-brand-bg text-brand-tosca font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-brand-surface transition-colors duration-200 flex-shrink-0"
          >
            BUKA GOOGLE MAPS
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  )
}
