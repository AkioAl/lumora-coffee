'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { menuItems } from '@/data/menu'
import { MenuItem } from '@/types'
import { formatPrice } from '@/lib/format'

const bestSellers = menuItems.filter((item) => item.badge !== null).slice(0, 4)

function BestSellerCard({ item, index }: { item: MenuItem; index: number }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 + index * 0.08 }}
    >
      <Link
        href="/menu"
        className="group flex flex-col h-full bg-brand-surface border border-brand-border hover:border-brand-tosca transition-all duration-300"
      >
        <div className="relative overflow-hidden bg-brand-border" style={{ aspectRatio: '3/4' }}>
          {!imgError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-brand-muted text-xs tracking-widest uppercase">
                {item.category}
              </span>
            </div>
          )}
          {item.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`text-[9px] font-mono font-bold tracking-widest px-2 py-1 uppercase ${
                  item.badge === 'BEST SELLER'
                    ? 'bg-brand-tosca text-brand-bg'
                    : 'bg-brand-white text-brand-bg'
                }`}
              >
                {item.badge}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="text-brand-muted text-[9px] font-mono font-bold tracking-widest uppercase bg-brand-bg px-2 py-1">
              {item.category}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col gap-1 flex-1 justify-between">
          <p className="text-brand-white font-bold text-sm tracking-wide leading-snug group-hover:text-brand-tosca transition-colors">
            {item.name}
          </p>
          <p className="text-brand-tosca font-mono font-bold text-base mt-1">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BestSellerSection() {
  return (
    <section className="bg-brand-bg px-6 sm:px-8 lg:px-16 py-16 sm:py-20 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
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
            MENU <span className="text-brand-tosca">TERLARIS.</span>
          </h2>
          <p className="text-brand-muted text-sm mt-2">
            Empat racikan dan sajian yang paling sering dipesan di seluruh cabang.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="hidden sm:block"
        >
          <Link
            href="/menu"
            className="inline-flex items-center min-h-[44px] gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4 transition-all"
          >
            LIHAT SEMUA MENU
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {bestSellers.map((item, i) => (
          <BestSellerCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="mt-8 sm:hidden">
        <Link
          href="/menu"
          className="inline-flex items-center min-h-[44px] gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4 transition-all"
        >
          LIHAT SEMUA MENU
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
