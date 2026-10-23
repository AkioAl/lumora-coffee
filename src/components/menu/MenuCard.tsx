'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Heart, ArrowUpRight } from 'lucide-react'
import { MenuItem } from '@/types'
import { brand } from '@/data/brand'
import { formatPrice } from '@/lib/format'

interface MenuCardProps {
  item: MenuItem
  index?: number
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export default function MenuCard({
  item,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
}: MenuCardProps) {
  const [imgError, setImgError] = useState(false)
  const [activeTouch, setActiveTouch] = useState(false)

  const orderUrl = `${brand.socialLinks.whatsapp}?text=${encodeURIComponent(
    `Halo Lumora Coffee, saya ingin pesan ${item.name} (${formatPrice(item.priceMin, item.priceMax)}).`
  )}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
      onClick={() => setActiveTouch((prev) => !prev)}
      className="
        group flex flex-col
        bg-brand-surface
        border border-brand-border
        hover:border-brand-tosca
        transition-colors duration-200
        overflow-hidden
      "
    >
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {item.badge && (
          <span className="
            absolute top-3 left-3 z-10
            bg-brand-tosca text-brand-bg
            text-[10px] font-mono font-bold tracking-widest
            px-2.5 py-1 uppercase
          ">
            {item.badge}
          </span>
        )}

        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(item.id)
            }}
            aria-label={isFavorite ? `Hapus ${item.name} dari favorit` : `Simpan ${item.name} ke favorit`}
            aria-pressed={isFavorite}
            className={`
              absolute top-2 right-2 z-20
              w-11 h-11 inline-flex items-center justify-center
              border transition-colors duration-200
              ${isFavorite
                ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                : 'bg-brand-bg/85 border-brand-border text-brand-white hover:border-brand-tosca hover:text-brand-tosca'
              }
            `}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        <div
          className={`
            absolute inset-x-0 bottom-0 z-10
            bg-brand-bg/95 backdrop-blur-sm border-t border-brand-border
            px-4 py-3 flex items-center justify-between gap-2
            transition-transform duration-300 ease-out
            ${activeTouch ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}
          `}
        >
          <div>
            <p className="text-brand-tosca font-mono font-bold text-sm leading-none">
              {formatPrice(item.priceMin, item.priceMax)}
            </p>
            <p className="text-brand-muted text-[10px] font-mono mt-1 tracking-widest uppercase">
              {item.badge ?? item.category}
            </p>
          </div>
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center min-h-[36px] gap-1 bg-brand-tosca text-brand-bg px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-brand-toscaLight transition-colors"
          >
            PESAN
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-brand-white font-bold text-base tracking-wide">
            {item.name}
          </h3>
          <p className="text-brand-muted text-xs mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
          <p className="text-brand-tosca font-mono font-bold text-sm">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center min-h-[44px] px-2 -mr-2 text-brand-muted hover:text-brand-tosca text-[11px] font-mono font-bold tracking-widest uppercase transition-colors"
          >
            PESAN WA
          </a>
        </div>
      </div>
    </motion.article>
  )
}
