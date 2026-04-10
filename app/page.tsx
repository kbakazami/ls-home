import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturedSection from '@/components/sections/FeaturedSection'
import CtaSection from '@/components/sections/CtaSection'
import FadeInOnScroll from '@/components/ui/FadeInOnScroll'
import properties from '@/data/properties.json'
import type { Property } from '@/types/property'

export default function Home() {
  const featured = (properties as Property[]).filter((p) => p.featured)

  return (
    <>
      <HeroSection />
      <FadeInOnScroll>
        <StatsSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FeaturedSection properties={featured} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <CtaSection />
      </FadeInOnScroll>
    </>
  )
}
