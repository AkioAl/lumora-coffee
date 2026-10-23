'use client'

import { MenuSubTab } from '@/types'

const tabs: { value: MenuSubTab; label: string }[] = [
  { value: 'overview',    label: 'SEMUA ITEM' },
  { value: 'signature',   label: 'SIGNATURE' },
  { value: 'best-seller', label: 'BEST SELLER' },
  { value: 'favorites',   label: 'FAVORIT SAYA' },
]

interface MenuSubNavProps {
  activeTab: MenuSubTab
  onTabChange: (tab: MenuSubTab) => void
  favoritesCount: number
}

export default function MenuSubNav({
  activeTab,
  onTabChange,
  favoritesCount,
}: MenuSubNavProps) {
  return (
    <div className="border-b border-brand-border overflow-x-auto">
      <div className="flex gap-1 px-6 sm:px-8 lg:px-16 min-w-max">
        {tabs.map(({ value, label }) => {
          const isActive = activeTab === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onTabChange(value)}
              className={`
                inline-flex items-center gap-2 min-h-[44px] px-5 py-3
                text-xs font-bold tracking-widest
                border-b-2
                whitespace-nowrap
                transition-all duration-200
                ${isActive
                  ? 'text-brand-white border-brand-tosca'
                  : 'text-brand-muted border-transparent hover:text-brand-white'
                }
              `}
            >
              <span>{label}</span>
              {value === 'favorites' && favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-brand-tosca text-brand-bg">
                  {favoritesCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
