'use client'

const tabs: { value: string; label: string }[] = [
  { value: 'overview',     label: 'OVERVIEW' },
  { value: 'signature',    label: 'SIGNATURE' },
  { value: 'best-seller',  label: 'BEST SELLER' },
  { value: 'ingredients',  label: 'INGREDIENTS' },
  { value: 'gallery',      label: 'PHOTO MENU' },
  { value: 'reviews',      label: 'GALLERY' },
]

interface MenuSubNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MenuSubNav({ activeTab, onTabChange }: MenuSubNavProps) {
  return (
    <div className="border-b border-brand-border overflow-x-auto">
      <div className="flex gap-0 px-8 lg:px-16 min-w-max">
        {tabs.map(({ value, label }) => {
          const isActive = activeTab === value
          return (
            <button
              key={value}
              onClick={() => onTabChange(value)}
              className={`
                px-5 py-4
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
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
