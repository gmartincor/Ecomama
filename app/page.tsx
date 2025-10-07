import {
  LandingNav,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  HowItWorksSection,
  CTASection,
} from '@/features/landing';
import { PWARegister } from '@/features/pwa';

export default function Home() {
  return (
    <main className="min-h-screen">
      <PWARegister />
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
