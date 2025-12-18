import HeroSection from '@/components/landing/HeroSection';
import WhyUsSection from '@/components/landing/WhyUsSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import NumbersSection from '@/components/landing/NumbersSection';
import HowEasySection from '@/components/landing/HowEasySection';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <NumbersSection />
      <WhyUsSection />
      <BenefitsSection />
      <HowEasySection />

      {/* Simple Footer */}
      <footer className="py-12 bg-surface border-t border-border">
        <div className="container mx-auto px-4 text-center text-foreground/50">
          <h4 className="text-2xl font-bold text-blood-red mb-4">WaMate</h4>
          <p>© {new Date().getFullYear()} WaMate. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
