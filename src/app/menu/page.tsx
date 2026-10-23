import type { Metadata } from 'next'
import MenuCatalogClient from '@/components/menu/MenuCatalogClient'

export const metadata: Metadata = {
  title: 'Menu — Lumora Coffee',
  description:
    'Eksplorasi katalog menu Lumora Coffee: Sea Salt Latte, Lumora Latte, Non-Coffee, Food, Snack, dan Dessert.',
}

export default function MenuPage() {
  return <MenuCatalogClient />
}
