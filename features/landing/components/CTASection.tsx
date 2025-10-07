import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const CTASection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary/90 py-20 md:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_20s_linear_infinite]" />
      
      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl md:text-7xl mb-6">🌱</div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Únete a la comunidad Ecomama
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Forma parte del cambio hacia una alimentación más sostenible, local y justa. 
            Comienza tu viaje hoy mismo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto min-w-[200px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto min-w-[200px] text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Sin comisiones</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Registro en 2 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
