'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Camera, Play, Tv, ArrowUpRight, MapPin } from 'lucide-react'
import { brand } from '@/data/brand'
import { locations } from '@/data/locations'
import ConciergeDesk from '@/components/contact/ConciergeDesk'

const hqBranch = locations.find((l) => l.area === 'HQ') ?? locations[0]

const contactItems = [
  {
    platform: 'WHATSAPP',
    desc: 'Customer Care & Reservasi',
    value: brand.whatsappDisplay,
    href: brand.socialLinks.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    platform: 'EMAIL',
    desc: 'Business & Partnership',
    value: brand.emailAddress,
    href: brand.socialLinks.email,
    icon: Mail,
    external: false,
  },
  {
    platform: 'INSTAGRAM',
    desc: 'Komunitas & Info Acara',
    value: brand.instagramHandle,
    href: brand.socialLinks.instagram,
    icon: Camera,
    external: true,
  },
  {
    platform: 'ALAMAT HQ',
    desc: 'Kunjungi Cabang Pusat',
    value: `${hqBranch.name}, ${hqBranch.city}`,
    href: `https://www.google.com/maps/search/?api=1&query=${hqBranch.lat},${hqBranch.lng}`,
    icon: MapPin,
    external: true,
  },
]

const socials = [
  { label: 'Instagram', icon: Camera,        href: brand.socialLinks.instagram },
  { label: 'TikTok',    icon: Play,          href: brand.socialLinks.tiktok },
  { label: 'YouTube',   icon: Tv,            href: brand.socialLinks.youtube },
  { label: 'WhatsApp',  icon: MessageCircle, href: brand.socialLinks.whatsapp },
  { label: 'Email',     icon: Mail,          href: brand.socialLinks.email },
]

export default function ContactClient() {
  return (
    <div className="min-h-screen bg-brand-bg pt-[65px]">
      <div className="relative overflow-hidden flex flex-col justify-end px-6 sm:px-8 lg:px-16 pb-14 sm:pb-16 min-h-[52vh]">
        <Image
          src="/images/hero/hero-kopi.jpg"
          alt="Hubungi Lumora Coffee"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.65) 60%, rgba(5,5,5,0.35) 100%)',
          }}
        />

        <div className="relative z-10 pt-16">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-brand-muted text-xs font-mono tracking-widest">
              <li>
                <Link href="/" className="hover:text-brand-white transition-colors">
                  HOME
                </Link>
              </li>
              <li className="text-brand-border">/</li>
              <li className="text-brand-tosca">CONTACT</li>
            </ol>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-brand-white font-bold tracking-tight uppercase leading-none"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
          >
            LET&apos;S<br />
            <span className="text-brand-tosca">CONNECT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-brand-muted text-sm sm:text-base mt-4 max-w-sm leading-relaxed"
          >
            Ada pertanyaan, reservasi komunitas, atau ingin kolaborasi acara? Tim kami siap ngobrol.
          </motion.p>
        </div>
      </div>

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
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 lg:px-16 py-6 sm:py-8 border-b border-brand-border hover:bg-brand-tosca/5 transition-all duration-300"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 border border-brand-border group-hover:border-brand-tosca flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-muted group-hover:text-brand-tosca transition-colors duration-300" />
              </div>
              <div>
                <p className="text-brand-muted text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
                  {desc}
                </p>
                <p className="text-brand-white font-bold text-xs tracking-widest uppercase">
                  {platform}
                </p>
                <p className="text-brand-tosca font-mono font-bold text-sm mt-1 sm:hidden">
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 pl-16 sm:pl-0">
              <p className="text-brand-white font-mono font-bold text-base lg:text-xl group-hover:text-brand-tosca transition-colors duration-300 hidden sm:block">
                {value}
              </p>
              <ArrowUpRight className="w-4 h-4 text-brand-muted group-hover:text-brand-tosca transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 hidden sm:block" />
            </div>
          </motion.a>
        ))}
      </div>

      <ConciergeDesk />

      <div className="px-6 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-brand-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-brand-white font-bold tracking-tight leading-none uppercase"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
            >
              LAHIR DARI<br />
              <span className="text-brand-tosca">KERESAHAN.</span>
            </h2>
            <div className="w-8 h-px bg-brand-border mt-6 mb-6" />
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
              Lumora Coffee lahir dari keresahan anak muda yang butuh tempat nyaman untuk kerja,
              ngopi, dan berbagi cerita—tanpa harus merogoh kocek terlalu dalam.
            </p>
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed mt-4">
              Sejak {brand.foundedYear}, kami tumbuh dari satu kedai di Tomang menjadi{' '}
              {brand.totalBranches} cabang yang tersebar dari Jakarta hingga Surabaya. Setiap cabang
              dirancang dengan satu misi: menjadi rumahnya netizen.
            </p>
            <p className="text-brand-tosca font-mono font-bold text-xs sm:text-sm mt-6 tracking-widest">
              {brand.hashtags.join('  ·  ')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-1"
          >
            {[
              { num: `${brand.totalBranches}+`, label: 'Cabang Aktif' },
              { num: String(brand.foundedYear), label: 'Tahun Berdiri' },
              { num: '5K+', label: 'Cups / Week' },
              { num: '7', label: 'Kota di Indonesia' },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="flex items-center justify-between py-5 border-b border-brand-border"
              >
                <span className="text-brand-muted text-xs sm:text-sm font-mono tracking-widest uppercase">
                  {label}
                </span>
                <span className="text-brand-white font-mono font-bold text-2xl">
                  {num}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <p className="text-brand-muted text-xs font-mono font-bold tracking-widest uppercase mb-5">
          KANAL SOSIAL RESMI
        </p>
        <div className="flex flex-wrap gap-3">
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
