'use client'

import { motion } from 'framer-motion'
import { MenuItem } from '@/types'

const tabs: { value: MenuItem['category']; label: string }[] = [
  { value: 'kopi',       label: 'KOPI' },
  { value: 'non-coffee', label: 'NON COFFEE' },
  { value: 'food',       label: 'FOOD' },
  { value: 'snack',      label: 'SNACK' },
  { value: 'dessert',    label: 'DESSERT' },
]

interface MenuCategoryTabsProps {
  activeCategory: MenuItem['category']
  onCategoryChange: (cat: MenuItem['category']) => void
}

export default function MenuCategoryTabs({
  activeCategory,
  onCategoryChange,
}: MenuCategoryTabsProps) {
  return (
    <div className="px-8 lg:px-16 py-6 border-b border-brand-border overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {tabs.map(({ value, label }) => {
          const isActive = activeCategory === value
          return (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className="relative px-6 py-2 text-xs font-bold tracking-widest transition-colors duration-200"
            >
              {/* Sliding pill background */}
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 bg-brand-tosca"
                  style={{ borderRadius: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              {/* Border outline untuk non-active */}
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
