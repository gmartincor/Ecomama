import { useTranslations } from 'next-intl';
import Navigation from '@/components/Navigation';

export default function Home() {
  const t = useTranslations('home');

  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm lg:flex">
        <div className="text-center">
          <h1 className="font-heading text-6xl font-bold text-primary-600 mb-4">
            🌱 {t('title')}
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📍 {t('marketplace.title')}</h3>
              <p className="text-gray-600">
                {t('marketplace.description')}
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📅 {t('events.title')}</h3>
              <p className="text-gray-600">
                {t('events.description')}
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💬 {t('community.title')}</h3>
              <p className="text-gray-600">
                {t('community.description')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>{t('status.phase')} ✅</p>
            <p className="mt-2">{t('status.next')}</p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
