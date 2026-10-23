'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sprout,
  Award,
  RefreshCw,
  Droplets,
  Milk,
  Leaf,
  ChefHat,
  Flame,
  Heart,
  Coffee,
  Thermometer,
  Wheat,
  Plus,
  Eye,
} from 'lucide-react'
import { menuItems } from '@/data/menu'
import { DrinkAddon, MenuCategory, MenuItem, MenuSubTab } from '@/types'
import { formatPrice } from '@/lib/format'
import { useBaristaTicket } from '@/context/BaristaTicketContext'
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs'
import MenuSubNav from '@/components/menu/MenuSubNav'
import MenuCard from '@/components/menu/MenuCard'
import ItemXRay, { getXRayToggleLabel } from '@/components/menu/ItemXRay'
import MoodCompass from '@/components/menu/MoodCompass'
import { isDrinkCategory } from '@/lib/menu'

const FAVORITES_STORAGE_KEY = 'lumora_favorite_menu_ids'

const qualityBadges = [
  { icon: Sprout,    heading: 'BIJI PILIHAN',    sub: '100% Arabica House Blend' },
  { icon: Award,     heading: 'DIRACIK BARISTA',  sub: 'Kalibrasi Presisi Harian' },
  { icon: RefreshCw, heading: 'SELALU FRESH',     sub: 'Disiapkan Saat Dipesan' },
]

type SpecItem = { icon: React.ElementType; code: string; label: string; sub: string }

const categorySpecs: Record<MenuCategory, SpecItem[]> = {
  'kopi': [
    { icon: Coffee,      code: '01', label: 'DOUBLE RISTRETTO', sub: 'Ekstraksi 9 Bar' },
    { icon: Droplets,    code: '02', label: 'SEA SALT FOAM',    sub: 'Krim Gurih Lembut' },
    { icon: Milk,        code: '03', label: 'CHILLED MILK',     sub: 'Susu Segar 4°C' },
  ],
  'non-coffee': [
    { icon: Leaf,        code: '01', label: 'CULTIVAR LEAF',    sub: 'Uji Matcha & Teh Pilihan' },
    { icon: Milk,        code: '02', label: 'VELVET MILK',      sub: 'Tekstur Creamy Halus' },
    { icon: Thermometer, code: '03', label: 'ZERO CAFFEINE',    sub: 'Nyaman Sepanjang Malam' },
  ],
  'food': [
    { icon: ChefHat,     code: '01', label: 'DAPUR UTAMA',      sub: 'Dimasak per Pesanan' },
    { icon: Flame,       code: '02', label: 'SAJIAN HANGAT',    sub: 'Bumbu Khas Lumora' },
    { icon: Wheat,       code: '03', label: 'PORSI KENYANG',    sub: 'Pendamping Kerja WFC' },
  ],
  'snack': [
    { icon: Flame,       code: '01', label: 'GORENG RENYAH',    sub: 'Minyak Bersih Terkontrol' },
    { icon: Droplets,    code: '02', label: 'SAUS RACIKAN',     sub: 'Truffle & Cheese Dip' },
    { icon: ChefHat,     code: '03', label: 'PORSI SHARING',    sub: 'Cocok untuk Meja Komunal' },
  ],
  'dessert': [
    { icon: Wheat,       code: '01', label: 'FRENCH BUTTER',    sub: 'Lapisan Pastry Berlapis' },
    { icon: Thermometer, code: '02', label: 'DIPANGGANG PAGI',  sub: 'Tekstur Flaky Hangat' },
    { icon: Leaf,        code: '03', label: 'DRESSING SEGAR',   sub: 'Roasted Sesame Jepang' },
  ],
}

