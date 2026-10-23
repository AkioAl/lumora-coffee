'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { brand } from '@/data/brand'

const stats = [
  { value: String(brand.totalBranches), label: 'Cabang' },
  { value: String(brand.foundedYear), label: 'Est.' },
  { value: '5K+', label: 'Cups / Week' },
]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-[65px]"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div className="relative w-full h-[115%] bg-brand-bg">
          <Image
            src="/images/hero/hero-kopi.jpg"
            alt="Seduhan espresso Lumora Coffee"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
        </div>
      </motion.div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.82) 45%, rgba(5,5,5,0.28) 75%, rgba(5,5,5,0.1) 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050505, transparent)' }}
      />

      <div className="relative z-20 flex flex-col justify-center px-6 sm:px-8 lg:px-20 py-12 sm:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-bold leading-[0.95] tracking-tight text-brand-white uppercase max-w-2xl"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
        >
          YOUR NEW<br />
          NORMAL<br />
          COMFORT<br />
          <span className="text-brand-tosca">PLACE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-brand-muted text-sm sm:text-base lg:text-lg mt-5 max-w-sm leading-relaxed"
        >
          {brand.subTagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10"
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-6 sm:px-8 py-3.5 transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
          >
            LIHAT MENU
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center min-h-[44px] border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold px-6 sm:px-8 py-3.5 transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
          >
            TEMUKAN LOKASI
          </Link>
        </motion.div>

        <div className="flex gap-8 sm:gap-10 mt-12 sm:mt-16">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.12 }}
              className="flex flex-col"
            >
              <span className="text-brand-white font-bold text-2xl lg:text-3xl leading-none">
                {value}
              </span>
              <span className="text-brand-muted text-[10px] font-mono tracking-widest mt-1.5 uppercase">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.a
        href="#featured-drink"
        aria-label="Gulir ke bagian menu unggulan"
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 inline-flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 text-brand-muted hover:text-brand-tosca transition-colors"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Explore</span>
        <ChevronDown className="w-4 h-4 text-brand-tosca" />
      </motion.a>
    </section>
  )
}
