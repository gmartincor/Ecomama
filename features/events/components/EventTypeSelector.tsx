import type { EventType } from "../types";

type EventTypeOption = {
  value: EventType;
  label: string;
  icon: string;
  description: string;
};

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: "ANNOUNCEMENT",
    label: "Anuncio",
    icon: "📢",
    description: "Comunicados importantes de la comunidad",
  },
  {
    value: "EVENT",
    label: "Evento",
    icon: "📅",
    description: "Reuniones, talleres, actividades con fecha",
  },
  {
    value: "NEWS",
    label: "Noticia",
    icon: "📰",
    description: "Noticias y novedades de la comunidad",
  },
];

type EventTypeSelectorProps = {
  value: EventType;
  onChange: (value: EventType) => void;
  error?: string;
};

export const EventTypeSelector = ({ value, onChange, error }: EventTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Tipo de publicación
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {EVENT_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${
                value === option.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <div className="font-semibold">{option.label}</div>
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
