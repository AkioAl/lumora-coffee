'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const stats = [
  {
    value: 10,
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
    value: 2018,
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
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
            className={`
              px-10 py-14 flex flex-col
              ${i < stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-brand-border' : ''}
            `}
          >
            {/* Angka besar */}
            <p className="text-brand-white font-bold text-[64px] lg:text-[80px] leading-none tracking-tight">
              <CountUp target={value} suffix={suffix} />
            </p>

            {/* Label */}
            <p className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mt-3">
              {label}
            </p>

            {/* Divider */}
            <div className="w-8 h-px bg-brand-border mt-5 mb-4" />

            {/* Deskripsi */}
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
