import { CulinaryProfile, MenuCategory, SensoryProfile } from '@/types'

export interface MoodPreset {
  id: string
  label: string
  hint: string
  drinkCategories: MenuCategory[]
  drinkTarget: SensoryProfile
  dishCategories: MenuCategory[]
  dishTarget: CulinaryProfile
}

export const moodPresets: MoodPreset[] = [
  {
    id: 'fokus-lembur',
    label: 'FOKUS LEMBUR / HIGH CAFFEINE',
    hint: 'Body pekat, nyaris tanpa manis, camilan renyah yang mudah dimakan sambil mengetik.',
    drinkCategories: ['kopi'],
    drinkTarget: { body: 5, sweetness: 1, creaminess: 1 },
    dishCategories: ['snack'],
    dishTarget: { savory: 4, texture: 5, aroma: 4 },
  },
  {
    id: 'sore-santai',
    label: 'SORE SANTAI / CREAMY SWEET',
    hint: 'Manis dan lembut, ditemani pastry hangat berlapis.',
    drinkCategories: ['kopi', 'non-coffee'],
    drinkTarget: { body: 3, sweetness: 5, creaminess: 5 },
    dishCategories: ['dessert'],
    dishTarget: { savory: 3, texture: 5, aroma: 4 },
  },
  {
    id: 'lapar-berat',
    label: 'LAPAR BERAT / COMFORT MEAL',
    hint: 'Hidangan utama gurih yang mengenyangkan dengan minuman penyeimbang.',
    drinkCategories: ['kopi', 'non-coffee'],
    drinkTarget: { body: 4, sweetness: 2, creaminess: 3 },
    dishCategories: ['food'],
    dishTarget: { savory: 5, texture: 3, aroma: 4 },
  },
  {
    id: 'teman-ngobrol',
    label: 'TEMAN NGOBROL / SHARING SNACK',
    hint: 'Minuman seimbang dan camilan renyah beraroma untuk dibagi satu meja.',
    drinkCategories: ['kopi', 'non-coffee'],
    drinkTarget: { body: 3, sweetness: 3, creaminess: 3 },
    dishCategories: ['snack'],
    dishTarget: { savory: 4, texture: 5, aroma: 5 },
  },
  {
    id: 'segar-tanpa-kopi',
    label: 'SEGAR TANPA KOPI',
    hint: 'Bebas kafein dan ringan, dipadankan dengan sajian segar.',
    drinkCategories: ['non-coffee'],
    drinkTarget: { body: 2, sweetness: 3, creaminess: 1 },
    dishCategories: ['dessert'],
    dishTarget: { savory: 2, texture: 4, aroma: 3 },
  },
]
