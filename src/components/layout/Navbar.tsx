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
  { label: 'PROGRAM',   href: '#program' },
  { label: 'CONTACT',   href: '/contact' },
]

const WHATSAPP_URL = brand.socialLinks.whatsapp

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-8 py-4
          transition-all duration-300
          ${scrolled
            ? 'bg-brand-surface/95 backdrop-blur-md border-b border-brand-border shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <Link
          href="/"
          className="text-brand-white font-bold text-lg tracking-widest hover:text-brand-tosca transition-colors duration-200 shrink-0"
        >
          LUMORA COFFEE
        </Link>

        {/* ── Desktop nav links ─────────────────────────── */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive = href !== '#program' && (
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            )
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`
                    text-sm tracking-wider font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'text-brand-white'
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

        {/* ── Desktop CTA + Mobile hamburger ────────────── */}
        <div className="flex items-center gap-3">
          {/* WhatsApp CTA — desktop only */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:inline-flex items-center gap-2
              bg-brand-tosca hover:bg-brand-toscaLight
              text-white text-sm font-semibold
              px-4 py-2
              rounded-none
              transition-colors duration-200
              tracking-wide
            "
          >
            <MessageCircle className="w-4 h-4" />
            WHATSAPP
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle menu"
            className="md:hidden text-brand-white p-1"
          >
            {mobileOpen
              ? <X className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ──────────────────────── */}
      <div
        className={`
          fixed top-[65px] left-0 right-0 z-40
          bg-brand-surface/98 backdrop-blur-md
          border-b border-brand-border
          flex flex-col
          overflow-hidden
          transition-all duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <ul className="flex flex-col px-8 py-4 gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = href !== '#program' && (
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            )
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`
                    block py-3 text-sm tracking-wider font-medium
                    border-b border-brand-border/50
                    transition-colors duration-200
                    ${isActive
                      ? 'text-brand-white'
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

        {/* WhatsApp — mobile */}
        <div className="px-8 pb-6 pt-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              bg-brand-tosca hover:bg-brand-toscaLight
              text-white text-sm font-semibold
              px-4 py-3 w-full
              rounded-none
              transition-colors duration-200
              tracking-wide
            "
          >
            <MessageCircle className="w-4 h-4" />
            WHATSAPP
          </a>
        </div>
      </div>
    </>
  )
}
