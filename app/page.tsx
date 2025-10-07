import {
  LandingNav,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  HowItWorksSection,
  CTASection,
} from '@/features/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
