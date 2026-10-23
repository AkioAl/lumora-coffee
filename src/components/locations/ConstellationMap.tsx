'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { locations } from '@/data/locations'
import { Location } from '@/types'
import {
  calculateHaversineKm,
  formatDistanceAndEta,
  getBranchLiveStatus,
} from '@/lib/format'

interface ConstellationMapProps {
  variant?: 'full' | 'compact'
  selectedId?: string | null
  onSelect?: (location: Location) => void
  onClear?: () => void
  now?: Date | null
  userCoords?: { lat: number; lng: number } | null
}

interface Point {
  x: number
  y: number
}

const JAVA_OUTLINE: [number, number][] = [
  [105.85, -5.92],
  [106.35, -5.9],
  [106.8, -6.0],
  [107.3, -5.95],
  [107.85, -6.25],
  [108.55, -6.72],
  [109.12, -6.87],
  [109.68, -6.88],
  [110.42, -6.95],
  [110.65, -6.45],
  [111.35, -6.7],
  [112.05, -6.9],
  [112.65, -7.15],
  [112.9, -7.65],
  [113.2, -7.75],
  [114.0, -7.72],
  [114.4, -8.2],
  [114.45, -8.7],
  [113.5, -8.35],
  [112.8, -8.3],
  [112.0, -8.3],
  [111.3, -8.25],
  [110.8, -8.2],
  [110.3, -8.0],
  [109.4, -7.75],
  [108.5, -7.72],
  [107.6, -7.45],
  [106.9, -7.35],
  [106.55, -7.0],
  [105.5, -6.8],
  [105.2, -6.75],
  [105.45, -6.45],
]

const MAIN_VIEW = { width: 960, height: 340 }
const MAIN_PROJECTION = { lngMin: 105, latTop: -5.6, scale: 100 }
const INSET_VIEW = { width: 360, height: 330 }
const INSET_PROJECTION = { lngMin: 106.5, latTop: -6.1, scale: 600 }
const FAR_THRESHOLD_KM = 70

function project(
  lng: number,
  lat: number,
  p: { lngMin: number; latTop: number; scale: number }
): Point {
  return { x: (lng - p.lngMin) * p.scale, y: (p.latTop - lat) * p.scale }
}

function arcPath(a: Point, b: Point, lift = 0.28): string {
  const midX = (a.x + b.x) / 2
  const midY = (a.y + b.y) / 2
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  return `M ${a.x} ${a.y} Q ${midX} ${midY - dist * lift} ${b.x} ${b.y}`
}

function shortName(location: Location): string {
  return location.name.replace('Centang Biru', 'CB').toUpperCase()
}

const hq = locations.find((l) => l.area === 'HQ') ?? locations[0]
const farBranches = locations.filter(
  (l) => calculateHaversineKm(hq.lat, hq.lng, l.lat, l.lng) > FAR_THRESHOLD_KM
)
const nearBranches = locations.filter((l) => !farBranches.includes(l))
const outlinePath =
  JAVA_OUTLINE.map(([lng, lat], i) => {
    const pt = project(lng, lat, MAIN_PROJECTION)
    return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
  }).join(' ') + ' Z'

interface NodeProps {
  location: Location
  point: Point
  label: string
  isSelected: boolean
  isHq: boolean
  interactive: boolean
  compact: boolean
  hitRadius: number
  onSelect?: (location: Location) => void
}

