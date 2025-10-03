import { cn } from "@/lib/utils/cn";

interface CalendarIconProps {
  date: Date | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "w-11 h-11",
    month: "text-[0.55rem] py-0.5",
    day: "text-base",
  },
  md: {
    container: "w-14 h-14",
    month: "text-[0.65rem] py-1",
    day: "text-xl",
  },
  lg: {
    container: "w-20 h-20",
    month: "text-xs py-1.5",
    day: "text-3xl",
  },
};

export const CalendarIcon = ({ date, className, size = "md" }: CalendarIconProps) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().slice(0, 3);
  const config = sizeConfig[size];

  return (
    <div className={cn(
      "inline-flex flex-col bg-card border-2 border-primary rounded-lg overflow-hidden flex-shrink-0 shadow-sm",
      config.container,
      className
    )}>
      <div className={cn(
        "bg-primary text-primary-foreground font-bold w-full text-center tracking-wider",
        config.month
      )}>
        {month}
      </div>
      <div className={cn(
        "flex-1 flex items-center justify-center font-bold text-foreground",
        config.day
      )}>
        {day}
      </div>
    </div>
  );
};
