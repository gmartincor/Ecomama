import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export const Section = ({ children, className, containerClassName, id }: SectionProps) => {
  return (
    <section id={id} className={cn('py-16 md:py-24 lg:py-32', className)}>
      <div className={cn('container mx-auto px-4 md:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
};
