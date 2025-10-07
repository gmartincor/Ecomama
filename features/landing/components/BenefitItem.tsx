interface BenefitItemProps {
  icon: string;
  title: string;
  description: string;
}

export const BenefitItem = ({ icon, title, description }: BenefitItemProps) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
