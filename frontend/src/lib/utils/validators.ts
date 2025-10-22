export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
}

export function isValidPostalCode(code: string, country = 'US'): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    ES: /^\d{5}$/,
  };

  return patterns[country]?.test(code) || false;
}

export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

export function containsNumber(value: string): boolean {
  return /\d/.test(value);
}

export function containsUpperCase(value: string): boolean {
  return /[A-Z]/.test(value);
}

export function containsLowerCase(value: string): boolean {
  return /[a-z]/.test(value);
}

export function containsSpecialChar(value: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(value);
}

export function isStrongPassword(password: string): boolean {
  return (
    hasMinLength(password, 8) &&
    containsNumber(password) &&
    containsUpperCase(password) &&
    containsLowerCase(password) &&
    containsSpecialChar(password)
  );
}
