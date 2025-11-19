import Link from "next/link";
import { Checkbox } from "./Checkbox";

type LegalCheckboxProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  label: React.ReactNode;
};

export const LegalCheckbox = ({
  id,
  checked,
  onChange,
  disabled = false,
  error,
  label,
}: LegalCheckboxProps) => {
  return (
    <div>
      <div className="flex items-start gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          error={error}
        />
        <label
          htmlFor={id}
          className={`text-sm leading-relaxed ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${error ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

type LegalConsentProps = {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
  disabled?: boolean;
  errors?: {
    terms?: string;
    privacy?: string;
  };
};

export const LegalConsent = ({
  termsAccepted,
  privacyAccepted,
  onTermsChange,
  onPrivacyChange,
  disabled = false,
  errors = {},
}: LegalConsentProps) => {
  return (
    <div className="space-y-3 rounded-lg border border-muted p-4">
      <LegalCheckbox
        id="terms"
        checked={termsAccepted}
        onChange={onTermsChange}
        disabled={disabled}
        error={errors.terms}
        label={
          <>
            Acepto los{' '}
            <Link
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Términos y Condiciones
            </Link>
          </>
        }
      />

      <LegalCheckbox
        id="privacy"
        checked={privacyAccepted}
        onChange={onPrivacyChange}
        disabled={disabled}
        error={errors.privacy}
        label={
          <>
            Acepto la{' '}
            <Link
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Política de Privacidad
            </Link>{' '}
            y el uso de cookies
          </>
        }
      />
    </div>
  );
};
