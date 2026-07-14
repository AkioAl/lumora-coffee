'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function FeaturedDrinkSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="bg-brand-bg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* Kolom kiri — foto sinematik */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative bg-brand-surface min-h-[60vh] lg:min-h-full overflow-hidden"
        >
          {!imgError ? (
            <Image
              src="/images/menu/KOPI/SeaSaltLatte.png"
              alt="Sea Salt Latte Lumora Signature"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-surface">
              <span className="text-brand-muted text-xs tracking-widest">SEA SALT LATTE</span>
            </div>
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 50%)' }}
          />
          <div className="absolute bottom-6 left-6 z-10">
            <span className="text-brand-tosca text-[10px] font-bold tracking-[0.3em] uppercase">
              Best Seller · Signature
            </span>
          </div>
        </motion.div>

        {/* Kolom kanan — teks sinematik */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-brand-surface relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 font-bold leading-none select-none pointer-events-none"
            style={{
              fontSize: '220px',
              color: 'rgba(42,157,143,0.04)',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            01
          </div>

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mb-6"
            >
              SIGNATURE DRINK
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-brand-white font-bold leading-none tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              SEA SALT<br />
              <span className="text-brand-tosca">LATTE.</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="w-12 h-px bg-brand-tosca my-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-brand-muted text-base leading-relaxed max-w-xs"
            >
              Perpaduan espresso bold, susu segar, dan sea salt cream yang creamy.
              Rasa yang membuat kamu selalu kembali lagi.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="text-brand-white font-bold text-3xl mt-6"
            >
              Rp 38.000
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="mt-8"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg font-bold px-8 py-4 transition-colors duration-200 text-sm tracking-widest uppercase"
              >
                LIHAT SEMUA MENU
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
