'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronLeft, ChevronRight, Clock, Wifi } from 'lucide-react'
import { locations } from '@/data/locations'
import { brand } from '@/data/brand'
import LocationCard from '@/components/locations/LocationCard'

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const [imgError, setImgError] = useState(false)

  const location = locations.find((l) => l.id === params.id)

  if (!location) {
    return (
      <div className="min-h-screen bg-brand-bg pt-[65px] flex flex-col items-center justify-center">
        <MapPin className="w-12 h-12 text-brand-border mb-4" />
        <p className="text-brand-white font-bold text-xl mb-2">Cabang tidak ditemukan.</p>
        <Link href="/locations" className="text-brand-tosca text-sm font-bold tracking-widest hover:underline">
          ← KEMBALI KE LOKASI
        </Link>
      </div>
    )
  }

  const otherLocations = locations.filter((l) => l.id !== location.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">
      
      {/* ── Header ────────────────────────────────────── */}
      <div className="px-8 lg:px-16 pt-12 pb-6">
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-brand-muted text-xs tracking-widest">
            <li>
              <Link href="/" className="hover:text-brand-white transition-colors">HOME</Link>
            </li>
            <li className="text-brand-border">/</li>
            <li>
              <Link href="/locations" className="hover:text-brand-white transition-colors">LOCATIONS</Link>
            </li>
            <li className="text-brand-border">/</li>
            <li className="text-brand-white">{location.name.toUpperCase()}</li>
          </ol>
        </nav>

        <Link
          href="/locations"
          className="inline-block text-brand-tosca text-xs font-bold tracking-widest mt-4 hover:underline transition-all uppercase"
        >
          ← SEMUA LOKASI
        </Link>
      </div>

      {/* ── Hero Section ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-y border-brand-border mt-8">
        
        {/* Kolom Kiri - Foto Slider & Thumbnails */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-brand-border">
          <div className="relative aspect-video overflow-hidden bg-brand-border flex flex-col justify-center">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center absolute inset-0">
                <MapPin className="w-12 h-12 text-brand-tosca opacity-40" />
              </div>
            ) : (
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() => setImgError(true)}
              />
            )}

            {/* Slider Controls */}
            <button className="absolute left-4 bg-brand-surface/80 border border-brand-border p-2 hover:bg-brand-surface transition-colors">
              <ChevronLeft className="w-5 h-5 text-brand-white" />
            </button>
            <button className="absolute right-4 bg-brand-surface/80 border border-brand-border p-2 hover:bg-brand-surface transition-colors">
              <ChevronRight className="w-5 h-5 text-brand-white" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex border-t border-brand-border bg-brand-surface">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`relative aspect-video w-1/4 border-r border-brand-border last:border-r-0 ${i === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100 cursor-pointer'} transition-opacity duration-300`}>
                {imgError ? (
                  <div className="w-full h-full flex items-center justify-center bg-brand-bg">
                    <MapPin className="w-4 h-4 text-brand-tosca opacity-40" />
                  </div>
                ) : (
                  <Image
                    src={location.image}
                    alt={`${location.name} thumbnail ${i}`}
                    fill
                    className={`object-cover object-center transition-all duration-300 ${i === 1 ? '' : 'grayscale hover:grayscale-0'}`}
                    sizes="15vw"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan - Info detail */}
        <div className="px-8 py-10 bg-brand-surface">
          <h1 className="text-brand-white font-bold text-3xl lg:text-4xl tracking-tight">
            {location.name}
          </h1>
          <p className="text-brand-tosca text-sm font-bold tracking-widest mt-2 uppercase">
            {location.city}
          </p>

          <div className="border-t border-brand-border my-6"></div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs tracking-widest uppercase mb-1">Alamat</p>
                <p className="text-brand-white text-sm leading-relaxed">{location.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs tracking-widest uppercase mb-1">Jam Operasional</p>
                <p className="text-brand-white text-sm leading-relaxed">{location.operationalHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Wifi className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
              <div>
                <p className="text-brand-muted text-xs tracking-widest uppercase mb-1">Fasilitas</p>
                <p className="text-brand-white text-sm leading-relaxed">{location.facilities.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={brand.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-6 py-3 rounded-none transition-colors duration-200 text-sm tracking-wide uppercase"
            >
              PESAN VIA WHATSAPP
            </a>
            <a
              href={location.mapsEmbedUrl || "https://maps.google.com/?q=Lumora+Coffee"}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold px-6 py-3 rounded-none transition-colors duration-200 text-sm tracking-wide uppercase"
            >
              LIHAT DI MAPS
            </a>
          </div>
        </div>
      </div>

      {/* ── Maps Section ──────────────────────────────── */}
      <div className="px-8 lg:px-16 py-10">
        <h2 className="text-brand-white font-bold text-sm tracking-widest mb-6 uppercase">
          LOKASI DI PETA
        </h2>
        {location.mapsEmbedUrl ? (
          <iframe
            width="100%"
            height="400"
            src={location.mapsEmbedUrl}
            className="border border-brand-border grayscale"
            loading="lazy"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="bg-brand-surface border border-brand-border h-48 flex items-center justify-center">
            <p className="text-brand-muted text-sm tracking-wider">Peta belum tersedia untuk cabang ini.</p>
          </div>
        )}
      </div>

      {/* ── Cabang Lain ───────────────────────────────── */}
      <div className="px-8 lg:px-16 py-10 border-t border-brand-border">
        <h2 className="text-brand-white font-bold text-sm tracking-widest mb-6 uppercase">
          CABANG LAINNYA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherLocations.map(loc => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </div>

    </div>
  )
}
