import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <div className="relative bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
        <div className="text-4xl md:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
