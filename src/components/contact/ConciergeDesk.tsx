'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { brand } from '@/data/brand'
import { locations } from '@/data/locations'

type ModeId = 'reservasi' | 'kolaborasi' | 'sewa' | 'feedback'

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'branch'
  required?: boolean
  options?: string[]
  placeholder?: string
}

interface ModeDef {
  id: ModeId
  tab: string
  title: string
  fields: FieldDef[]
}

const MODES: ModeDef[] = [
  {
    id: 'reservasi',
    tab: 'RESERVASI MEJA WFC / GRUP',
    title: 'RESERVASI MEJA WFC / GRUP',
    fields: [
      { key: 'name', label: 'Nama pemesan', type: 'text', required: true },
      { key: 'branch', label: 'Cabang', type: 'branch', required: true },
      { key: 'people', label: 'Jumlah orang', type: 'number', required: true },
      { key: 'date', label: 'Tanggal', type: 'date', required: true },
      { key: 'time', label: 'Jam kedatangan', type: 'time', required: true },
      {
        key: 'needs',
        label: 'Kebutuhan',
        type: 'select',
        options: ['Colokan', 'Ruang tenang', 'Colokan + ruang tenang', 'Tidak ada kebutuhan khusus'],
      },
      { key: 'note', label: 'Catatan', type: 'textarea', placeholder: 'Opsional' },
    ],
  },
  {
    id: 'kolaborasi',
    tab: 'KOLABORASI MUSIKAGRAM / EVENT',
    title: 'KOLABORASI MUSIKAGRAM / EVENT KOMUNITAS',
    fields: [
      { key: 'name', label: 'Nama band / komunitas', type: 'text', required: true },
      {
        key: 'eventType',
        label: 'Jenis acara',
        type: 'select',
        required: true,
        options: ['Musikagram akustik', 'Gathering komunitas', 'Riding / NMR', 'Lainnya'],
      },
      { key: 'branch', label: 'Cabang incaran', type: 'branch', required: true },
      { key: 'date', label: 'Perkiraan tanggal', type: 'date' },
      { key: 'note', label: 'Konsep singkat', type: 'textarea', placeholder: 'Opsional' },
    ],
  },
  {
    id: 'sewa',
    tab: 'SEWA TEMPAT / THE MOMENTS',
    title: 'SEWA TEMPAT / PRIVATE GATHERING & THE MOMENTS',
    fields: [
      { key: 'name', label: 'Nama pemesan', type: 'text', required: true },
      {
        key: 'eventType',
        label: 'Jenis acara',
        type: 'select',
        required: true,
        options: ['Private gathering', 'The MOMents', 'Perayaan / ulang tahun', 'Rapat / kerja'],
      },
      { key: 'branch', label: 'Cabang', type: 'branch', required: true },
      { key: 'people', label: 'Perkiraan jumlah tamu', type: 'number', required: true },
      { key: 'date', label: 'Tanggal', type: 'date', required: true },
      { key: 'note', label: 'Kebutuhan tambahan', type: 'textarea', placeholder: 'Opsional' },
    ],
  },
  {
    id: 'feedback',
    tab: 'FEEDBACK BARISTA & LAYANAN',
    title: 'FEEDBACK BARISTA & LAYANAN',
    fields: [
      { key: 'name', label: 'Nama (boleh dikosongkan)', type: 'text' },
      { key: 'branch', label: 'Cabang', type: 'branch', required: true },
      {
        key: 'topic',
        label: 'Topik',
        type: 'select',
        required: true,
        options: ['Layanan barista', 'Menu', 'Kebersihan & fasilitas', 'Lainnya'],
      },
      { key: 'message', label: 'Pesan', type: 'textarea', required: true },
    ],
  },
]

const INPUT_CLASS =
  'w-full min-h-[44px] bg-brand-bg border border-brand-border focus:border-brand-tosca text-brand-white text-sm px-3 py-2 outline-none transition-colors'

function buildTicketId(): string {
  return `DSP-${Date.now().toString(36).slice(-5).toUpperCase()}`
}

function branchLabel(id: string): string {
  const loc = locations.find((l) => l.id === id)
  return loc ? `${loc.name} (${loc.city})` : ''
}