function FeaturedHero({
  item,
  category,
  isFavorite,
  onToggleFavorite,
}: {
  item: MenuItem
  category: MenuCategory
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)
  const [heroView, setHeroView] = useState<'xray' | 'photo'>('xray')
  const [selectedTemp, setSelectedTemp] = useState<'Iced' | 'Hot'>('Iced')
  const [selectedSweetness, setSelectedSweetness] = useState<'Normal 100%' | 'Less Sweet 50%'>('Normal 100%')
  const { addItem } = useBaristaTicket()
  const specs = categorySpecs[category]
  const isDrink = isDrinkCategory(category)

  useEffect(() => {
    setImgError(false)
    setHeroView(item.layers ? 'xray' : 'photo')
  }, [item.id, item.layers])

  const handleAddFeatured = (addon: DrinkAddon = 'Normal', note?: string) => {
    addItem(item, {
      quantity: 1,
      temp: isDrink ? selectedTemp : undefined,
      sweetness: isDrink ? selectedSweetness : undefined,
      addon: isDrink ? addon : undefined,
      note: isDrink ? undefined : note,
      openDrawerAfter: true,
    })
  }

  return (
    <div className="bg-brand-surface border-b border-brand-border px-6 sm:px-8 lg:px-16 py-10 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[54%_46%] gap-8 lg:gap-12 items-start">
        <div>
          {item.badge && (
            <span className="inline-block bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 mb-4 uppercase">
              {item.badge}
            </span>
          )}

          <h2
            className="text-brand-white font-bold tracking-tight leading-none uppercase"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            {item.name}
          </h2>

          <p className="text-brand-muted text-sm sm:text-base mt-4 max-w-md leading-relaxed">
            {item.description}
          </p>

          <p className="text-brand-tosca font-mono font-bold text-2xl sm:text-3xl mt-6">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>

          {isDrink && (
            <div className="mt-6 pt-5 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-[10px] text-brand-muted tracking-widest uppercase block mb-1.5">
                  PILIH SUHU SAJIAN
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Iced', 'Hot'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTemp(t)}
                      className={`min-h-[44px] text-xs font-bold uppercase border transition-colors ${
                        selectedTemp === t
                          ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                          : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-brand-muted tracking-widest uppercase block mb-1.5">
                  TAKARAN MANIS
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Normal 100%', 'Less Sweet 50%'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSweetness(s)}
                      className={`min-h-[44px] px-2 text-[10px] font-bold uppercase border transition-colors ${
                        selectedSweetness === s
                          ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                          : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-brand-border">
            {specs.map(({ icon: Icon, code, label, sub }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 bg-brand-bg border border-brand-border"
              >
                <Icon className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-brand-tosca block">
                    SPEC // {code}
                  </span>
                  <p className="text-brand-white text-xs font-bold tracking-wide mt-0.5">
                    {label}
                  </p>
                  <p className="text-brand-muted text-[11px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => handleAddFeatured('Normal')}
              className="
                inline-flex items-center justify-center min-h-[44px] gap-2
                bg-brand-tosca hover:bg-brand-toscaLight
                text-brand-bg font-bold
                px-6 py-3 rounded-none
                transition-colors duration-200
                text-xs sm:text-sm tracking-widest uppercase
              "
            >
              <Plus className="w-4 h-4" />
              TAMBAH KE TIKET BARISTA
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              aria-label={isFavorite ? 'Hapus dari menu favorit' : 'Simpan ke menu favorit'}
              aria-pressed={isFavorite}
              className={`
                inline-flex items-center justify-center min-h-[44px] gap-2 px-4 py-3
                border transition-colors duration-200 text-xs font-mono font-bold tracking-widest uppercase
                ${isFavorite
                  ? 'bg-brand-tosca/15 border-brand-tosca text-brand-tosca'
                  : 'border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-tosca'
                }
              `}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'TERSIMPAN' : 'FAVORIT'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {item.layers && (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setHeroView('xray')}
                className={`min-h-[44px] px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors ${
                  heroView === 'xray'
                    ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                    : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                }`}
              >
                {getXRayToggleLabel(item)}
              </button>
              <button
                type="button"
                onClick={() => setHeroView('photo')}
                className={`min-h-[44px] px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors inline-flex items-center gap-1.5 ${
                  heroView === 'photo'
                    ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                    : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                FOTO STUDIO
              </button>
            </div>
          )}

          {heroView === 'xray' && item.layers ? (
            <ItemXRay
              item={item}
              onOrder={({ addon, note }) => handleAddFeatured(addon, note)}
            />
          ) : (
            <div className="relative aspect-square max-w-md mx-auto md:max-w-none w-full overflow-hidden bg-brand-border border border-brand-tosca/40">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee className="w-12 h-12 text-brand-tosca opacity-40" />
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover object-center"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuCatalogClient() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('kopi')
  const [activeSubTab, setActiveSubTab] = useState<MenuSubTab>('overview')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed.filter((item): item is string => typeof item === 'string'))
        }
      }
    } catch {
      setFavoriteIds([])
    }
  }, [])

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage quota errors in private browsing
      }
      return next
    })
  }

  const handleCategoryChange = (cat: MenuCategory) => {
    setActiveCategory(cat)
    if (activeSubTab !== 'favorites') {
      setActiveSubTab('overview')
    }
  }

  const categoryItems = menuItems.filter((item) => item.category === activeCategory)
  const featuredItem = categoryItems.find((i) => i.badge !== null) ?? categoryItems[0]

  const gridItems =
    activeSubTab === 'signature'
      ? categoryItems.filter((i) => i.badge === 'SIGNATURE')
      : activeSubTab === 'best-seller'
      ? categoryItems.filter((i) => i.badge === 'BEST SELLER')
      : activeSubTab === 'favorites'
      ? menuItems.filter((i) => favoriteIds.includes(i.id))
      : categoryItems

  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">
      <div className="px-6 sm:px-8 lg:px-16 pt-14 pb-16 relative bg-brand-border overflow-hidden">
        <Image
          src="/images/hero/hero-kopi.jpg"
          alt="Katalog Menu Lumora Coffee"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.94) 100%)',
          }}
        />

        <div className="relative z-10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-brand-muted text-xs font-mono tracking-widest">
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
              <li className="text-brand-tosca uppercase">{activeCategory}</li>
            </ol>
          </nav>

          <h1
            className="text-brand-white font-bold tracking-tight mt-4 uppercase leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            OUR <span className="text-brand-tosca">MENU.</span>
          </h1>
          <p className="text-brand-muted text-sm sm:text-base mt-3 max-w-md">
            Kurasi kopi 100% Arabica, sajian non-kopi, dan hidangan hangat untuk menemani jam produktifmu.
          </p>
        </div>
      </div>

      <MenuCategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {featuredItem && (
        <FeaturedHero
          item={featuredItem}
          category={activeCategory}
          isFavorite={favoriteIds.includes(featuredItem.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <MoodCompass />

      <MenuSubNav
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        favoritesCount={favoriteIds.length}
      />

      <div className="px-6 sm:px-8 lg:px-16 py-10">
        {gridItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {gridItems.map((item, i) => (
              <MenuCard
                key={item.id}
                item={item}
                index={i}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-brand-border bg-brand-surface text-center">
            <p className="text-brand-white font-bold text-sm tracking-widest uppercase">
              {activeSubTab === 'favorites'
                ? 'BELUM ADA MENU FAVORIT TERSIMPAN'
                : `TIDAK ADA ITEM ${activeSubTab.toUpperCase()} DI KATEGORI ${activeCategory.toUpperCase()}`}
            </p>
            <p className="text-brand-muted text-xs font-mono mt-2 max-w-md">
              {activeSubTab === 'favorites'
                ? 'Ketuk ikon hati pada kartu menu mana saja untuk menyimpan racikan favoritmu di perangkat ini.'
                : 'Tampilkan seluruh daftar menu pada kategori ini untuk melihat semua pilihan yang tersedia.'}
            </p>
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="mt-5 inline-flex items-center min-h-[44px] px-5 py-2.5 bg-brand-tosca text-brand-bg text-xs font-bold tracking-widest uppercase hover:bg-brand-toscaLight transition-colors"
            >
              TAMPILKAN SEMUA ITEM
            </button>
          </div>
        )}
      </div>

      <div className="px-6 sm:px-8 lg:px-16 py-10 border-t border-brand-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {qualityBadges.map(({ icon: Icon, heading, sub }) => (
            <div key={heading} className="flex items-center gap-4">
              <Icon className="w-6 h-6 text-brand-tosca shrink-0" />
              <div>
                <p className="text-brand-white font-bold text-xs tracking-widest uppercase">
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
