'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

interface PasswordStrengthProps {
  password: string;
  show?: boolean;
}

export function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  const results = useMemo(
    () => requirements.map((req) => ({ ...req, passed: req.test(password) })),
    [password]
  );

  if (!show || !password) return null;

  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      <p className="font-medium text-muted-foreground">Password must contain:</p>
      <ul className="space-y-1.5">
        {results.map((result, index) => (
          <li key={index} className="flex items-center gap-2">
            {result.passed ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span
              className={cn(
                'text-xs',
                result.passed
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-muted-foreground'
              )}
            >
              {result.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
