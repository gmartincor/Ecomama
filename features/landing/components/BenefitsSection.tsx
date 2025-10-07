import { Section } from './Section';
import { BenefitItem } from './BenefitItem';

const farmerBenefits = [
  {
    icon: '💰',
    title: 'Mejores precios',
    description: 'Vende tus productos a precio justo sin intermediarios que reduzcan tus márgenes.',
  },
  {
    icon: '👥',
    title: 'Clientes directos',
    description: 'Construye relaciones duraderas con consumidores que valoran tu trabajo.',
  },
  {
    icon: '📊',
    title: 'Gestión simplificada',
    description: 'Administra tus ofertas, pedidos y comunidad desde una única plataforma.',
  },
  {
    icon: '🌍',
    title: 'Impacto local',
    description: 'Fortalece la economía de tu región y reduce la huella de carbono.',
  },
];

const consumerBenefits = [
  {
    icon: '🥬',
    title: 'Productos frescos',
    description: 'Alimentos de temporada, recién cosechados y con máxima calidad nutricional.',
  },
  {
    icon: '🏷️',
    title: 'Precios justos',
    description: 'Paga directamente al agricultor sin sobrecostes de intermediarios.',
  },
  {
    icon: '🔍',
    title: 'Trazabilidad total',
    description: 'Conoce de dónde vienen tus alimentos y quién los produce.',
  },
  {
    icon: '❤️',
    title: 'Apoyo local',
    description: 'Contribuye al desarrollo de tu comunidad y agricultura sostenible.',
  },
];

export const BenefitsSection = () => {
  return (
    <Section className="bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Beneficios para todos
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Una plataforma que crea valor para agricultores y consumidores
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-semibold text-primary">
            <span className="text-lg">🌾</span>
            <span>Para Agricultores</span>
          </div>
          {farmerBenefits.map((benefit) => (
            <BenefitItem key={benefit.title} {...benefit} />
          ))}
        </div>
        
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 text-sm font-semibold text-accent-dark">
            <span className="text-lg">🛒</span>
            <span>Para Consumidores</span>
          </div>
          {consumerBenefits.map((benefit) => (
            <BenefitItem key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </Section>
  );
};
