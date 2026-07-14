'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useRef } from 'react'

const stats = [
  { value: '10', label: 'Cabang' },
  { value: '2018', label: 'Est.' },
  { value: '5K+', label: 'Cups / Week' },
]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-[65px]"
    >
      {/* ── Background foto dengan parallax ────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-[120%]"
          style={{
            backgroundImage: 'url(/images/hero/hero-kopi.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#050505',
          }}
        />
      </motion.div>

      {/* ── Gradient overlay kiri ───────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.80) 40%, rgba(5,5,5,0.2) 70%, rgba(5,5,5,0) 100%)',
        }}
      />

      {/* ── Gradient bawah ──────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050505, transparent)' }}
      />

      {/* ── Konten Utama ────────────────────────────────── */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-8 lg:px-20 py-16">

        {/* Label atas */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-brand-tosca text-xs font-bold tracking-[0.35em] mb-5 uppercase"
        >
          COFFEE &amp; PEOPLE
        </motion.p>

        {/* Heading utama */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-bold text-6xl lg:text-[88px] leading-none tracking-tight text-brand-white uppercase max-w-2xl"
        >
          YOUR NEW<br />
          NORMAL<br />
          COMFORT<br />
          <span className="text-brand-tosca">PLACE.</span>
        </motion.h1>

        {/* Sub heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-brand-muted text-base lg:text-lg mt-6 max-w-sm leading-relaxed"
        >
          Rumahnya Netizen untuk kerja, ngopi, dan berbagi cerita.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap gap-4 mt-10"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-8 py-4 transition-colors duration-200 text-sm tracking-widest uppercase"
          >
            LIHAT MENU
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold px-8 py-4 transition-colors duration-200 text-sm tracking-widest uppercase"
          >
            TEMUKAN LOKASI
          </Link>
        </motion.div>

        {/* ── Stats ───────────────────────────────────────── */}
        <div className="flex gap-10 mt-16">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 + i * 0.15 }}
              className="flex flex-col"
            >
              <span className="text-brand-white font-bold text-2xl lg:text-3xl leading-none">
                {value}
              </span>
              <span className="text-brand-muted text-[10px] tracking-widest mt-1 uppercase">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Scroll Indicator ────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className="text-brand-muted text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-brand-tosca" />
        </motion.div>
      </motion.div>

    </section>
  )
}
