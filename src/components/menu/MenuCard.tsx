'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Heart, Plus, SlidersHorizontal, Check } from 'lucide-react'
import { DrinkAddon, DrinkSweetness, DrinkTemp, MenuItem } from '@/types'
import { formatPrice } from '@/lib/format'
import { useBaristaTicket, ADDON_PRICE_MAP } from '@/context/BaristaTicketContext'

interface MenuCardProps {
  item: MenuItem
  index?: number
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

const temps: DrinkTemp[] = ['Iced', 'Hot']
const sweetnessLevels: DrinkSweetness[] = ['Normal 100%', 'Less Sweet 50%']
const addons: DrinkAddon[] = ['Normal', '+Extra Espresso Shot', '+Extra Sea Salt Foam']

export default function MenuCard({
  item,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
}: MenuCardProps) {
  const [imgError, setImgError] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [temp, setTemp] = useState<DrinkTemp>('Iced')
  const [sweetness, setSweetness] = useState<DrinkSweetness>('Normal 100%')
  const [addon, setAddon] = useState<DrinkAddon>('Normal')
  const [note, setNote] = useState('')
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const { addItem } = useBaristaTicket()
  const isDrink = item.category === 'kopi' || item.category === 'non-coffee'

  const handleConfirmAdd = () => {
    addItem(item, {
      quantity: qty,
      temp: isDrink ? temp : undefined,
      sweetness: isDrink ? sweetness : undefined,
      addon: isDrink ? addon : undefined,
      note,
    })
    setJustAdded(true)
    setCustomizing(false)
    setNote('')
    setQty(1)
    setTimeout(() => setJustAdded(false), 1800)
  }

  const handleQuickAdd = () => {
    addItem(item, {
      quantity: 1,
      temp: isDrink ? 'Iced' : undefined,
      sweetness: isDrink ? 'Normal 100%' : undefined,
      addon: isDrink ? 'Normal' : undefined,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
      className="
        group flex flex-col
        bg-brand-surface
        border border-brand-border
        hover:border-brand-tosca
        transition-colors duration-200
        overflow-hidden
      "
    >
      <div className="relative aspect-square overflow-hidden bg-brand-border">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-brand-tosca opacity-50" />
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {item.badge && (
          <span className="
            absolute top-3 left-3 z-10
            bg-brand-tosca text-brand-bg
            text-[10px] font-mono font-bold tracking-widest
            px-2.5 py-1 uppercase
          ">
            {item.badge}
          </span>
        )}

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-label={isFavorite ? `Hapus ${item.name} dari favorit` : `Simpan ${item.name} ke favorit`}
            aria-pressed={isFavorite}
            className={`
              absolute top-2 right-2 z-20
              w-11 h-11 inline-flex items-center justify-center
              border transition-colors duration-200
              ${isFavorite
                ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                : 'bg-brand-bg/85 border-brand-border text-brand-white hover:border-brand-tosca hover:text-brand-tosca'
              }
            `}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-brand-white font-bold text-base tracking-wide">
              {item.name}
            </h3>
          </div>
          <p className="text-brand-muted text-xs mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <p className="text-brand-tosca font-mono font-bold text-sm mt-3">
            {formatPrice(item.priceMin, item.priceMax)}
          </p>
        </div>

        {customizing ? (
          <div className="mt-4 pt-3 border-t border-brand-border space-y-3 font-mono">
            {isDrink ? (
              <>
                <div>
                  <span className="text-[10px] text-brand-muted block mb-1 uppercase">
                    SUHU SAJIAN
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {temps.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTemp(t)}
                        className={`min-h-[44px] text-[10px] font-bold uppercase border transition-colors ${
                          temp === t
                            ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                            : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-brand-muted block mb-1 uppercase">
                    TINGKAT MANIS
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sweetnessLevels.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSweetness(s)}
                        className={`min-h-[44px] px-1.5 text-[10px] font-bold uppercase border transition-colors ${
                          sweetness === s
                            ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                            : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-brand-muted block mb-1 uppercase">
                    OPSI TAMBAHAN
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {addons.map((a) => {
                      const extraCost = ADDON_PRICE_MAP[a]
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAddon(a)}
                          className={`min-h-[44px] px-2.5 py-1.5 text-[10px] font-bold uppercase border flex items-center justify-between transition-colors ${
                            addon === a
                              ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                              : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                          }`}
                        >
                          <span>{a}</span>
                          {extraCost > 0 && (
                            <span>+Rp {extraCost.toLocaleString('id-ID')}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label
                  htmlFor={`note-${item.id}`}
                  className="text-[10px] text-brand-muted block mb-1 uppercase"
                >
                  CATATAN DAPUR (OPSIONAL)
                </label>
                <input
                  id={`note-${item.id}`}
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Misal: pedas sedang / saus pisah..."
                  className="w-full min-h-[44px] bg-brand-bg border border-brand-border focus:border-brand-tosca text-brand-white text-xs px-3 py-2 outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 min-h-[44px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg text-[11px] font-bold tracking-widest uppercase px-3 py-2 transition-colors"
              >
                SIMPAN KE TIKET
              </button>
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="min-h-[44px] px-3 py-2 border border-brand-border text-brand-muted hover:text-brand-white text-[10px] font-bold uppercase"
              >
                BATAL
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex-1 inline-flex items-center justify-center min-h-[44px] gap-1.5 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-2 transition-colors"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  MASUK TIKET
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  TIKET BARISTA
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              aria-label={`Kustomisasi ${item.name}`}
              title="Atur Suhu, Manis, atau Catatan"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-tosca transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.article>
  )
}
