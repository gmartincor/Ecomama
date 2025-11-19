import { Section } from './Section';
import { StepCard } from './StepCard';

const steps = [
  {
    step: 1,
    icon: '📝',
    title: 'Regístrate gratis',
    description: 'Crea tu cuenta como agricultor o consumidor en menos de 2 minutos.',
  },
  {
    step: 2,
    icon: '📢',
    title: 'Publica o busca',
    description: 'Ofrece tus productos o publica lo que necesitas comprar.',
  },
  {
    step: 3,
    icon: '🤝',
    title: 'Conecta y comercia',
    description: 'Contacta directamente y acuerda entregas o recogidas.',
  },
];

export const HowItWorksSection = () => {
  return (
    <Section className="bg-background">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Empieza en 3 pasos simples
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Unirse a la revolución del comercio directo es fácil y rápido
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
        {steps.map((step) => (
          <StepCard key={step.step} {...step} />
        ))}
      </div>
    </Section>
  );
};
