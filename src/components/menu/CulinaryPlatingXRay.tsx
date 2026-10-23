'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus, Layers } from 'lucide-react'
import { CulinaryProfile, DrinkLayer, MenuCategory, PlatingRole } from '@/types'

interface CulinaryPlatingXRayProps {
  itemName: string
  category: MenuCategory
  layers: DrinkLayer[]
  culinary?: CulinaryProfile
  onOrder: (note?: string) => void
}

const VIEW_W = 340
const VIEW_H = 270
const CENTER_X = 130
const PLATE_Y = 232
const EXPLODE_GAP = 30
const ROLE_LABEL: Record<PlatingRole, string> = {
  BASE: 'BASE',
  CORE: 'CORE',
  SAUCE: 'SAUCE',
  GARNISH: 'GARNISH',
}

function layerHeight(ratio: number): number {
  return 12 + ratio * 0.38
}

export default function CulinaryPlatingXRay({
  itemName,
  category,
  layers,
  culinary,
  onOrder,
}: CulinaryPlatingXRayProps) {
  const reduceMotion = useReducedMotion()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [hovering, setHovering] = useState(false)

  const exploded = pinned || hovering
  const isBowl = category === 'food'
  const bottomUp = [...layers].map((layer, idx) => ({ layer, idx })).reverse()

  const stackBase = PLATE_Y - 14
  let cursorY = stackBase
  const placed = bottomUp.map(({ layer, idx }, order) => {
    const h = layerHeight(layer.ratio)
    cursorY -= h
    return {
      layer,
      idx,
      order,
      h,
      collapsedY: cursorY,
      rx: 98 - order * 9,
    }
  })

  const activeLayer = layers[selectedIndex] ?? layers[0]
  const richnessLabel = category === 'dessert' ? 'RICHNESS' : 'SAVORY / UMAMI'
  const metrics = culinary
    ? [
        { label: richnessLabel, value: culinary.savory },
        { label: 'CRISP / TEXTURE', value: culinary.texture },
        { label: 'AROMA / INTENSITY', value: culinary.aroma },
      ]
    : []

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 140, damping: 18 }

  return (
    <div className="bg-brand-bg border border-brand-border p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-tosca" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-white uppercase">
            CULINARY ARCHITECTURE // {itemName.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] font-mono text-brand-tosca uppercase">
          DECONSTRUCTED PLATING
        </span>
      </div>

      <div
        className="relative w-full my-3"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto block touch-pan-y"
          role="img"
          aria-label={`Diagram penampang plating ${itemName}. Arahkan kursor atau ketuk lapisan untuk membedah susunan sajian.`}
        >
          <defs>
            <pattern id="plating-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(42,157,143,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={VIEW_W} height={VIEW_H} fill="url(#plating-grid)" />

          {isBowl ? (
            <g>
              <path
                d={`M ${CENTER_X - 120} ${PLATE_Y - 22} Q ${CENTER_X} ${PLATE_Y + 52} ${CENTER_X + 120} ${PLATE_Y - 22} Z`}
                fill="#111111"
                stroke="#2A9D8F"
                strokeWidth="1.5"
              />
              <ellipse
                cx={CENTER_X}
                cy={PLATE_Y - 22}
                rx={120}
                ry={16}
                fill="#0B0B0B"
                stroke="#2A9D8F"
                strokeWidth="1.5"
              />
            </g>
          ) : (
            <g>
              <ellipse cx={CENTER_X} cy={PLATE_Y} rx={124} ry={22} fill="#111111" stroke="#2A9D8F" strokeWidth="1.5" />
              <ellipse cx={CENTER_X} cy={PLATE_Y - 2} rx={96} ry={15} fill="#0B0B0B" stroke="rgba(42,157,143,0.45)" strokeWidth="1" />
            </g>
          )}

          <motion.line
            x1={CENTER_X}
            x2={CENTER_X}
            y1={14}
            y2={PLATE_Y - 14}
            stroke="rgba(245,245,245,0.35)"
            strokeWidth="1"
            strokeDasharray="3 4"
            initial={false}
            animate={{ opacity: exploded ? 1 : 0 }}
            transition={spring}
          />

          {placed.map(({ layer, idx, order, h, collapsedY, rx }) => {
            const isSelected = idx === selectedIndex
            const lift = exploded ? order * EXPLODE_GAP : 0
            const topY = collapsedY
            return (
              <motion.g
                key={layer.id}
                initial={false}
                animate={{ y: -lift }}
                transition={spring}
                onClick={() => {
                  setSelectedIndex(idx)
                  setHovering(true)
                }}
                className="cursor-pointer"
              >
                <rect x={CENTER_X - rx} y={topY + 7} width={rx * 2} height={h} fill={layer.color} fillOpacity={0.55} />
                <ellipse cx={CENTER_X} cy={topY + 7 + h} rx={rx} ry={9} fill={layer.color} fillOpacity={0.55} />
                <ellipse
                  cx={CENTER_X}
                  cy={topY + 7}
                  rx={rx}
                  ry={9}
                  fill={layer.color}
                  fillOpacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? '#4ECDC4' : 'rgba(245,245,245,0.4)'}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <line
                  x1={CENTER_X + rx + 4}
                  x2={248}
                  y1={topY + 7 + h / 2}
                  y2={topY + 7 + h / 2}
                  stroke={isSelected ? '#4ECDC4' : 'rgba(138,155,168,0.45)'}
                  strokeWidth="1"
                />
                <text
                  x={VIEW_W - 6}
                  y={topY + 7 + h / 2 - 4}
                  textAnchor="end"
                  fontFamily="monospace"
                  fontSize="9"
                  fontWeight="bold"
                  fill={isSelected ? '#4ECDC4' : '#8A9BA8'}
                >
                  {layer.role ? ROLE_LABEL[layer.role] : `L0${idx + 1}`} · {layer.ratio}%
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setPinned((v) => !v)}
        aria-pressed={pinned}
        className={`w-full min-h-[44px] mb-3 inline-flex items-center justify-center px-3 py-2 text-[11px] font-mono font-bold tracking-widest uppercase border transition-colors ${
          pinned
            ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
            : 'bg-brand-surface border-brand-border text-brand-white hover:border-brand-tosca'
        }`}
      >
        BEDAH LAPISAN SAJIAN
      </button>

      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {layers.map((layer, idx) => {
          const isSelected = idx === selectedIndex
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => {
                setSelectedIndex(idx)
                setPinned(true)
              }}
              className={`min-h-[44px] px-2 py-1.5 text-left border transition-colors ${
                isSelected
                  ? 'bg-brand-surface border-brand-tosca'
                  : 'bg-brand-surface/50 border-brand-border hover:border-brand-tosca/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9px] font-mono font-bold text-brand-tosca">
                  {layer.role ? ROLE_LABEL[layer.role] : `L0${idx + 1}`} · {layer.ratio}%
                </span>
                <span
                  className="w-2.5 h-2.5 border border-brand-white/30 shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
              </div>
              <p className="text-[10px] font-bold text-brand-white truncate mt-0.5">
                {layer.name}
              </p>
            </button>
          )
        })}
      </div>

      {activeLayer && (
        <div className="p-3.5 bg-brand-surface border border-brand-border space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
              SPEC {activeLayer.role ?? `L0${selectedIndex + 1}`} — {activeLayer.name}
            </span>
            <span className="text-[10px] font-mono text-brand-white font-bold shrink-0">
              {activeLayer.ratio}% PORSI
            </span>
          </div>
          <p className="text-brand-muted text-xs leading-relaxed">{activeLayer.specNote}</p>

          {metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-border/60 font-mono text-[10px]">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <span className="text-brand-muted block">{metric.label}</span>
                  <span className="text-brand-white font-bold">{metric.value}/5</span>
                  <div className="h-[3px] bg-brand-border mt-1">
                    <div
                      className="h-full bg-brand-tosca"
                      style={{ width: `${(metric.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOrder()}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              PESAN HIDANGAN INI
            </button>
            {activeLayer.role !== 'BASE' && (
              <button
                type="button"
                onClick={() => onOrder(`Ekstra ${activeLayer.name.toLowerCase()}`)}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PESAN + EKSTRA {activeLayer.name}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
