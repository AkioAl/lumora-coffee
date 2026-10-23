'use client'

import { motion } from 'framer-motion'
import { Award, Compass, Mic, Music, Package, Users, ArrowUpRight } from 'lucide-react'
import { programs } from '@/data/programs'
import { brand } from '@/data/brand'
import { Program } from '@/types'
import MusikagramSynth from '@/components/home/MusikagramSynth'
import NetizenPassport from '@/components/home/NetizenPassport'

const iconMap: Record<Program['icon'], React.ElementType> = {
  music: Music,
  award: Award,
  compass: Compass,
  mic: Mic,
  users: Users,
  package: Package,
}

export default function ProgramSection() {
  return (
    <section
      id="program"
      className="bg-brand-surface border-t border-b border-brand-border px-6 sm:px-8 lg:px-16 py-16 sm:py-20 scroll-mt-[65px]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2
            className="text-brand-white font-bold tracking-tight leading-none uppercase"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            PROGRAM <span className="text-brand-tosca">KOMUNITAS.</span>
          </h2>
          <p className="text-brand-muted text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
            Lebih dari tempat kerja dan menyeduh kopi—ruang kolaborasi rutin untuk musisi, pengendara, dan kolektif kreatif di setiap kota.
          </p>
        </div>

        <a
          href={`${brand.socialLinks.whatsapp}?text=${encodeURIComponent('Halo Lumora Coffee, saya ingin tanya jadwal dan kolaborasi Program Komunitas.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] gap-2 border border-brand-border hover:border-brand-tosca text-brand-white hover:text-brand-tosca px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors self-start md:self-auto"
        >
          KOLABORASI ACARA
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((prog, i) => {
          const Icon = iconMap[prog.icon]
          return (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex flex-col justify-between p-6 bg-brand-bg border border-brand-border hover:border-brand-tosca transition-colors duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase bg-brand-surface border border-brand-border px-2.5 py-1">
                    {prog.schedule}
                  </span>
                  <Icon className="w-4 h-4 text-brand-tosca shrink-0" />
                </div>

                <h3 className="text-brand-white font-bold text-lg tracking-wide uppercase">
                  {prog.name}
                </h3>
                <p className="text-brand-muted text-sm mt-2 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">
                  0{i + 1} / RUMAHNYA NETIZEN
                </span>
                <a
                  href={`${brand.socialLinks.whatsapp}?text=${encodeURIComponent(`Halo Lumora Coffee, saya tertarik dengan program ${prog.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] px-2 -mr-2 text-brand-tosca hover:text-brand-toscaLight text-xs font-bold tracking-widest uppercase"
                >
                  INFO JADWAL
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <MusikagramSynth />
        <NetizenPassport />
      </div>
    </section>
  )
}
