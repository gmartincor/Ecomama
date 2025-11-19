import type { EventType } from "../types";

type FilterOption = {
  value: EventType | "ALL";
  label: string;
  icon: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: "ALL", label: "Todos", icon: "📋" },
  { value: "ANNOUNCEMENT", label: "Noticias", icon: "📢" },
  { value: "EVENT", label: "Eventos", icon: "📅" },
];

type EventTypeFilterProps = {
  value: EventType | "ALL";
  onChange: (value: EventType | "ALL") => void;
};

export const EventTypeFilter = ({ value, onChange }: EventTypeFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg 
            text-sm font-medium whitespace-nowrap transition-all
            ${
              value === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }
          `}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};
