export type MenuCategory = 'kopi' | 'non-coffee' | 'food' | 'snack' | 'dessert'

export type MenuSubTab = 'overview' | 'signature' | 'best-seller' | 'favorites'

export interface MenuItem {
  id: string
  category: MenuCategory
  name: string
  description: string
  priceMin: number
  priceMax: number
  badge: 'SIGNATURE' | 'BEST SELLER' | null
  image: string
}

export interface Location {
  id: string
  name: string
  area: string
  city: string
  address: string
  operationalHours: string
  openHour: number
  closeHour: number
  lat: number
  lng: number
  mapsEmbedUrl: string
  facilities: string[]
  image: string
}

export interface Program {
  id: string
  name: string
  description: string
  schedule: string
  icon: 'music' | 'award' | 'compass' | 'mic' | 'users' | 'package'
}

export interface BrandInfo {
  tagline: string
  subTagline: string
  hashtags: string[]
  whatsappDisplay: string
  emailAddress: string
  instagramHandle: string
  socialLinks: {
    instagram: string
    tiktok: string
    youtube: string
    whatsapp: string
    email: string
  }
  totalBranches: number
  foundedYear: number
}
