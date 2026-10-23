import HeroSection from '@/components/home/HeroSection'
import FeaturedDrinkSection from '@/components/home/FeaturedDrinkSection'
import HighlightSection from '@/components/home/HighlightSection'
import BestSellerSection from '@/components/home/BestSellerSection'
import BranchSection from '@/components/home/BranchSection'
import ProgramSection from '@/components/home/ProgramSection'
import { brand } from '@/data/brand'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedDrinkSection />
      <HighlightSection />
      <BestSellerSection />
      <BranchSection />
      <ProgramSection />

      <section className="bg-brand-tosca py-4 overflow-hidden" aria-label="Hashtag komunitas Lumora">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-brand-bg font-mono font-bold text-xs sm:text-sm tracking-widest shrink-0">
              {brand.hashtags.join('  •  ')} &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
