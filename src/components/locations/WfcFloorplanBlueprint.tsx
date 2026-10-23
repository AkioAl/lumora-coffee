'use client'

import { useState } from 'react'
import { Plug, Wifi, Volume2, Users, Sun, Receipt, ArrowUpRight } from 'lucide-react'
import { Location, WfcZoneMode } from '@/types'
import { brand } from '@/data/brand'
import { useBaristaTicket } from '@/context/BaristaTicketContext'

interface WfcFloorplanBlueprintProps {
  location: Location
}

type FilterMode = 'all' | WfcZoneMode

const FILTER_MODES: { id: FilterMode; label: string }[] = [
  { id: 'all', label: '[SEMUA ZONA]' },
  { id: 'wfc-power', label: '[FOKUS WFC & COLOKAN]' },
  { id: 'golden-hour', label: '[SPOT FOTO & GOLDEN HOUR]' },
  { id: 'communal', label: '[MEJA GRUP / DISKUSI]' },
]

export default function WfcFloorplanBlueprint({
  location,
}: WfcFloorplanBlueprintProps) {
  const { selectBranchZoneAndOpen, branchId, zoneCode } = useBaristaTicket()
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all')
  const [selectedCode, setSelectedCode] = useState<string>(
    location.zones[0]?.code ?? 'Z-01'
  )

  const handleFilterChange = (mode: FilterMode) => {
    setActiveFilter(mode)
    if (mode !== 'all') {
      const firstMatch = location.zones.find((z) => z.mode === mode)
      if (firstMatch) {
        setSelectedCode(firstMatch.code)
      }
    }
  }

  const activeZone =
    location.zones.find((z) => z.code === selectedCode) ?? location.zones[0]

  if (!activeZone) return null

  const isCurrentlyPinnedInTicket =
    branchId === location.id && zoneCode === activeZone.code

  const waZoneReservationUrl = `${brand.socialLinks.whatsapp}?text=${encodeURIComponent(
    `Halo Barista Lumora Coffee ${location.name} (${location.city}), saya ingin cek ketersediaan / reservasi kursi di zona [${activeZone.code} - ${activeZone.name}] (${activeZone.capacity}).`
  )}`

  return (
    <section id="wfc-denah" className="px-6 sm:px-8 lg:px-16 py-12 bg-brand-bg scroll-mt-[65px]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-brand-tosca text-xs font-mono font-bold tracking-widest uppercase mb-2">
            ARCHITECTURAL CAD BLUEPRINT · SKALA TEKNIS
          </p>
          <h2
            className="text-brand-white font-bold uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            RADAR MEJA WFC & DENAH ZONA RUANG
          </h2>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter mode zona cabang"
        >
          {FILTER_MODES.map((mode) => {
            const isActive = activeFilter === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleFilterChange(mode.id)}
                className={`min-h-[44px] px-3.5 py-2 text-xs font-mono font-bold tracking-widest uppercase border transition-colors ${
                  isActive
                    ? 'bg-brand-tosca text-brand-bg border-brand-tosca'
                    : 'bg-brand-surface text-brand-muted border-brand-border hover:border-brand-tosca hover:text-brand-white'
                }`}
              >
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#08090A] border border-brand-border p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-brand-border text-[11px] font-mono text-brand-muted">
            <span>
              DWG ID: LMR-{location.id.toUpperCase()}-FL01 · KLIK ZONA UNTUK DETAIL
            </span>
            <span className="text-brand-tosca">
              GRID: 20M × 12M · ORIENTASI UTARA ↑
            </span>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox="0 0 660 340"
              className="w-full h-auto min-w-[480px] select-none"
              role="img"
              aria-label={`Denah arsitektural cabang Lumora ${location.name}`}
            >
              <defs>
                <pattern
                  id="cad-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#16181A"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect width="660" height="340" fill="url(#cad-grid)" />

              <rect
                x="14"
                y="14"
                width="632"
                height="312"
                fill="none"
                stroke="#2A2A2A"
                strokeWidth="2"
              />

              <line
                x1="14"
                y1="175"
                x2="646"
                y2="175"
                stroke="#2A2A2A"
                strokeWidth="1"
                strokeDasharray="5 5"
              />

              <g>
                <rect
                  x="525"
                  y="30"
                  width="105"
                  height="62"
                  fill="#0D0F10"
                  stroke="#2A2A2A"
                  strokeWidth="1"
                />
                <text
                  x="577"
                  y="56"
                  textAnchor="middle"
                  fill="#888888"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  WIFI 5GHZ AP
                </text>
                <text
                  x="577"
                  y="72"
                  textAnchor="middle"
                  fill="#1ABC9C"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  250 MBPS LINK
                </text>

                <rect
                  x="525"
                  y="102"
                  width="105"
                  height="63"
                  fill="#0D0F10"
                  stroke="#2A2A2A"
                  strokeWidth="1"
                />
                <text
                  x="577"
                  y="128"
                  textAnchor="middle"
                  fill="#888888"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ENTRANCE &amp;
                </text>
                <text
                  x="577"
                  y="143"
                  textAnchor="middle"
                  fill="#888888"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  RESTROOM / WUDHU
                </text>
              </g>

              {location.zones.map((zone) => {
                const isSelected = zone.code === activeZone.code
                const isMatchedByFilter =
                  activeFilter === 'all' || zone.mode === activeFilter
                const strokeColor = isSelected
                  ? '#1ABC9C'
                  : isMatchedByFilter
                  ? '#4B5563'
                  : '#222222'
                const fillColor = isSelected
                  ? 'rgba(26, 188, 156, 0.14)'
                  : isMatchedByFilter
                  ? 'rgba(17, 17, 17, 0.9)'
                  : 'rgba(10, 10, 10, 0.6)'
                const textOpacity = isMatchedByFilter || isSelected ? 1 : 0.35

                return (
                  <g
                    key={zone.code}
                    onClick={() => setSelectedCode(zone.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedCode(zone.code)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={`Pilih zona ${zone.code} ${zone.name}`}
                    className="cursor-pointer focus:outline-none"
                  >
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.w}
                      height={zone.h}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2 : 1.2}
                    />

                    <rect
                      x={zone.x + 8}
                      y={zone.y + 8}
                      width={44}
                      height={18}
                      fill={isSelected ? '#1ABC9C' : '#1A1D1F'}
                    />
                    <text
                      x={zone.x + 30}
                      y={zone.y + 20}
                      textAnchor="middle"
                      fill={isSelected ? '#050505' : '#F5F5F5'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      opacity={textOpacity}
                    >
                      {zone.code}
                    </text>

                    <text
                      x={zone.x + 60}
                      y={zone.y + 20}
                      fill={isSelected ? '#1ABC9C' : '#888888'}
                      fontSize="9"
                      fontFamily="monospace"
                      opacity={textOpacity}
                    >
                      {zone.capacity.toUpperCase()}
                    </text>

                    <text
                      x={zone.x + 12}
                      y={zone.y + 46}
                      fill="#F5F5F5"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      opacity={textOpacity}
                    >
                      {zone.name.toUpperCase()}
                    </text>

                    <text
                      x={zone.x + 12}
                      y={zone.y + 66}
                      fill="#888888"
                      fontSize="10"
                      fontFamily="monospace"
                      opacity={textOpacity}
                    >
                      COLOKAN: {zone.powerOutlets.toUpperCase()}
                    </text>

                    <text
                      x={zone.x + 12}
                      y={zone.y + 84}
                      fill={isSelected ? '#1ABC9C' : '#888888'}
                      fontSize="9"
                      fontFamily="monospace"
                      opacity={textOpacity}
                    >
                      AKUSTIK: {zone.noiseLevel.toUpperCase()}
                    </text>

                    <g opacity={textOpacity}>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <rect
                          key={idx}
                          x={zone.x + 14 + idx * 42}
                          y={zone.y + zone.h - 24}
                          width="28"
                          height="12"
                          fill="none"
                          stroke={isSelected ? '#1ABC9C' : '#2A2A2A'}
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-brand-border">
            {location.zones.map((z) => {
              const isSelected = z.code === activeZone.code
              return (
                <button
                  key={z.code}
                  type="button"
                  onClick={() => setSelectedCode(z.code)}
                  className={`min-h-[44px] px-3 py-2 text-left border font-mono transition-colors ${
                    isSelected
                      ? 'bg-brand-tosca/15 border-brand-tosca text-brand-white'
                      : 'bg-brand-surface border-brand-border text-brand-muted hover:text-brand-white'
                  }`}
                >
                  <span className="text-[10px] text-brand-tosca font-bold block">
                    {z.code}
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {z.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-brand-surface border border-brand-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-brand-border">
              <div>
                <span className="inline-block bg-brand-tosca text-brand-bg text-xs font-mono font-bold px-2.5 py-0.5 uppercase">
                  {activeZone.code}
                </span>
                <span className="ml-2 text-xs font-mono text-brand-muted uppercase">
                  SPESIFIKASI ZONA AKTIF
                </span>
              </div>
              {isCurrentlyPinnedInTicket && (
                <span className="text-[10px] font-mono font-bold text-brand-tosca border border-brand-tosca px-2 py-0.5 uppercase">
                  TERPILIH DI TIKET
                </span>
              )}
            </div>

            <h3 className="text-brand-white font-bold text-xl uppercase tracking-tight mt-4">
              {activeZone.name}
            </h3>
            <p className="text-brand-muted text-xs leading-relaxed mt-1.5">
              {activeZone.specNote}
            </p>

            <div className="grid grid-cols-1 gap-3.5 my-5">
              <div className="flex items-start gap-3 bg-brand-bg border border-brand-border p-3">
                <Plug className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-brand-muted uppercase block">
                    KETERSEDIAAN STOP KONTAK / POWER
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                    {activeZone.powerOutlets}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-brand-bg border border-brand-border p-3">
                <Wifi className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-brand-muted uppercase block">
                    ESTIMASI SINYAL WIFI &amp; THROUGHPUT
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                    {activeZone.wifiSignal}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-brand-bg border border-brand-border p-3">
                <Volume2 className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-brand-muted uppercase block">
                    PROFIL AKUSTIK &amp; KEBISINGAN
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                    {activeZone.noiseLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 bg-brand-bg border border-brand-border p-3">
                  <Users className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-brand-muted uppercase block">
                      KAPASITAS ZONA
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                      {activeZone.capacity}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-brand-bg border border-brand-border p-3">
                  <Sun className="w-4 h-4 text-brand-tosca mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-brand-muted uppercase block">
                      WAKTU OPTIMAL
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-white mt-0.5 block">
                      {activeZone.bestTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() =>
                selectBranchZoneAndOpen(location.id, activeZone.code)
              }
              className="w-full min-h-[48px] bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold text-xs font-mono tracking-widest uppercase px-4 py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              TAUTKAN ZONA [{activeZone.code}] KE TIKET BARISTA
            </button>

            <a
              href={waZoneReservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca font-bold text-xs font-mono tracking-widest uppercase px-4 py-2.5 flex items-center justify-center gap-2 transition-colors"
            >
              RESERVASI ZONA [{activeZone.code}] VIA WA
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
