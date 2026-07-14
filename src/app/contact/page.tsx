'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Camera, Play, Tv, ArrowUpRight } from 'lucide-react'
import { brand } from '@/data/brand'

const contactItems = [
  {
    platform: 'WHATSAPP',
    desc: 'Customer Care',
    value: '0812 3456 7890',
    href: brand.socialLinks.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    platform: 'EMAIL',
    desc: 'Business Inquiry',
    value: 'hello@lumoracoffee.id',
    href: 'mailto:hello@lumoracoffee.id',
    icon: Mail,
    external: false,
  },
  {
    platform: 'INSTAGRAM',
    desc: 'Follow & DM Us',
    value: '@lumoracoffee.id',
    href: 'https://www.instagram.com/lumoracoffee.id',
    icon: Camera,
    external: true,
  },
]

const socials = [
  { label: 'Instagram', icon: Camera, href: 'https://www.instagram.com/lumoracoffee.id' },
  { label: 'TikTok',    icon: Play,   href: 'https://www.tiktok.com/@lumoracoffee.id' },
  { label: 'YouTube',   icon: Tv,     href: 'https://youtube.com/@lumoracoffee' },
  { label: 'WhatsApp',  icon: MessageCircle, href: brand.socialLinks.whatsapp },
  { label: 'Email',     icon: Mail,   href: 'mailto:hello@lumoracoffee.id' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">

      {/* ── Hero Header fullscreen ───────────────────── */}
      <div
        className="relative overflow-hidden flex flex-col justify-end px-8 lg:px-16 pb-16"
        style={{
          minHeight: '60vh',
          backgroundImage: 'url(/images/hero/hero-kopi.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.3) 100%)' }}
        />

        <div className="relative z-10">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-brand-muted text-xs tracking-widest">
              <li><Link href="/" className="hover:text-brand-white transition-colors">HOME</Link></li>
              <li className="text-brand-border">/</li>
              <li className="text-brand-white">CONTACT</li>
            </ol>
          </nav>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mb-4"
          >
            HUBUNGI KAMI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-white font-bold text-5xl lg:text-8xl tracking-tight uppercase leading-none"
          >
            LET&apos;S<br />
            <span className="text-brand-tosca">CONNECT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-brand-muted text-base mt-5 max-w-sm"
          >
            Ada pertanyaan atau ingin kerja sama? Kita siap ngobrol.
          </motion.p>
        </div>
      </div>

      {/* ── Contact Rows ────────────────────────────── */}
      <div className="border-t border-brand-border">
        {contactItems.map(({ platform, desc, value, href, icon: Icon, external }, i) => (
          <motion.a
            key={platform}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex items-center justify-between px-8 lg:px-16 py-8 border-b border-brand-border hover:bg-brand-tosca/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 border border-brand-border group-hover:border-brand-tosca flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-muted group-hover:text-brand-tosca transition-colors duration-300" />
              </div>
              <div>
                <p className="text-brand-muted text-[10px] font-bold tracking-[0.35em] uppercase mb-1">{desc}</p>
                <p className="text-brand-white font-bold text-xs tracking-widest uppercase">{platform}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-brand-white font-bold text-base lg:text-xl group-hover:text-brand-tosca transition-colors duration-300 hidden sm:block">
                {value}
              </p>
              <ArrowUpRight className="w-4 h-4 text-brand-muted group-hover:text-brand-tosca transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* ── Our Story Section ───────────────────────── */}
      <div className="px-8 lg:px-16 py-20 border-b border-brand-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-brand-tosca text-xs font-bold tracking-[0.35em] uppercase mb-5">
              OUR STORY
            </p>
            <h2 className="text-brand-white font-bold text-4xl lg:text-5xl tracking-tight leading-none uppercase">
              LAHIR DARI<br />
              <span className="text-brand-tosca">KERESAHAN.</span>
            </h2>
            <div className="w-8 h-px bg-brand-border mt-6 mb-6" />
            <p className="text-brand-muted text-base leading-relaxed">
              Lumora Coffee lahir dari keresahan anak muda yang butuh tempat nyaman untuk kerja,
              ngopi, dan berbagi cerita — tanpa harus merogoh kocek terlalu dalam.
            </p>
            <p className="text-brand-muted text-base leading-relaxed mt-4">
              Sejak 2018, kami tumbuh dari satu kedai kecil di Tomang menjadi 10 cabang
              yang tersebar dari Jakarta hingga Surabaya. Setiap cabang kami desain dengan
              satu misi: jadi rumahnya netizen.
            </p>
            <p className="text-brand-tosca font-bold text-sm mt-6 tracking-widest">
              #RumahnyaNetizen
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-1"
          >
            {[
              { num: '10+', label: 'Cabang Aktif' },
              { num: '2018', label: 'Tahun Berdiri' },
              { num: '5K+', label: 'Cups / Week' },
              { num: '7', label: 'Kota di Indonesia' },
            ].map(({ num, label }) => (
              <div key={label} className="flex items-center justify-between py-5 border-b border-brand-border">
                <span className="text-brand-muted text-sm tracking-widest uppercase">{label}</span>
                <span className="text-brand-white font-bold text-2xl">{num}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Follow Us ────────────────────────────────── */}
      <div className="px-8 lg:px-16 py-12">
        <p className="text-brand-muted text-[10px] font-bold tracking-[0.35em] uppercase mb-6">
          FOLLOW US
        </p>
        <div className="flex flex-wrap gap-3">
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-12 h-12 flex items-center justify-center border border-brand-border hover:border-brand-tosca text-brand-muted hover:text-brand-tosca transition-all duration-200"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}

