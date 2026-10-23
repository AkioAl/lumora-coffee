import { Program } from '@/types'

export const programs: Program[] = [
  {
    id: 'musikagram',
    name: 'Musikagram',
    description: 'Sesi akustik intim dan kurasi playlist petang di cabang pilihan setiap akhir pekan.',
    schedule: 'Jumat – Sabtu · 19:30 WIB',
    icon: 'music',
  },
  {
    id: 'loyalty',
    name: 'Loyalty Program',
    description: 'Kumpulkan poin setiap transaksi kopi dan tukarkan dengan minuman signature atau merchandise.',
    schedule: 'Berlaku di 10 Cabang',
    icon: 'award',
  },
  {
    id: 'nmr',
    name: 'Netizen Riding (NMR)',
    description: 'Titik kumpul Sunday Morning Ride komunitas roda dua dengan sarapan dan seduhan pagi.',
    schedule: 'Minggu · 07:00 WIB',
    icon: 'compass',
  },
  {
    id: 'live-karaoke',
    name: 'Live Karaoke',
    description: 'Malam sing-along terbuka bersama pengunjung dan barista untuk melepas penat kerja.',
    schedule: 'Rabu & Sabtu · 20:00 WIB',
    icon: 'mic',
  },
  {
    id: 'the-moments',
    name: 'The MOMents',
    description: 'Reservasi area privat untuk perayaan komunitas, diskusi kreatif, dan kumpul kolektif.',
    schedule: 'Reservasi H-3 via WhatsApp',
    icon: 'users',
  },
  {
    id: 'santap-di-rumah',
    name: 'Santap di Rumah',
    description: 'Pemesanan literan kopi susu dan paket makanan hangat yang diantar langsung ke rumahmu.',
    schedule: 'Setiap Hari · 08:00 – 21:00 WIB',
    icon: 'package',
  },
]
