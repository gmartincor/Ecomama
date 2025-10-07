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
    icon: '🔍',
    title: 'Encuentra tu comunidad',
    description: 'Únete a comunidades locales cerca de ti o crea la tuya propia.',
  },
  {
    step: 3,
    icon: '📢',
    title: 'Publica o busca',
    description: 'Ofrece tus productos o publica lo que necesitas comprar.',
  },
  {
    step: 4,
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
          Empieza en 4 pasos simples
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Unirse a la revolución del comercio directo es fácil y rápido
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {steps.map((step) => (
          <StepCard key={step.step} {...step} />
        ))}
      </div>
      
      <div className="mt-16 flex justify-center">
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-muted-foreground">
                Nuestra comunidad está aquí para apoyarte. Encuentra guías, tutoriales y personas dispuestas a ayudarte en cada paso del camino.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
