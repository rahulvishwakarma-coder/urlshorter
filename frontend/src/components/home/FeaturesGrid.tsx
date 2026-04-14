import { Zap, Shield, BarChart3 } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';

export function FeaturesGrid() {
  return (
    <section className="features-grid">
      <FeatureCard
        icon={<Zap />}
        title="Lightning Fast"
        desc="Our infrastructure ensures your redirects are as fast as a blink of an eye."
      />
      <FeatureCard
        icon={<Shield />}
        title="Secure & Reliable"
        desc="Every link is checked for security and we guarantee 99.9% uptime for your links."
      />
      <FeatureCard
        icon={<BarChart3 />}
        title="Advanced Analytics"
        desc="Track clicks, geographic data, and referrers for all your shortened links."
      />
    </section>
  );
}