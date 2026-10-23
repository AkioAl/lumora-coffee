import { CulinaryProfile, MenuCategory, MenuItem, SensoryProfile } from '@/types'
import { MoodPreset } from '@/data/moods'

export function isDrinkCategory(category: MenuCategory): boolean {
  return category === 'kopi' || category === 'non-coffee'
}

function profileScore(
  actual: Record<string, number>,
  target: Record<string, number>
): number {
  const keys = Object.keys(target)
  const totalGap = keys.reduce((acc, key) => acc + Math.abs((actual[key] ?? 0) - target[key]), 0)
  const maxGap = keys.length * 4
  return Math.round(100 - (totalGap / maxGap) * 100)
}

export function scoreDrink(item: MenuItem, target: SensoryProfile): number {
  if (!item.sensory) return 0
  return profileScore({ ...item.sensory }, { ...target })
}

export function scoreDish(item: MenuItem, target: CulinaryProfile): number {
  if (!item.culinary) return 0
  return profileScore({ ...item.culinary }, { ...target })
}

export interface MoodPairing {
  drink: MenuItem
  dish: MenuItem
  drinkScore: number
  dishScore: number
  matchScore: number
}

function pickBest(
  candidates: MenuItem[],
  scorer: (item: MenuItem) => number
): { item: MenuItem; score: number } | null {
  let best: { item: MenuItem; score: number } | null = null
  for (const candidate of candidates) {
    const score = scorer(candidate)
    if (!best || score > best.score) best = { item: candidate, score }
  }
  return best
}

export function resolveMoodPairing(
  preset: MoodPreset,
  items: MenuItem[]
): MoodPairing | null {
  const drink = pickBest(
    items.filter((i) => preset.drinkCategories.includes(i.category) && i.sensory),
    (i) => scoreDrink(i, preset.drinkTarget)
  )
  const dish = pickBest(
    items.filter((i) => preset.dishCategories.includes(i.category) && i.culinary),
    (i) => scoreDish(i, preset.dishTarget)
  )
  if (!drink || !dish) return null
  return {
    drink: drink.item,
    dish: dish.item,
    drinkScore: drink.score,
    dishScore: dish.score,
    matchScore: Math.round((drink.score + dish.score) / 2),
  }
}
