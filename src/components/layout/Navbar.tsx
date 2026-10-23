'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Menu, X } from 'lucide-react'
import { brand } from '@/data/brand'

const navLinks = [
  { label: 'HOME',      href: '/' },
  { label: 'MENU',      href: '/menu' },
  { label: 'LOCATIONS', href: '/locations' },
  { label: 'PROGRAM',   href: '/#program' },
  { label: 'CONTACT',   href: '/contact' },
]

const WHATSAPP_URL = brand.socialLinks.whatsapp

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-6 sm:px-8 lg:px-16 min-h-[65px] py-3
          transition-all duration-300
          ${scrolled
            ? 'bg-brand-surface/95 backdrop-blur-md border-b border-brand-border'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        <Link
          href="/"
          className="text-brand-white font-bold text-base sm:text-lg tracking-widest hover:text-brand-tosca transition-colors duration-200 shrink-0 py-2"
        >
          LUMORA COFFEE
        </Link>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href !== '/#program' &&
              (href === '/' ? pathname === '/' : pathname.startsWith(href))
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`
                    inline-flex items-center min-h-[44px] px-1
                    text-sm tracking-wider font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'text-brand-tosca'
                      : 'text-brand-muted hover:text-brand-white'
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:inline-flex items-center gap-2
              min-h-[44px] px-5 py-2.5
              bg-brand-tosca hover:bg-brand-toscaLight
              text-brand-bg text-xs font-bold
              rounded-none
              transition-colors duration-200
              tracking-widest uppercase
            "
          >
            <MessageCircle className="w-4 h-4" />
            WHATSAPP
          </a>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-3 py-2 border border-brand-border text-brand-white hover:border-brand-tosca transition-colors"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              {mobileOpen ? 'CLOSE' : 'MENU'}
            </span>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed top-[65px] left-0 right-0 z-40
          bg-brand-surface/98 backdrop-blur-md
          border-b border-brand-border
          flex flex-col
          overflow-hidden
          transition-all duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? 'max-h-[440px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <ul className="flex flex-col px-6 sm:px-8 py-3 gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href !== '/#program' &&
              (href === '/' ? pathname === '/' : pathname.startsWith(href))
            return (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center min-h-[44px] py-3 text-sm tracking-wider font-medium
                    border-b border-brand-border/50
                    transition-colors duration-200
                    ${isActive
                      ? 'text-brand-tosca'
                      : 'text-brand-muted hover:text-brand-white'
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="px-6 sm:px-8 pb-6 pt-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              min-h-[44px]
              bg-brand-tosca hover:bg-brand-toscaLight
              text-brand-bg text-xs font-bold
              px-4 py-3 w-full
              rounded-none
              transition-colors duration-200
              tracking-widest uppercase
            "
          >
            <MessageCircle className="w-4 h-4" />
            WHATSAPP ({brand.whatsappDisplay})
          </a>
        </div>
      </div>
    </>
  )
}
