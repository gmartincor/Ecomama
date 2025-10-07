import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 text-sm font-medium text-primary">
            <span>Conectando agricultores con consumidores</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Productos ecológicos
            <span className="block text-primary mt-2">directamente del agricultor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a comunidades locales donde agricultores y consumidores se conectan para el comercio directo de productos orgánicos, sin intermediarios y con precios justos para todos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Iniciar sesión
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '100%', label: 'Orgánico' },
              { value: '0%', label: 'Comisión' },
              { value: 'Local', label: 'Comunidades' },
              { value: 'Directo', label: 'Del agricultor' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
