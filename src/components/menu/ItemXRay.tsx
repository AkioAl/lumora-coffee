'use client'

import { DrinkAddon, MenuItem } from '@/types'
import { isDrinkCategory } from '@/lib/menu'
import CupXRayCanvas from '@/components/menu/CupXRayCanvas'
import CulinaryPlatingXRay from '@/components/menu/CulinaryPlatingXRay'

interface ItemXRayProps {
  item: MenuItem
  onOrder: (options: { addon?: DrinkAddon; note?: string }) => void
}

export function getXRayToggleLabel(item: MenuItem): string {
  return isDrinkCategory(item.category) ? 'BEDAH X-RAY FLUIDA' : 'BEDAH KOMPOSISI & PLATING'
}

export default function ItemXRay({ item, onOrder }: ItemXRayProps) {
  if (!item.layers) return null

  if (isDrinkCategory(item.category)) {
    return (
      <CupXRayCanvas
        itemName={item.name}
        layers={item.layers}
        sensory={item.sensory}
        onQuickOrderLayer={(addon) => onOrder({ addon })}
      />
    )
  }

  return (
    <CulinaryPlatingXRay
      itemName={item.name}
      category={item.category}
      layers={item.layers}
      culinary={item.culinary}
      onOrder={(note) => onOrder({ note })}
    />
  )
}
