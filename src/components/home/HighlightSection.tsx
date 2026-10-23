'use client'

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { brand } from '@/data/brand'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !isInView) return

    if (prefersReducedMotion) {
      node.textContent = `${target}${suffix}`
      return
    }

    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate(value) {
        node.textContent = `${Math.round(value)}${suffix}`
      },
    })

    return () => controls.stop()
  }, [isInView, prefersReducedMotion, suffix, target])

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  )
}

const stats = [
  {
    value: brand.totalBranches,
    suffix: '+',
    label: 'Cabang',
    desc: 'Dari Jakarta, Depok, Bogor, Bekasi, Tangerang, Bandung, Semarang, hingga Surabaya.',
  },
  {
    value: 5000,
    suffix: '+',
    label: 'Cups / Week',
    desc: 'Ribuan orang memilih Lumora Coffee setiap minggunya sebagai tempat kerja dan ngopi favorit.',
  },
  {
    value: brand.foundedYear,
    suffix: '',
    label: 'Est.',
    desc: 'Berdiri sejak 2018, Lumora Coffee terus tumbuh menjadi rumah bagi para Netizen Indonesia.',
  },
]

export default function HighlightSection() {
  return (
    <section className="bg-brand-surface border-t border-b border-brand-border">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {stats.map(({ value, suffix, label, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
            className={`
              px-6 sm:px-10 py-10 sm:py-14 flex flex-col
              ${i < stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-brand-border' : ''}
            `}
          >
            <p
              className="text-brand-white font-bold leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
            >
              <CountUp target={value} suffix={suffix} />
            </p>

            <p className="text-brand-tosca text-xs font-mono font-bold tracking-[0.25em] uppercase mt-3">
              {label}
            </p>

            <div className="w-8 h-px bg-brand-border mt-4 mb-3" />

            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
