'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const showcaseBranches = [
  {
    src: '/images/locations/Jakarta.jpg',
    alt: 'Lumora Coffee Tomang',
    city: 'TOMANG',
    area: 'Jakarta Barat — HQ',
  },
  {
    src: '/images/locations/Aceh.jpg',
    alt: 'Lumora Coffee Vida Bekasi',
    city: 'VIDA BEKASI',
    area: 'Bekasi',
  },
  {
    src: '/images/locations/Bogor.jpg',
    alt: 'Lumora Coffee Malabar Bogor',
    city: 'BOGOR',
    area: 'Bogor',
  },
]

function BranchPhoto({ src, alt, city, area }: typeof showcaseBranches[0]) {
  const [error, setError] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{ height: '340px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Foto */}
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover object-center transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-brand-surface flex items-center justify-center">
          <MapPin className="w-6 h-6 text-brand-tosca opacity-50" />
        </div>
      )}

      {/* Overlay default (gradient bawah) */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? 'rgba(5,5,5,0.65)'
            : 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 60%)',
        }}
      />

      {/* Konten bawah — selalu tampil */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p className="text-brand-white font-bold text-xl tracking-tight uppercase">{city}</p>
        <p className="text-brand-tosca text-xs tracking-widest uppercase mt-1">{area}</p>
      </div>

      {/* Hover: ikon MapPin centre */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8 text-brand-tosca" />
          <span className="text-brand-white text-xs tracking-[0.2em] font-bold uppercase">
            Lihat Lokasi
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default function BranchSection() {
  return (
    <section className="bg-brand-bg py-20">
      {/* Header */}
      <div className="px-8 lg:px-16 mb-10 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mb-3">
            TERSEBAR DI SELURUH INDONESIA
          </p>
          <h2 className="text-brand-white font-bold text-4xl lg:text-5xl tracking-tight leading-none uppercase">
            <span className="text-brand-tosca">10</span> CABANG.<br />
            SATU RUMAH.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block"
        >
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4 transition-all"
          >
            TEMUKAN LOKASI TERDEKAT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Grid 3 foto landscape */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-1"
      >
        {showcaseBranches.map((branch) => (
          <BranchPhoto key={branch.src} {...branch} />
        ))}
      </motion.div>

      {/* CTA mobile */}
      <div className="px-8 lg:px-16 mt-8 lg:hidden">
        <Link
          href="/locations"
          className="inline-flex items-center gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4"
        >
          TEMUKAN LOKASI TERDEKAT
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
