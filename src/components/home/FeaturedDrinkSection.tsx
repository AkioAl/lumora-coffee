'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { menuItems } from '@/data/menu'
import { formatPrice } from '@/lib/format'

const featuredDrink = menuItems.find((item) => item.id === 'kopi-1') ?? menuItems[0]

export default function FeaturedDrinkSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section id="featured-drink" className="bg-brand-bg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative bg-brand-surface min-h-[360px] sm:min-h-[440px] md:min-h-full overflow-hidden"
        >
          {!imgError ? (
            <Image
              src={featuredDrink.image}
              alt={featuredDrink.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 50%)' }}
          />
          {featuredDrink.badge && (
            <div className="absolute bottom-6 left-6 z-10">
              <span className="bg-brand-tosca text-brand-bg px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                {featuredDrink.badge}
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-brand-white font-bold leading-none tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
            >
              SEA SALT<br />
              <span className="text-brand-tosca">LATTE.</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="w-12 h-px bg-brand-tosca my-5 sm:my-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-sm"
            >
              {featuredDrink.description}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-brand-white font-mono font-bold text-2xl sm:text-3xl mt-6"
            >
              {formatPrice(featuredDrink.priceMin, featuredDrink.priceMax)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-8"
            >
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-7 py-3.5 transition-colors duration-200 text-xs sm:text-sm tracking-widest uppercase"
              >
                EKSPLORASI KATALOG MENU
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