export default function ConciergeDesk() {
  const [activeMode, setActiveMode] = useState<ModeId>('reservasi')
  const [values, setValues] = useState<Record<ModeId, Record<string, string>>>({
    reservasi: {},
    kolaborasi: {},
    sewa: {},
    feedback: {},
  })
  const [ticketId, setTicketId] = useState('')

  useEffect(() => {
    setTicketId(buildTicketId())
  }, [])

  const mode = MODES.find((m) => m.id === activeMode) ?? MODES[0]
  const current = values[mode.id]

  const setField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [mode.id]: { ...prev[mode.id], [key]: value } }))
  }

  const missing = mode.fields.filter((f) => f.required && !current[f.key]?.trim())
  const isReady = missing.length === 0

  const ticketText = useMemo(() => {
    const lines = mode.fields.map((f) => {
      const raw = current[f.key]?.trim() ?? ''
      const value = f.type === 'branch' ? branchLabel(raw) : raw
      return `${f.label.toUpperCase()}: ${value || '-'}`
    })
    return [
      'LUMORA DISPATCH TICKET',
      `NO: ${ticketId || '-'}`,
      `JENIS: ${mode.title}`,
      '--------------------------------',
      ...lines,
      '--------------------------------',
      'Dikirim dari Lumora Concierge Desk',
    ].join('\n')
  }, [mode, current, ticketId])

  const waUrl = `${brand.socialLinks.whatsapp}?text=${encodeURIComponent(ticketText)}`
  const mailUrl = `${brand.socialLinks.email}?subject=${encodeURIComponent(
    `[${ticketId || 'DSP'}] ${mode.title}`
  )}&body=${encodeURIComponent(ticketText)}`

  return (
    <section className="px-6 sm:px-8 lg:px-16 py-14 sm:py-16 border-b border-brand-border">
      <p className="text-brand-tosca text-xs font-mono font-bold tracking-widest uppercase mb-2">
        LUMORA SMART CONCIERGE &amp; BOOKING DESK
      </p>
      <h2
        className="text-brand-white font-bold uppercase tracking-tight leading-none"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
      >
        SUSUN TIKET KEPERLUAN
      </h2>

      <div
        role="tablist"
        aria-label="Jenis tiket"
        className="flex flex-wrap gap-2 mt-6"
      >
        {MODES.map((m) => {
          const isActive = m.id === activeMode
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveMode(m.id)}
              className={`min-h-[44px] px-3.5 py-2 text-[11px] font-mono font-bold tracking-widest uppercase border transition-colors ${
                isActive
                  ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                  : 'bg-brand-surface border-brand-border text-brand-muted hover:border-brand-tosca hover:text-brand-white'
              }`}
            >
              {m.tab}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-brand-surface border border-brand-border p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label={mode.title}
        >
          {mode.fields.map((f) => {
            const id = `concierge-${mode.id}-${f.key}`
            const wide = f.type === 'textarea' || f.key === 'name'
            return (
              <div key={f.key} className={wide ? 'sm:col-span-2' : ''}>
                <label
                  htmlFor={id}
                  className="block text-[10px] font-mono font-bold tracking-widest text-brand-muted uppercase mb-1.5"
                >
                  {f.label}
                  {f.required ? ' *' : ''}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={id}
                    rows={3}
                    value={current[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={`${INPUT_CLASS} resize-y`}
                  />
                ) : f.type === 'select' || f.type === 'branch' ? (
                  <select
                    id={id}
                    value={current[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Pilih...</option>
                    {f.type === 'branch'
                      ? locations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.city})
                          </option>
                        ))
                      : f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    type={f.type}
                    min={f.type === 'number' ? 1 : undefined}
                    max={f.type === 'number' ? 200 : undefined}
                    value={current[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={INPUT_CLASS}
                  />
                )}
              </div>
            )
          })}
        </form>

        <div className="flex flex-col gap-4">
          <div className="bg-brand-surface border-y-2 border-dashed border-brand-border px-5 py-5">
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-brand-muted uppercase mb-3">
              <span>DISPATCH TICKET PREVIEW</span>
              <span className="text-brand-tosca">{ticketId || '—'}</span>
            </div>
            <pre className="font-mono text-xs text-brand-white leading-relaxed whitespace-pre-wrap break-words">
              {ticketText}
            </pre>
          </div>

          {!isReady && (
            <p className="text-[11px] font-mono text-amber-400">
              Lengkapi dulu: {missing.map((f) => f.label).join(', ')}.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {isReady ? (
              <>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center min-h-[48px] gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  KIRIM TIKET INI KE WHATSAPP RESMI
                </a>
                <a
                  href={mailUrl}
                  className="flex-1 inline-flex items-center justify-center min-h-[48px] gap-2 border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  KIRIM VIA EMAIL
                </a>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center min-h-[48px] gap-2 bg-brand-border text-brand-muted px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />
                  KIRIM TIKET INI KE WHATSAPP RESMI
                </button>
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center min-h-[48px] gap-2 border border-brand-border text-brand-muted px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  KIRIM VIA EMAIL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
