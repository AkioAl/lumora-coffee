import Link from 'next/link'
import { Camera, Play, MessageCircle, Mail } from 'lucide-react'
import { brand } from '@/data/brand'
import { programs } from '@/data/programs'

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Menu',      href: '/menu' },
  { label: 'Locations', href: '/locations' },
  { label: 'Program',   href: '/#program' },
  { label: 'Contact',   href: '/contact' },
]

const socials = [
  { icon: Camera,        href: brand.socialLinks.instagram, label: 'Instagram' },
  { icon: Play,          href: brand.socialLinks.youtube,   label: 'YouTube' },
  { icon: MessageCircle, href: brand.socialLinks.whatsapp,  label: 'WhatsApp' },
  { icon: Mail,          href: brand.socialLinks.email,     label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="text-brand-white font-bold tracking-widest text-base">
              LUMORA COFFEE
            </span>
            <p className="text-brand-muted text-sm mt-2 leading-relaxed max-w-xs">
              {brand.subTagline}
            </p>
            <p className="text-brand-muted text-xs font-mono mt-3">
              Customer Care: {brand.whatsappDisplay}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {brand.hashtags.map((tag) => (
                <span key={tag} className="text-brand-tosca text-xs font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-brand-white text-xs font-bold tracking-widest mb-3 uppercase">
              Navigasi
            </p>
            <ul className="flex flex-col">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center min-h-[44px] text-brand-muted text-sm hover:text-brand-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-brand-white text-xs font-bold tracking-widest mb-3 uppercase">
              Program Komunitas
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {programs.map((prog) => (
                <li key={prog.id}>
                  <Link
                    href="/#program"
                    className="inline-flex items-center min-h-[44px] text-brand-muted text-sm hover:text-brand-tosca transition-colors duration-200"
                  >
                    {prog.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs">
            © {new Date().getFullYear()} Lumora Coffee. Berdiri sejak {brand.foundedYear}.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="w-11 h-11 inline-flex items-center justify-center border border-brand-border text-brand-muted hover:text-brand-tosca hover:border-brand-tosca transition-colors duration-200"
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
