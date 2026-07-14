import Link from 'next/link'
import { Camera, Play, MessageCircle } from 'lucide-react'
import { brand } from '@/data/brand'

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Menu',      href: '/menu' },
  { label: 'Locations', href: '/locations' },
  { label: 'Program',   href: '#program' },
  { label: 'Contact',   href: '/contact' },
]

const programs = [
  'Musikagram',
  'Loyalty Program',
  'NMR (Netizen Manggung)',
  'Live Karaoke',
  'The MOMents',
  'Santap di Rumah',
]

const info = [
  { label: 'Privacy Policy',    href: '#' },
  { label: 'Terms & Conditions', href: '#' },
]

const socials = [
  { icon: Camera,         href: 'https://www.instagram.com/lumoracoffee.id',    label: 'Instagram' },
  { icon: Play,           href: 'https://www.youtube.com/@lumoracoffee',      label: 'YouTube' },
  { icon: MessageCircle,  href: brand.socialLinks.whatsapp,              label: 'WhatsApp' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="px-8 py-12">

        {/* ── 4-col grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Kolom 1 — Brand */}
          <div>
            <span className="text-brand-white font-bold tracking-widest text-base">
              LUMORA COFFEE
            </span>
            <p className="text-brand-muted text-sm mt-2">
              Rumahnya Netizen.
            </p>
            <p className="text-brand-muted text-xs mt-1">
              Your New Normal Comfort Place.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-brand-tosca text-xs">#RumahnyaNetizen</span>
              <span className="text-brand-tosca text-xs">#OOTDdiLumora</span>
            </div>
          </div>

          {/* Kolom 2 — Navigasi */}
          <div>
            <p className="text-brand-white text-xs font-bold tracking-widest mb-4">
              NAVIGASI
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-brand-muted text-sm hover:text-brand-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Program */}
          <div>
            <p className="text-brand-white text-xs font-bold tracking-widest mb-4">
              PROGRAM
            </p>
            <ul className="flex flex-col gap-2">
              {programs.map((name) => (
                <li
                  key={name}
                  className="text-brand-muted text-sm"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — Info */}
          <div>
            <p className="text-brand-white text-xs font-bold tracking-widest mb-4">
              INFO
            </p>
            <ul className="flex flex-col gap-2">
              {info.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-brand-muted text-sm hover:text-brand-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs">
            © 2024 Lumora Coffee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-brand-muted hover:text-brand-tosca transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
