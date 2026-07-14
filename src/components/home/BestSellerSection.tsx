'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const bestSellers = [
  {
    id: 'kopi-1',
    name: 'Sea Salt Latte',
    price: 'Rp 38.000',
    badge: 'BEST SELLER',
    image: '/images/menu/KOPI/SeaSaltLatte.png',
    category: 'KOPI',
  },
  {
    id: 'kopi-2',
    name: 'Lumora Latte',
    price: 'Rp 32.000',
    badge: 'SIGNATURE',
    image: '/images/menu/KOPI/Lemora-Latte.png',
    category: 'KOPI',
  },
  {
    id: 'food-1',
    name: 'Bakmie Hot Cheesy Meaty',
    price: 'Rp 45.000',
    badge: 'SIGNATURE',
    image: '/images/menu/FOOD/Bakmie-Hot-Cheesy-Meaty.png',
    category: 'FOOD',
  },
  {
    id: 'snack-1',
    name: 'Truffle Fries',
    price: 'Rp 35.000',
    badge: 'BEST SELLER',
    image: '/images/menu/SNACK/Truffle-Fries.jpg',
    category: 'SNACK',
  },
]

interface BestSellerItem {
  id: string
  name: string
  price: string
  badge: string
  image: string
  category: string
}

function BestSellerCard({ item, index }: { item: BestSellerItem; index: number }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 + index * 0.1 }}
      className="group flex-shrink-0 w-64 lg:w-auto flex flex-col bg-brand-surface border border-brand-border hover:border-brand-tosca transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-brand-border" style={{ aspectRatio: '3/4' }}>
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 256px, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-brand-muted text-xs tracking-widest">{item.category}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[9px] font-bold tracking-widest px-2 py-1 uppercase ${
              item.badge === 'BEST SELLER'
                ? 'bg-brand-tosca text-brand-bg'
                : 'bg-brand-white text-brand-bg'
            }`}
          >
            {item.badge}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <span className="text-brand-muted text-[9px] font-bold tracking-widest uppercase bg-brand-bg px-2 py-1">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-1">
        <p className="text-brand-white font-bold text-sm tracking-wide leading-snug">
          {item.name}
        </p>
        <p className="text-brand-tosca font-bold text-base mt-1">{item.price}</p>
      </div>
    </motion.div>
  )
}

export default function BestSellerSection() {
  return (
    <section className="bg-brand-bg px-8 lg:px-16 py-20 overflow-hidden">
      <div className="flex items-end justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mb-3">
            PALING DISUKAI
          </p>
          <h2 className="text-brand-white font-bold text-4xl lg:text-5xl tracking-tight leading-none uppercase">
            MENU<br />TERLARIS.
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
            href="/menu"
            className="inline-flex items-center gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4 transition-all"
          >
            LIHAT SEMUA MENU
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="flex gap-5 lg:grid lg:grid-cols-4 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible">
        {bestSellers.map((item, i) => (
          <BestSellerCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="mt-8 lg:hidden">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-brand-tosca text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4 transition-all"
        >
          LIHAT SEMUA MENU
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
