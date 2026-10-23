'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Users,
  Copy,
  Check,
  Send,
  ArrowRight,
} from 'lucide-react'
import { useBaristaTicket } from '@/context/BaristaTicketContext'
import { locations } from '@/data/locations'
import { brand } from '@/data/brand'
import { OrderType } from '@/types'

const orderTypes: OrderType[] = ['WFC Dine-In', 'Takeaway', 'Santap di Rumah']

function formatRp(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function BaristaTicketDrawer() {
  const {
    items,
    branchId,
    zoneCode,
    orderType,
    splitCount,
    includeTax,
    ticketNumber,
    isOpen,
    totalCount,
    subtotal,
    taxAmount,
    grandTotal,
    perPersonAmount,
    setIsOpen,
    setBranchId,
    setZoneCode,
    setOrderType,
    setSplitCount,
    setIncludeTax,
    updateQuantity,
    removeItem,
    clearTicket,
  } = useBaristaTicket()

  const [copied, setCopied] = useState(false)

  const selectedBranch =
    locations.find((l) => l.id === branchId) ?? locations[0]
  const availableZones = selectedBranch?.zones ?? []

  const buildOrderReceiptText = () => {
    const lines: string[] = [
      `*TIKET PESANAN BARISTA — LUMORA COFFEE*`,
      `No. Antrean: #${ticketNumber}`,
      `Cabang: Lumora ${selectedBranch.name} (${selectedBranch.city})`,
      `Tipe: ${orderType}${orderType === 'WFC Dine-In' && zoneCode ? ` · Zona ${zoneCode}` : ''}`,
      `--------------------------------`,
    ]

    items.forEach((item, idx) => {
      const specs = [item.temp, item.sweetness, item.addon !== 'Normal' ? item.addon : null]
        .filter(Boolean)
        .join(', ')
      lines.push(
        `${idx + 1}. ${item.quantity}x ${item.name} — ${formatRp(item.unitPrice * item.quantity)}`
      )
      if (specs) lines.push(`   Spec: ${specs}`)
      if (item.note) lines.push(`   Catatan: ${item.note}`)
    })

    lines.push(`--------------------------------`)
    lines.push(`Subtotal: ${formatRp(subtotal)}`)
    if (includeTax) {
      lines.push(`PB1 (10%): ${formatRp(taxAmount)}`)
    }
    lines.push(`*ESTIMASI TOTAL: ${formatRp(grandTotal)}*`)

    return lines.join('\n')
  }

  const buildSplitBillText = () => {
    const lines: string[] = [
      `🧾 *PATUNGAN NONGKRONG LUMORA (${selectedBranch.name.toUpperCase()})*`,
      `Tiket #${ticketNumber} · ${orderType}`,
      `--------------------------------`,
    ]
    items.forEach((item) => {
      lines.push(`• ${item.quantity}x ${item.name}: ${formatRp(item.unitPrice * item.quantity)}`)
    })
    lines.push(`--------------------------------`)
    lines.push(`Subtotal: ${formatRp(subtotal)}`)
    if (includeTax) {
      lines.push(`PB1 10%: ${formatRp(taxAmount)}`)
    }
    lines.push(`Total Tagihan: ${formatRp(grandTotal)}`)
    lines.push(`👥 Dibagi ${splitCount} Orang: *${formatRp(perPersonAmount)} / orang*`)

    return lines.join('\n')
  }

  const handleCopySplitBill = async () => {
    const text = buildSplitBillText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const whatsappCheckoutUrl = `${brand.socialLinks.whatsapp}?text=${encodeURIComponent(
    buildOrderReceiptText()
  )}`

  return (
    <>
      {totalCount > 0 && !isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center min-h-[48px] gap-3 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-mono font-bold px-5 py-3 border border-brand-bg shadow-lg transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span className="text-xs tracking-widest uppercase">
              TIKET BARISTA ({totalCount})
            </span>
            <span className="bg-brand-bg text-brand-tosca text-xs px-2 py-0.5">
              {formatRp(grandTotal)}
            </span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Tiket Pesanan Barista dan Kalkulator Patungan"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-brand-bg border-l border-brand-border flex flex-col justify-between overflow-hidden"
            >
              <div className="px-6 py-4 bg-brand-surface border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-brand-tosca" />
                  <div>
                    <p className="text-brand-white font-mono font-bold text-xs tracking-widest uppercase">
                      BARISTA ORDER TICKET
                    </p>
                    <p className="text-brand-muted font-mono text-[10px] tracking-widest uppercase">
                      QUEUE #{ticketNumber} · THERMAL SPEC
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup tiket barista"
                  className="w-11 h-11 inline-flex items-center justify-center border border-brand-border text-brand-muted hover:text-brand-white hover:border-brand-tosca transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 font-mono">
                <div className="p-4 bg-brand-surface border border-brand-border space-y-3">
                  <div>
                    <label
                      htmlFor="ticket-branch-select"
                      className="block text-[10px] text-brand-muted tracking-widest uppercase mb-1.5"
                    >
                      CABANG TUJUAN
                    </label>
                    <select
                      id="ticket-branch-select"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      className="w-full min-h-[44px] bg-brand-bg border border-brand-border focus:border-brand-tosca text-brand-white text-xs px-3 py-2 outline-none"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          Lumora {loc.name} — {loc.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-[10px] text-brand-muted tracking-widest uppercase mb-1.5">
                      TIPE LAYANAN
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {orderTypes.map((type) => {
                        const active = orderType === type
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOrderType(type)}
                            className={`min-h-[44px] px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase border transition-colors ${
                              active
                                ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                                : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-white'
                            }`}
                          >
                            {type}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {orderType === 'WFC Dine-In' && availableZones.length > 0 && (
                    <div>
                      <label
                        htmlFor="ticket-zone-select"
                        className="block text-[10px] text-brand-muted tracking-widest uppercase mb-1.5"
                      >
                        ZONA MEJA WFC / HANGOUT
                      </label>
                      <select
                        id="ticket-zone-select"
                        value={zoneCode}
                        onChange={(e) => setZoneCode(e.target.value)}
                        className="w-full min-h-[44px] bg-brand-bg border border-brand-border focus:border-brand-tosca text-brand-white text-xs px-3 py-2 outline-none"
                      >
                        {availableZones.map((z) => (
                          <option key={z.id} value={z.code}>
                            [{z.code}] {z.name} ({z.powerOutlets})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="py-12 px-4 border border-dashed border-brand-border text-center space-y-3">
                    <p className="text-brand-white text-xs font-bold tracking-widest uppercase">
                      BELUM ADA ITEM DI TIKET BARISTA
                    </p>
                    <p className="text-brand-muted text-[11px] leading-relaxed font-sans">
                      Pilih racikan kopi atau makanan dari katalog menu untuk menyusun tiket pesanan dan menghitung patungan nongkrong.
                    </p>
                    <Link
                      href="/menu"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center min-h-[44px] gap-2 bg-brand-tosca text-brand-bg text-xs font-bold tracking-widest px-5 py-2.5 uppercase"
                    >
                      BUKA KATALOG MENU
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="border-t border-b border-dashed border-brand-border py-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-brand-tosca font-bold tracking-widest uppercase">
                          DAFTAR RACIKAN ({totalCount} ITEM)
                        </span>
                        <button
                          type="button"
                          onClick={clearTicket}
                          className="inline-flex items-center min-h-[36px] gap-1 text-[10px] text-brand-muted hover:text-brand-white uppercase tracking-widest"
                        >
                          <Trash2 className="w-3 h-3" />
                          KOSONGKAN
                        </button>
                      </div>

                      {items.map((item) => {
                        const specs = [
                          item.temp,
                          item.sweetness,
                          item.addon && item.addon !== 'Normal' ? item.addon : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')

                        return (
                          <div
                            key={item.uid}
                            className="p-3.5 bg-brand-surface border border-brand-border flex flex-col gap-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-brand-white font-bold text-xs uppercase">
                                  {item.name}
                                </p>
                                {specs && (
                                  <p className="text-brand-tosca text-[10px] mt-0.5">
                                    {specs}
                                  </p>
                                )}
                                {item.note && (
                                  <p className="text-brand-muted text-[10px] mt-0.5">
                                    Catatan: &ldquo;{item.note}&rdquo;
                                  </p>
                                )}
                              </div>
                              <p className="text-brand-white font-bold text-xs shrink-0">
                                {formatRp(item.unitPrice * item.quantity)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
                              <span className="text-[10px] text-brand-muted">
                                @ {formatRp(item.unitPrice)}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.uid, -1)}
                                  aria-label={`Kurangi jumlah ${item.name}`}
                                  className="w-11 h-11 inline-flex items-center justify-center border border-brand-border bg-brand-bg text-brand-white hover:border-brand-tosca"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-brand-white">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.uid, 1)}
                                  aria-label={`Tambah jumlah ${item.name}`}
                                  className="w-11 h-11 inline-flex items-center justify-center border border-brand-border bg-brand-bg text-brand-white hover:border-brand-tosca"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.uid)}
                                  aria-label={`Hapus ${item.name} dari tiket`}
                                  className="w-11 h-11 inline-flex items-center justify-center border border-brand-border bg-brand-bg text-brand-muted hover:text-brand-white hover:border-brand-tosca ml-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="p-4 bg-brand-surface border border-brand-tosca/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-brand-tosca" />
                          <span className="text-xs font-bold text-brand-white tracking-widest uppercase">
                            PATUNGAN NONGKRONG (SPLIT BILL)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-brand-muted">
                          JUMLAH ORANG (2–10):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                            aria-label="Kurangi jumlah orang patungan"
                            className="w-11 h-11 inline-flex items-center justify-center border border-brand-border bg-brand-bg text-brand-white hover:border-brand-tosca"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-12 text-center text-sm font-bold text-brand-tosca">
                            {splitCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                            aria-label="Tambah jumlah orang patungan"
                            className="w-11 h-11 inline-flex items-center justify-center border border-brand-border bg-brand-bg text-brand-white hover:border-brand-tosca"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-brand-border">
                        <span className="text-[11px] text-brand-muted">
                          PAJAK RESTORAN (PB1 10%):
                        </span>
                        <button
                          type="button"
                          onClick={() => setIncludeTax(!includeTax)}
                          aria-pressed={includeTax}
                          className={`min-h-[44px] px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                            includeTax
                              ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
                              : 'bg-brand-bg border-brand-border text-brand-muted'
                          }`}
                        >
                          {includeTax ? 'TERMASUK PB1 10%' : 'TANPA PB1'}
                        </button>
                      </div>

                      <div className="p-3 bg-brand-bg border border-dashed border-brand-border space-y-1.5 text-xs">
                        <div className="flex justify-between text-brand-muted">
                          <span>Subtotal</span>
                          <span>{formatRp(subtotal)}</span>
                        </div>
                        {includeTax && (
                          <div className="flex justify-between text-brand-muted">
                            <span>PB1 (10%)</span>
                            <span>{formatRp(taxAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-brand-white font-bold pt-1.5 border-t border-brand-border">
                          <span>ESTIMASI TOTAL</span>
                          <span>{formatRp(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between text-brand-tosca font-bold text-sm pt-1">
                          <span>PATUNGAN / ORANG ({splitCount} ORG)</span>
                          <span>{formatRp(perPersonAmount)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopySplitBill}
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 border border-brand-tosca bg-brand-bg hover:bg-brand-tosca/15 text-brand-tosca text-xs font-bold tracking-widest uppercase transition-colors px-4 py-2.5"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            TERSALIN KE CLIPBOARD!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            SALIN RINCIAN PATUNGAN
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 bg-brand-surface border-t border-brand-border">
                  <a
                    href={whatsappCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-mono font-bold text-xs tracking-widest uppercase px-6 py-3.5 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    KIRIM PESANAN KE WA BARISTA
                  </a>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
