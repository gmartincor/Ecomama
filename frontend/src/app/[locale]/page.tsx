import { useTranslations } from 'next-intl';
import { Navigation, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function HeroSection({ t }: { t: (key: string) => string }) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-4xl sm:text-5xl md:text-6xl">🌱</span>{' '}
          {t('title')}
        </h1>
        <p className="text-xl sm:text-2xl text-foreground">
          {t('subtitle')}
        </p>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>
    </div>
  );
}

function FeaturesSection({ t }: { t: (key: string) => string }) {
  const features = [
    { icon: '📍', key: 'marketplace' },
    { icon: '📅', key: 'events' },
    { icon: '💬', key: 'community' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {features.map(({ icon, key }) => (
        <FeatureCard
          key={key}
          icon={icon}
          title={t(`${key}.title`)}
          description={t(`${key}.description`)}
        />
      ))}
    </div>
  );
}

function StatusSection({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{t('status.phase')}</Badge>
        <span className="text-xl">✅</span>
      </div>
      <p className="text-center">{t('status.next')}</p>
    </div>
  );
}

export default function Home() {
  const t = useTranslations('home');

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="flex flex-col items-center gap-12 max-w-6xl mx-auto">
          <HeroSection t={t} />
          <FeaturesSection t={t} />
          <StatusSection t={t} />
        </div>
      </main>
    </>
  );
}
