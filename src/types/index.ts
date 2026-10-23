export type MenuCategory = 'kopi' | 'non-coffee' | 'food' | 'snack' | 'dessert'

export type MenuSubTab = 'overview' | 'signature' | 'best-seller' | 'favorites'

export type PlatingRole = 'BASE' | 'CORE' | 'SAUCE' | 'GARNISH'

export interface DrinkLayer {
  id: string
  name: string
  ratio: number
  color: string
  specNote: string
  role?: PlatingRole
  recommendedBoost?: 'Normal' | '+Extra Espresso Shot' | '+Extra Sea Salt Foam'
}

export interface SensoryProfile {
  body: number
  sweetness: number
  creaminess: number
}

export interface CulinaryProfile {
  savory: number
  texture: number
  aroma: number
}

export interface MenuItem {
  id: string
  category: MenuCategory
  name: string
  description: string
  priceMin: number
  priceMax: number
  badge: 'SIGNATURE' | 'BEST SELLER' | null
  image: string
  layers?: DrinkLayer[]
  sensory?: SensoryProfile
  culinary?: CulinaryProfile
}

export type WfcZoneMode = 'wfc-power' | 'golden-hour' | 'communal'

export interface BranchZone {
  id: string
  code: string
  name: string
  mode: WfcZoneMode
  x: number
  y: number
  w: number
  h: number
  powerOutlets: string
  wifiSignal: string
  noiseLevel: 'Quiet' | 'Moderate' | 'Lively'
  capacity: string
  bestTime: string
  specNote: string
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
  zones: BranchZone[]
}

export type OrderType = 'WFC Dine-In' | 'Takeaway' | 'Santap di Rumah'

export type DrinkTemp = 'Iced' | 'Hot'

export type DrinkSweetness = 'Normal 100%' | 'Less Sweet 50%'

export type DrinkAddon = 'Normal' | '+Extra Espresso Shot' | '+Extra Sea Salt Foam'

export interface BaristaTicketItem {
  uid: string
  menuId: string
  name: string
  category: MenuCategory
  unitPrice: number
  quantity: number
  temp?: DrinkTemp
  sweetness?: DrinkSweetness
  addon?: DrinkAddon
  note?: string
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
