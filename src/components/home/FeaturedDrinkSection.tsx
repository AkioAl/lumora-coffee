'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Plus, Eye } from 'lucide-react'
import { useState } from 'react'
import { menuItems } from '@/data/menu'
import { formatPrice } from '@/lib/format'
import { useBaristaTicket } from '@/context/BaristaTicketContext'
import CupXRayCanvas from '@/components/menu/CupXRayCanvas'
import { DrinkAddon } from '@/types'

const featuredDrink = menuItems.find((item) => item.id === 'kopi-1') ?? menuItems[0]

export default function FeaturedDrinkSection() {
  const [imgError, setImgError] = useState(false)
  const [viewMode, setViewMode] = useState<'xray' | 'photo'>('xray')
  const { addItem } = useBaristaTicket()

  const handleQuickOrder = (addon: DrinkAddon = 'Normal') => {
    addItem(featuredDrink, {
      temp: 'Iced',
      sweetness: 'Normal 100%',
      addon,
      openDrawerAfter: true,
    })
  }

  return (
    <section id="featured-drink" className="bg-brand-bg overflow-hidden border-t border-brand-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[82vh]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative bg-brand-surface p-6 sm:p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-brand-border"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <span className="bg-brand-tosca text-brand-bg px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
              {featuredDrink.badge ?? 'SIGNATURE'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('xray')}
                className={`min-h-[44px] px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors ${
                  viewMode === 'xray'
                    ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                    : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                }`}
              >
                MODE X-RAY FLUIDA
              </button>
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`min-h-[44px] px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors inline-flex items-center gap-1.5 ${
                  viewMode === 'photo'
                    ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                    : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                FOTO PRODUK
              </button>
            </div>
          </div>

          {viewMode === 'xray' && featuredDrink.layers ? (
            <CupXRayCanvas
              itemName={featuredDrink.name}
              layers={featuredDrink.layers}
              sensory={featuredDrink.sensory}
              onQuickOrderLayer={(addon) => handleQuickOrder(addon)}
            />
          ) : (
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden bg-brand-border border border-brand-border">
              {!imgError ? (
                <Image
                  src={featuredDrink.image}
                  alt={featuredDrink.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                  <span className="text-brand-muted text-xs tracking-widest uppercase">
                    {featuredDrink.name}
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 sm:py-16 bg-brand-surface relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-4 font-bold leading-none select-none pointer-events-none"
            style={{
              fontSize: 'clamp(7rem, 16vw, 13.5rem)',
              color: 'rgba(42,157,143,0.04)',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            01
          </div>

          <div className="relative z-10">
            <h2
              className="text-brand-white font-bold leading-none tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
            >
              SEA SALT<br />
              <span className="text-brand-tosca">LATTE.</span>
            </h2>

            <div className="w-12 h-px bg-brand-tosca my-5 sm:my-6" />

            <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-md">
              {featuredDrink.description} Geser atau ketuk diagram X-Ray di samping untuk membedah rasio lapisan krim garam laut, susu dingin 4°C, dan double ristretto espresso.
            </p>

            <p className="text-brand-white font-mono font-bold text-2xl sm:text-3xl mt-6">
              {formatPrice(featuredDrink.priceMin, featuredDrink.priceMax)}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => handleQuickOrder('Normal')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-6 py-3.5 transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
              >
                <Plus className="w-4 h-4" />
                MASUKKAN KE TIKET BARISTA
              </button>

              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold px-6 py-3.5 transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
              >
                KATALOG LENGKAP
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
