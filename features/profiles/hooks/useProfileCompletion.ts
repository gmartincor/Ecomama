import { useMemo } from 'react';
import type { ProfileWithUser } from '../types';

export interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
}

const REQUIRED_FIELDS = ['bio', 'phone', 'location'] as const;

export const useProfileCompletion = (profile: ProfileWithUser | null): ProfileCompletionStatus => {
  return useMemo(() => {
    if (!profile) {
      return {
        isComplete: false,
        missingFields: [...REQUIRED_FIELDS],
        completionPercentage: 0,
      };
    }

    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !profile[field] || profile[field]?.trim() === ''
    );

    const completedFields = REQUIRED_FIELDS.length - missingFields.length;
    const completionPercentage = Math.round((completedFields / REQUIRED_FIELDS.length) * 100);

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage,
    };
  }, [profile]);
};
