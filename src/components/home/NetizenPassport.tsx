'use client'

import { useEffect, useState } from 'react'
import { Coffee, RotateCcw } from 'lucide-react'
import { locations } from '@/data/locations'

const STORAGE_KEY = 'lumora_netizen_passport'
const STAMP_SLOTS = 10

interface PassportState {
  stamps: boolean[]
  visited: string[]
}

const EMPTY_STATE: PassportState = {
  stamps: Array.from({ length: STAMP_SLOTS }, () => false),
  visited: [],
}

function resolveLevel(points: number): { label: string; nextAt: number | null } {
  if (points >= 14) return { label: 'LUMORA LEGEND', nextAt: null }
  if (points >= 6) return { label: 'RESIDENT NETIZEN', nextAt: 14 }
  return { label: 'WFC ROOKIE', nextAt: 6 }
}

function parseState(raw: string | null): PassportState {
  if (!raw) return EMPTY_STATE
  try {
    const parsed = JSON.parse(raw) as Partial<PassportState>
    const stamps = Array.isArray(parsed.stamps)
      ? Array.from({ length: STAMP_SLOTS }, (_, i) => parsed.stamps?.[i] === true)
      : EMPTY_STATE.stamps
    const validIds = new Set(locations.map((l) => l.id))
    const visited = Array.isArray(parsed.visited)
      ? parsed.visited.filter((id): id is string => typeof id === 'string' && validIds.has(id))
      : []
    return { stamps, visited }
  } catch {
    return EMPTY_STATE
  }
}

export default function NetizenPassport() {
  const [state, setState] = useState<PassportState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setState(parseState(window.localStorage.getItem(STORAGE_KEY)))
    } catch {
      setState(EMPTY_STATE)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      return
    }
  }, [state, hydrated])

  const toggleStamp = (index: number) => {
    setState((prev) => ({
      ...prev,
      stamps: prev.stamps.map((s, i) => (i === index ? !s : s)),
    }))
  }

  const toggleBranch = (id: string) => {
    setState((prev) => ({
      ...prev,
      visited: prev.visited.includes(id)
        ? prev.visited.filter((v) => v !== id)
        : [...prev.visited, id],
    }))
  }

  const stampCount = state.stamps.filter(Boolean).length
  const points = stampCount + state.visited.length
  const level = resolveLevel(points)

  return (
    <div className="bg-brand-bg border border-brand-border p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
          NETIZEN PASSPORT // #RUMAHNYANETIZEN
        </span>
        <span className="text-[10px] font-mono text-brand-muted uppercase">SIMULASI</span>
      </div>

      <div className="flex items-end justify-between gap-3 border-b border-brand-border pb-4">
        <div>
          <p className="text-[10px] font-mono text-brand-muted uppercase">LEVEL MEMBER</p>
          <p className="text-brand-white font-bold text-xl tracking-tight uppercase">{level.label}</p>
        </div>
        <p className="text-[10px] font-mono text-brand-muted uppercase text-right">
          {points} POIN
          {level.nextAt !== null ? ` · ${level.nextAt - points} LAGI KE LEVEL BERIKUTNYA` : ' · LEVEL TERTINGGI'}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-mono text-brand-muted uppercase mb-2">
          SIMULASI STEMPEL KUNJUNGAN · {stampCount}/{STAMP_SLOTS}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {state.stamps.map((stamped, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleStamp(i)}
              aria-pressed={stamped}
              aria-label={`Slot stempel ${i + 1}${stamped ? ', sudah distempel' : ', kosong'}`}
              className={`min-h-[44px] aspect-square inline-flex items-center justify-center border border-dashed transition-colors ${
                stamped
                  ? 'bg-brand-tosca/15 border-brand-tosca text-brand-tosca'
                  : 'bg-brand-surface border-brand-border text-brand-border hover:border-brand-tosca/60'
              }`}
            >
              <Coffee className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono text-brand-muted uppercase mb-2">
          CABANG YANG SUDAH DIKUNJUNGI · {state.visited.length}/{locations.length}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {locations.map((loc) => {
            const checked = state.visited.includes(loc.id)
            return (
              <button
                key={loc.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleBranch(loc.id)}
                className={`min-h-[44px] px-3 py-2 flex items-center gap-2.5 text-left text-xs font-mono border transition-colors ${
                  checked
                    ? 'bg-brand-tosca/15 border-brand-tosca text-brand-white'
                    : 'bg-brand-surface border-brand-border text-brand-muted hover:text-brand-white'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 border shrink-0 ${
                    checked ? 'bg-brand-tosca border-brand-tosca' : 'border-brand-muted'
                  }`}
                />
                <span className="truncate">{loc.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-mono text-brand-muted max-w-xs">
          Tersimpan hanya di perangkat ini dan belum terhubung ke poin Loyalty Program resmi Lumora.
        </p>
        <button
          type="button"
          onClick={() => setState(EMPTY_STATE)}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 text-[10px] font-mono font-bold tracking-widest uppercase border border-brand-border text-brand-muted hover:text-brand-white hover:border-brand-tosca transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET PASSPORT
        </button>
      </div>
    </div>
  )
}
