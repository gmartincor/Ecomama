interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const StepCard = ({ step, title, description, icon }: StepCardProps) => {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-3xl shadow-lg">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold text-secondary-foreground shadow-md">
            {step}
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );
};
