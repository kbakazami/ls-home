import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturedSection from '@/components/sections/FeaturedSection'
import CtaSection from '@/components/sections/CtaSection'
import FadeInOnScroll from '@/components/ui/FadeInOnScroll'
import { getFeaturedProperties } from '@/lib/properties'
import { getOccupancyLabels } from '@/lib/property-types'

// Lecture directe de la base à chaque requête : une modification en
// administration est visible immédiatement, sans redéploiement.
export const dynamic = 'force-dynamic'

export default async function Home() {
  const [featured, occupancyLabels] = await Promise.all([
    getFeaturedProperties(),
    getOccupancyLabels(),
  ])

  return (
    <>
      <HeroSection />
      <FadeInOnScroll>
        <StatsSection />
      </FadeInOnScroll>
      {featured.length > 0 && (
        <FadeInOnScroll>
          <FeaturedSection
            properties={featured}
            occupancyLabels={occupancyLabels}
          />
        </FadeInOnScroll>
      )}
      <FadeInOnScroll>
        <CtaSection />
      </FadeInOnScroll>
    </>
  )
}
