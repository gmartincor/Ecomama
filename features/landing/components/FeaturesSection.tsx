import { Section } from './Section';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: '🏘️',
    title: 'Comunidades Locales',
    description: 'Únete a comunidades de tu zona donde agricultores y consumidores comparten los mismos valores de sostenibilidad y alimentación saludable.',
  },
  {
    icon: '🌾',
    title: 'Productos Ecológicos',
    description: 'Accede a una amplia variedad de productos orgánicos certificados, cultivados con prácticas sostenibles y respetuosas con el medio ambiente.',
  },
  {
    icon: '🤝',
    title: 'Comercio Directo',
    description: 'Elimina intermediarios y conecta directamente con agricultores. Precios justos para productores y consumidores.',
  },
  {
    icon: '📍',
    title: 'Proximidad Garantizada',
    description: 'Encuentra productos de temporada en tu área local. Reduce tu huella de carbono comprando de kilómetro cero.',
  },
  {
    icon: '🎯',
    title: 'Ofertas y Demandas',
    description: 'Publica lo que necesitas o lo que tienes disponible. Sistema inteligente de matching entre agricultores y consumidores.',
  },
  {
    icon: '📅',
    title: 'Eventos y Encuentros',
    description: 'Participa en ferias, mercados y eventos de tu comunidad. Conoce a tus agricultores y aprende sobre alimentación sostenible.',
  },
];

export const FeaturesSection = () => {
  return (
    <Section className="bg-background">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          ¿Cómo funciona Ecomama?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Una plataforma completa para conectar el campo con tu mesa
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  );
};
