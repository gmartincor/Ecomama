type CheckboxProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
};

export const Checkbox = ({
  id,
  checked,
  onChange,
  disabled = false,
  error,
}: CheckboxProps) => {
  return (
    <div className="flex items-start gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`mt-0.5 h-4 w-4 rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? 'border-destructive bg-destructive/10'
            : 'border-muted-foreground/30 bg-background checked:border-primary checked:bg-primary'
        }`}
      />
    </div>
  );
};
