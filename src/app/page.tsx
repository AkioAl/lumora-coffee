import HeroSection from '@/components/home/HeroSection'
import FeaturedDrinkSection from '@/components/home/FeaturedDrinkSection'
import HighlightSection from '@/components/home/HighlightSection'
import BestSellerSection from '@/components/home/BestSellerSection'
import BranchSection from '@/components/home/BranchSection'

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero — Parallax + Stats + Scroll Indicator */}
      <HeroSection />

      {/* 2. Featured Drink — Sinematik 2 kolom */}
      <FeaturedDrinkSection />

      {/* 3. Numbers — Count-up stats besar */}
      <HighlightSection />

      {/* 4. Best Seller — Horizontal card carousel */}
      <BestSellerSection />

      {/* 5. Branch — 3 foto landscape hover overlay */}
      <BranchSection />

      {/* 6. Hashtag Ticker */}
      <section className="bg-brand-tosca py-4 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="text-brand-bg font-bold text-sm tracking-widest shrink-0">
              #LUMORACOFFEE &nbsp;•&nbsp; #RUMAHNYANETIZEN &nbsp;•&nbsp; #OOTDLUMORA &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