function MapNode({
  location,
  point,
  label,
  isSelected,
  isHq,
  interactive,
  compact,
  hitRadius,
  onSelect,
}: NodeProps) {
  const radius = isHq ? 7 : 5
  const body = (
    <>
      <circle cx={point.x} cy={point.y} r={hitRadius} fill="transparent" />
      {isSelected && (
        <circle
          cx={point.x}
          cy={point.y}
          r={radius + 6}
          fill="none"
          stroke="#4ECDC4"
          strokeWidth="1.5"
        />
      )}
      <circle
        cx={point.x}
        cy={point.y}
        r={radius}
        fill={isHq ? '#4ECDC4' : '#2A9D8F'}
        stroke="#050505"
        strokeWidth="1.5"
      />
      <text
        x={point.x + radius + 7}
        y={point.y + 3}
        fontFamily="monospace"
        fontSize="9"
        fontWeight="bold"
        fill={isSelected ? '#4ECDC4' : '#F5F5F5'}
      >
        {label}
      </text>
    </>
  )

  if (compact) {
    return (
      <Link href={`/locations/${location.id}`} aria-label={`Buka cabang ${location.name}`}>
        <g className="cursor-pointer">{body}</g>
      </Link>
    )
  }

  return (
    <g
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`Pilih cabang ${location.name}, ${location.city}`}
      aria-pressed={isSelected}
      onClick={() => onSelect?.(location)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(location)
        }
      }}
      className="cursor-pointer focus:outline-none"
    >
      {body}
    </g>
  )
}

