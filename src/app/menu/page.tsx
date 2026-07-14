'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sprout, Award, RefreshCw,
  Zap, Droplets, Milk,
  Leaf, Sparkles,
  ChefHat, Flame, Star,
  Heart, Coffee,
} from 'lucide-react'
import { menuItems } from '@/data/menu'
import { brand } from '@/data/brand'
import { MenuItem } from '@/types'
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs'
import MenuSubNav from '@/components/menu/MenuSubNav'
import MenuCard from '@/components/menu/MenuCard'

/* ─── Quality badges ──────────────────────────────────────── */
const qualityBadges = [
  { icon: Sprout,   heading: 'BIJI PILIHAN',    sub: '100% Arabica Premium' },
  { icon: Award,    heading: 'DIRACIK BARISTA',  sub: 'Berpengalaman' },
  { icon: RefreshCw, heading: 'SELALU FRESH',   sub: 'Setiap hari' },
]

/* ─── Ingredient highlights per kategori ─────────────────── */
type IngredientItem = { icon: React.ElementType; label: string; sub: string }

const ingredientMap: Record<MenuItem['category'], IngredientItem[]> = {
  'kopi': [
    { icon: Zap,      label: 'ESPRESSO SHOT', sub: 'Bold & Rich' },
    { icon: Droplets, label: 'SEA SALT CREAM', sub: 'Gurih & Creamy' },
    { icon: Milk,     label: 'FRESH MILK',     sub: 'Smooth Taste' },
  ],
  'non-coffee': [
    { icon: Leaf,     label: 'MATCHA PREMIUM', sub: 'Grade A' },
    { icon: Droplets, label: 'FRESH MILK',     sub: 'Creamy' },
    { icon: Sparkles, label: 'NO COFFEE',      sub: 'Caffeine Free' },
  ],
  'food': [
    { icon: ChefHat,  label: 'FRESH DAILY', sub: 'Dibuat Segar' },
    { icon: Flame,    label: 'HOT & READY', sub: 'Served Fresh' },
    { icon: Star,     label: 'CHEF PICK',   sub: 'Signature' },
  ],
  'snack': [
    { icon: Star,     label: 'CRISPY',   sub: 'Renyah Sempurna' },
    { icon: Flame,    label: 'FRESH',    sub: 'Dibuat Segar' },
    { icon: Sparkles, label: 'PREMIUM',  sub: 'Kualitas Terbaik' },
  ],
  'dessert': [
    { icon: Star,     label: 'CRISPY',   sub: 'Renyah Sempurna' },
    { icon: Flame,    label: 'FRESH',    sub: 'Dibuat Segar' },
    { icon: Sparkles, label: 'PREMIUM',  sub: 'Kualitas Terbaik' },
  ],
}

