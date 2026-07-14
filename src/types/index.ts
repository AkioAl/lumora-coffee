export interface MenuItem {
  id: string
  category: 'kopi' | 'non-coffee' | 'food' | 'snack' | 'dessert'
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
  mapsEmbedUrl: string
  facilities: string[]
  image: string
}

export interface Program {
  id: string
  name: string
  description: string
  icon: string
}

export interface BrandInfo {
  tagline: string
  subTagline: string
  hashtags: string[]
  socialLinks: {
    instagram: string
    tiktok: string
    whatsapp: string
    email: string
  }
  totalBranches: number
  foundedYear: number
}