export default function ConstellationMap({
  variant = 'full',
  selectedId = null,
  onSelect,
  onClear,
  now = null,
  userCoords = null,
}: ConstellationMapProps) {
  const reduceMotion = useReducedMotion()
  const compact = variant === 'compact'
  const selected = locations.find((l) => l.id === selectedId) ?? null

  const hqMain = project(hq.lng, hq.lat, MAIN_PROJECTION)
  const hqInset = project(hq.lng, hq.lat, INSET_PROJECTION)
  const clusterPoint = hqMain
  const selectedNearHq = selected ? nearBranches.some((l) => l.id === selected.id) : false

  const arcTransition = (i: number) => ({
    duration: reduceMotion ? 0 : 1.1,
    delay: reduceMotion ? 0 : i * 0.08,
    ease: 'easeOut' as const,
  })

  const preview = (() => {
    if (!selected) return null
    const origin = userCoords ?? { lat: hq.lat, lng: hq.lng }
    const km = calculateHaversineKm(origin.lat, origin.lng, selected.lat, selected.lng)
    const distance = selected.id === hq.id && !userCoords ? null : formatDistanceAndEta(km)
    return {
      status: now ? getBranchLiveStatus(selected, now) : null,
      distance,
      distanceLabel: userCoords ? 'JARAK DARI POSISIMU' : 'JARAK DARI HQ',
    }
  })()

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]'}`}
      >
        <div className="bg-[#050505] border border-brand-border p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-brand-border text-[10px] font-mono text-brand-muted uppercase">
            <span>RADAR TOPOLOGI // PULAU JAWA</span>
            <span className="text-brand-tosca">HQ: {hq.name}</span>
          </div>
          <svg
            viewBox={`0 0 ${MAIN_VIEW.width} ${MAIN_VIEW.height}`}
            className="w-full h-auto block"
            role="group"
            aria-label="Peta konstelasi cabang Lumora di Pulau Jawa"
          >
            <defs>
              <pattern id="radar-grid-main" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={MAIN_VIEW.width} height={MAIN_VIEW.height} fill="url(#radar-grid-main)" />
            <path
              d={outlinePath}
              fill="rgba(42,157,143,0.05)"
              stroke="#3A3A3A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <text x="330" y="26" fontFamily="monospace" fontSize="9" fill="#444444">
              LAUT JAWA
            </text>
            <text x="470" y="318" fontFamily="monospace" fontSize="9" fill="#444444">
              SAMUDRA HINDIA
            </text>

            {farBranches.map((loc, i) => {
              const pt = project(loc.lng, loc.lat, MAIN_PROJECTION)
              const isSel = loc.id === selectedId
              return (
                <motion.path
                  key={`arc-${loc.id}`}
                  d={arcPath(hqMain, pt)}
                  fill="none"
                  stroke={isSel ? '#4ECDC4' : '#2A9D8F'}
                  strokeOpacity={isSel ? 1 : 0.55}
                  strokeWidth={isSel ? 2 : 1.2}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={arcTransition(i)}
                />
              )
            })}

            {farBranches.map((loc) => (
              <MapNode
                key={loc.id}
                location={loc}
                point={project(loc.lng, loc.lat, MAIN_PROJECTION)}
                label={loc.city.toUpperCase()}
                isSelected={loc.id === selectedId}
                isHq={false}
                interactive={!compact}
                compact={compact}
                hitRadius={24}
                onSelect={onSelect}
              />
            ))}

            <MapNode
              location={hq}
              point={clusterPoint}
              label={`JABODETABEK ×${nearBranches.length}`}
              isSelected={selectedNearHq}
              isHq
              interactive={!compact}
              compact={compact}
              hitRadius={26}
              onSelect={onSelect}
            />
          </svg>
        </div>

        {!compact && (
          <div className="bg-[#050505] border border-brand-border p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-brand-border text-[10px] font-mono text-brand-muted uppercase">
              <span>ZOOM // JABODETABEK</span>
              <span className="text-brand-tosca">{nearBranches.length} CABANG</span>
            </div>
            <svg
              viewBox={`0 0 ${INSET_VIEW.width} ${INSET_VIEW.height}`}
              className="w-full h-auto block"
              role="group"
              aria-label="Peta zoom cabang Lumora di Jabodetabek"
            >
              <defs>
                <pattern id="radar-grid-inset" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1A1A1A" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={INSET_VIEW.width} height={INSET_VIEW.height} fill="url(#radar-grid-inset)" />
              <line x1="0" y1="10" x2={INSET_VIEW.width} y2="10" stroke="#3A3A3A" strokeWidth="1.5" />
              <text x="8" y="24" fontFamily="monospace" fontSize="9" fill="#444444">
                TELUK JAKARTA
              </text>

              {nearBranches
                .filter((l) => l.id !== hq.id)
                .map((loc, i) => {
                  const pt = project(loc.lng, loc.lat, INSET_PROJECTION)
                  const isSel = loc.id === selectedId
                  return (
                    <motion.path
                      key={`inset-arc-${loc.id}`}
                      d={arcPath(hqInset, pt, 0.22)}
                      fill="none"
                      stroke={isSel ? '#4ECDC4' : '#2A9D8F'}
                      strokeOpacity={isSel ? 1 : 0.55}
                      strokeWidth={isSel ? 2 : 1.2}
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={arcTransition(i)}
                    />
                  )
                })}

              {nearBranches.map((loc) => (
                <MapNode
                  key={loc.id}
                  location={loc}
                  point={project(loc.lng, loc.lat, INSET_PROJECTION)}
                  label={shortName(loc)}
                  isSelected={loc.id === selectedId}
                  isHq={loc.id === hq.id}
                  interactive
                  compact={false}
                  hitRadius={24}
                  onSelect={onSelect}
                />
              ))}
            </svg>
          </div>
        )}
      </div>

      {!compact && (
        <div className="bg-brand-surface border border-brand-border p-4 sm:p-5">
          {selected && preview ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
                  {selected.city} {selected.area === 'HQ' ? '· HQ' : ''}
                </p>
                <p className="text-brand-white font-bold text-xl uppercase tracking-tight mt-1">
                  {selected.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono text-brand-muted">
                  {preview.status && (
                    <span>
                      <span className="text-brand-white font-bold">{preview.status.label}</span> ·{' '}
                      {preview.status.detail}
                    </span>
                  )}
                  {preview.distance && (
                    <span>
                      {preview.distanceLabel}:{' '}
                      <span className="text-brand-white font-bold">
                        {preview.distance.distanceText}
                      </span>{' '}
                      ({preview.distance.etaText})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/locations/${selected.id}#wfc-denah`}
                  className="inline-flex items-center justify-center min-h-[44px] gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  LIHAT DENAH WFC
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/locations/${selected.id}`}
                  className="inline-flex items-center justify-center min-h-[44px] border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  DETAIL CABANG
                </Link>
                <button
                  type="button"
                  onClick={onClear}
                  className="inline-flex items-center justify-center min-h-[44px] border border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-white px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  RESET FILTER
                </button>
              </div>
            </div>
          ) : (
            <p className="text-brand-muted text-xs font-mono">
              Pilih titik cabang di peta untuk memfilter daftar di bawah dan melihat status buka
              waktu nyata (WIB).
            </p>
          )}
        </div>
      )}
    </div>
  )
}
