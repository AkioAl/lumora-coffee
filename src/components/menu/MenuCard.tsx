'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee } from 'lucide-react'
import { MenuItem } from '@/types'

interface MenuCardProps {
  item: MenuItem
  index?: number
}

function formatPrice(min: number, max: number): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`
}

export default function MenuCard({ item, index = 0 }: MenuCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
      className="
        group flex flex-col
        bg-brand-surface
        border border-brand-border
        hover:border-brand-tosca
        transition-colors duration-200
        overflow-hidden
        cursor-pointer
      "
    >
      {/* ── Foto area ─────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-brand-border">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-brand-tosca opacity-50" />
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badge SIGNATURE / BEST SELLER */}
        {item.badge && (
          <span className="
            absolute top-3 left-3 z-10
            bg-brand-tosca text-brand-bg
            text-[10px] font-bold tracking-widest
            px-2 py-1
          ">
            {item.badge}
          </span>
        )}

        {/* ── Hover Reveal Overlay ─────────────────────── */}
        <div className="
          absolute inset-x-0 bottom-0 z-20
          bg-brand-bg/90 backdrop-blur-sm
          px-4 py-3
          translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-out
        ">
          <p className="text-brand-tosca font-bold text-base leading-none">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>
          <p className="text-brand-muted text-[10px] mt-1 tracking-widest uppercase">
            {item.badge ?? 'MENU'}
          </p>
        </div>
      </div>

      {/* ── Konten bawah ──────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-brand-white font-bold text-sm tracking-wide">
          {item.name}
        </p>
        <p className="text-brand-muted text-xs mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <p className="mt-3 text-brand-tosca font-bold text-sm">
          {formatPrice(item.priceMin, item.priceMax)}
        </p>
      </div>

    </motion.div>
  )
}