/* ─── Price formatter ─────────────────────────────────────── */
function formatPrice(min: number, max: number): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`
}

/* ─── FeaturedHero sub-component ─────────────────────────── */
function FeaturedHero({
  item,
  category,
}: {
  item: MenuItem
  category: MenuItem['category']
}) {
  const [imgError, setImgError] = useState(false)
  const ingredients = ingredientMap[category]

  return (
    <div className="bg-brand-surface border-y border-brand-border px-8 lg:px-16 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12 items-center">

        {/* ── Kolom kiri — info produk ────────────────────── */}
        <div>
          {/* Badge */}
          {item.badge && (
            <p className="text-brand-tosca text-xs font-bold tracking-widest mb-3 uppercase">
              {item.badge}
            </p>
          )}

          {/* Nama produk */}
          <h2 className="text-brand-white font-bold text-4xl lg:text-5xl tracking-tight leading-tight uppercase">
            {item.name}
          </h2>

          {/* Deskripsi */}
          <p className="text-brand-muted text-base mt-4 max-w-md leading-relaxed">
            {item.description}
          </p>

          {/* Harga */}
          <p className="text-brand-tosca font-bold text-2xl mt-6">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>

          {/* Ingredient highlights */}
          <div className="flex flex-wrap gap-6 mt-8">
            {ingredients.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="w-5 h-5 text-brand-tosca" />
                <p className="text-brand-white text-xs font-bold tracking-wide mt-1">
                  {label}
                </p>
                <p className="text-brand-muted text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 mt-8">
            <a
              href={brand.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                bg-brand-tosca hover:bg-brand-toscaLight
                text-brand-bg font-bold
                px-6 py-3 rounded-none
                transition-colors duration-200
                text-sm tracking-wide uppercase
              "
            >
              PESAN SEKARANG
            </a>
            <button
              aria-label="Tambah ke favorit"
              className="
                border border-brand-border hover:border-brand-tosca
                text-brand-muted hover:text-brand-tosca
                p-3 rounded-none
                transition-colors duration-200
              "
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Kolom kanan — foto produk ───────────────────── */}
        <div className="relative aspect-square overflow-hidden bg-brand-border border-2 border-brand-tosca/30 shadow-[0_0_40px_rgba(42,157,143,0.15)]">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center">
              <Coffee className="w-12 h-12 text-brand-tosca opacity-40" />
            </div>
          ) : (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
          )}
        </div>

      </div>
    </div>
  )
}

/* ─── Menu Page ───────────────────────────────────────────── */
export default function MenuPage() {
  const [activeCategory, setActiveCategory] =
    useState<MenuItem['category']>('kopi')
  const [activeSubTab, setActiveSubTab] = useState('overview')

  // Reset sub-tab ke overview saat ganti kategori
  const handleCategoryChange = (cat: MenuItem['category']) => {
    setActiveCategory(cat)
    setActiveSubTab('overview')
  }

  const filtered = menuItems.filter(
    (item) => item.category === activeCategory,
  )

  const featuredItem =
    filtered.find((i) => i.badge !== null) ?? filtered[0]

  // Grid items berdasarkan sub-tab
  const gridItems =
    activeSubTab === 'signature'
      ? filtered.filter((i) => i.badge === 'SIGNATURE')
      : activeSubTab === 'best-seller'
      ? filtered.filter((i) => i.badge === 'BEST SELLER')
      : filtered // overview → semua

  const showGrid =
    activeSubTab === 'overview' ||
    activeSubTab === 'signature' ||
    activeSubTab === 'best-seller'

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">

      {/* ── Header ──────────────────────────────────────── */}
      <div 
        className="px-8 lg:px-16 pt-16 pb-20 relative bg-brand-border overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.95) 100%), url(/images/hero/hero-kopi.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-brand-muted text-xs tracking-widest">
            <li>
              <Link href="/" className="hover:text-brand-white transition-colors">
                HOME
              </Link>
            </li>
            <li className="text-brand-border">/</li>
            <li>
              <Link href="/menu" className="hover:text-brand-white transition-colors">
                MENU
              </Link>
            </li>
            <li className="text-brand-border">/</li>
            <li className="text-brand-white uppercase">{activeCategory}</li>
          </ol>
        </nav>

        <h1 className="text-brand-white font-bold text-5xl lg:text-7xl tracking-tight mt-4 uppercase">
          OUR MENU.
        </h1>
        <p className="text-brand-muted text-base mt-3 max-w-md">
          Berbagai pilihan menu terbaik yang siap menemani harimu.
        </p>
        </div>
      </div>

      {/* ── Category Tabs ────────────────────────────────── */}
      <MenuCategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* ── Featured Product Hero ────────────────────────── */}
      {featuredItem && (
        <FeaturedHero item={featuredItem} category={activeCategory} />
      )}

      {/* ── Sub Nav ──────────────────────────────────────── */}
      <MenuSubNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {/* ── Grid atau Placeholder ────────────────────────── */}
      <div className="px-8 lg:px-16 py-10">
        {showGrid ? (
          gridItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gridItems.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-brand-muted text-sm font-mono">
                Tidak ada item di filter ini.
              </p>
            </div>
          )
        ) : activeSubTab === 'gallery' ? (
          <div className="w-full flex flex-col items-center justify-center py-20 border border-brand-border bg-brand-surface">
            <p className="text-brand-white font-bold tracking-widest mb-2 uppercase">
              PHOTO MENU — LUMORA COFFEE
            </p>
            <p className="text-brand-muted text-sm font-mono text-center">
              Menu lengkap tersedia saat kunjungan.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-brand-muted text-sm font-mono tracking-wider">
              Segera hadir.
            </p>
          </div>
        )}
      </div>

      {/* ── Quality Badges ───────────────────────────────── */}
      <div className="px-8 lg:px-16 py-10 border-t border-brand-border">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
          {qualityBadges.map(({ icon: Icon, heading, sub }) => (
            <div key={heading} className="flex items-center gap-4">
              <Icon className="w-6 h-6 text-brand-tosca shrink-0" />
              <div>
                <p className="text-brand-white font-bold text-xs tracking-widest">
                  {heading}
                </p>
                <p className="text-brand-muted text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
