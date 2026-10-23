'use client'

import { useMemo, useState } from 'react'
import { Plus, Compass } from 'lucide-react'
import { menuItems } from '@/data/menu'
import { moodPresets } from '@/data/moods'
import { resolveMoodPairing } from '@/lib/menu'
import { formatPrice } from '@/lib/format'
import { useBaristaTicket } from '@/context/BaristaTicketContext'
import { SensoryProfile } from '@/types'

const sliderFields: { key: keyof SensoryProfile; label: string }[] = [
  { key: 'body', label: 'BODY' },
  { key: 'sweetness', label: 'MANIS' },
  { key: 'creaminess', label: 'CREAMY' },
]

export default function MoodCompass() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Partial<SensoryProfile>>({})
  const { addItem } = useBaristaTicket()

  const preset = moodPresets.find((p) => p.id === activeId) ?? null
  const hasOverride = Object.keys(overrides).length > 0

  const pairing = useMemo(() => {
    if (!preset) return null
    return resolveMoodPairing(
      { ...preset, drinkTarget: { ...preset.drinkTarget, ...overrides } },
      menuItems
    )
  }, [preset, overrides])

  const handleSelectPreset = (id: string) => {
    setActiveId(id)
    setOverrides({})
  }

  const handleAddBundle = () => {
    if (!pairing) return
    addItem(pairing.drink, {
      quantity: 1,
      temp: 'Iced',
      sweetness: 'Normal 100%',
      addon: 'Normal',
    })
    addItem(pairing.dish, { quantity: 1, openDrawerAfter: true })
  }

  const bundlePrice = pairing ? pairing.drink.priceMin + pairing.dish.priceMin : 0

  return (
    <section
      aria-labelledby="mood-compass-title"
      className="px-6 sm:px-8 lg:px-16 py-10 border-b border-brand-border bg-brand-bg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-4 h-4 text-brand-tosca" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
          SENSORY PALATE &amp; MOOD COMPASS
        </span>
      </div>
      <h2
        id="mood-compass-title"
        className="text-brand-white font-bold uppercase tracking-tight leading-none"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
      >
        MOOD KAMU HARI INI?
      </h2>

      <div className="flex flex-wrap gap-2 mt-6" role="group" aria-label="Pilih mood">
        {moodPresets.map((p) => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p.id)}
              aria-pressed={isActive}
              className={`min-h-[44px] px-3.5 py-2 text-[11px] font-mono font-bold tracking-widest uppercase border transition-colors ${
                isActive
                  ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                  : 'bg-brand-surface border-brand-border text-brand-muted hover:border-brand-tosca hover:text-brand-white'
              }`}
            >
              [{p.label}]
            </button>
          )
        })}
      </div>

      {!preset && (
        <p className="text-brand-muted text-sm mt-5 max-w-lg">
          Pilih satu mood di atas. Kompas mencocokkan profil rasa minuman dan hidangan, lalu
          menyusun pasangan yang bisa langsung masuk Tiket Barista.
        </p>
      )}

      {preset && pairing && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 mt-6">
          <div className="bg-brand-surface border border-brand-border p-4 sm:p-5">
            <p className="text-brand-muted text-xs leading-relaxed">{preset.hint}</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase mt-4 mb-1">
              {hasOverride ? 'TARGET MINUMAN DISESUAIKAN' : 'TARGET PROFIL MINUMAN'}
            </p>
            {sliderFields.map(({ key, label }) => {
              const value = overrides[key] ?? preset.drinkTarget[key]
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 min-h-[44px] text-[10px] font-mono text-brand-muted uppercase"
                >
                  <span className="w-16 shrink-0">{label}</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={value}
                    onChange={(e) =>
                      setOverrides((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                    className="flex-1 accent-brand-tosca h-6"
                  />
                  <span className="w-8 text-right text-brand-white font-bold">{value}/5</span>
                </label>
              )
            })}
            {hasOverride && (
              <button
                type="button"
                onClick={() => setOverrides({})}
                className="min-h-[44px] mt-1 px-3 text-[10px] font-mono font-bold tracking-widest uppercase border border-brand-border text-brand-muted hover:text-brand-white hover:border-brand-tosca transition-colors"
              >
                KEMBALIKAN KE PRESET
              </button>
            )}
          </div>

          <div className="bg-brand-surface border border-brand-tosca/50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brand-border">
              <span className="inline-block bg-brand-tosca text-brand-bg text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase">
                {pairing.matchScore}% MATCH UNTUK MOOD INI
              </span>
              <span className="text-[10px] font-mono text-brand-muted uppercase">
                COFFEE + FOOD PAIRING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { tag: 'MINUMAN', item: pairing.drink, score: pairing.drinkScore },
                { tag: 'HIDANGAN', item: pairing.dish, score: pairing.dishScore },
              ].map(({ tag, item, score }) => (
                <div key={item.id} className="bg-brand-bg border border-brand-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-brand-tosca font-bold">{tag}</span>
                    <span className="text-[10px] font-mono text-brand-muted">{score}%</span>
                  </div>
                  <p className="text-brand-white font-bold text-sm mt-1">{item.name}</p>
                  <p className="text-brand-tosca font-mono font-bold text-xs mt-1">
                    {formatPrice(item.priceMin, item.priceMax)}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBundle}
              className="w-full min-h-[48px] mt-4 inline-flex items-center justify-center gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg text-xs font-mono font-bold tracking-widest uppercase px-4 py-3 transition-colors"
            >
              <Plus className="w-4 h-4" />
              TAMBAH PAKET KE TIKET BARISTA · {formatPrice(bundlePrice, bundlePrice)}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
