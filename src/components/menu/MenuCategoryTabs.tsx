'use client'

import { motion } from 'framer-motion'
import { MenuCategory } from '@/types'

const tabs: { value: MenuCategory; label: string }[] = [
  { value: 'kopi',       label: 'KOPI' },
  { value: 'non-coffee', label: 'NON COFFEE' },
  { value: 'food',       label: 'FOOD' },
  { value: 'snack',      label: 'SNACK' },
  { value: 'dessert',    label: 'DESSERT' },
]

interface MenuCategoryTabsProps {
  activeCategory: MenuCategory
  onCategoryChange: (cat: MenuCategory) => void
}

export default function MenuCategoryTabs({
  activeCategory,
  onCategoryChange,
}: MenuCategoryTabsProps) {
  return (
    <div className="px-6 sm:px-8 lg:px-16 py-5 border-b border-brand-border overflow-x-auto">
      <div className="flex gap-2.5 min-w-max">
        {tabs.map(({ value, label }) => {
          const isActive = activeCategory === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onCategoryChange(value)}
              className="relative inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-xs font-bold tracking-widest transition-colors duration-200"
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 bg-brand-tosca"
                  style={{ borderRadius: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              {!isActive && (
                <span className="absolute inset-0 border border-brand-border hover:border-brand-tosca transition-colors duration-200" />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-brand-bg' : 'text-brand-muted hover:text-brand-white'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
