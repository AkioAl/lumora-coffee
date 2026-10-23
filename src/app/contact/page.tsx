import type { Metadata } from 'next'
import ContactClient from '@/components/contact/ContactClient'

export const metadata: Metadata = {
  title: 'Contact & Story — Lumora Coffee',
  description:
    'Hubungi Customer Care Lumora Coffee via WhatsApp, Email, atau Instagram untuk reservasi meja, kerja sama, dan informasi program komunitas.',
}

export default function ContactPage() {
  return <ContactClient />
}

