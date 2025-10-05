import { prisma } from '@/lib/prisma/client';

export interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
}

const REQUIRED_PROFILE_FIELDS = ['bio', 'phone', 'location'] as const;

export const checkProfileCompletion = async (userId: string): Promise<ProfileCompletionStatus> => {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: {
      bio: true,
      phone: true,
      location: true,
    },
  });

  if (!profile) {
    return {
      isComplete: false,
      missingFields: [...REQUIRED_PROFILE_FIELDS],
    };
  }

  const missingFields = REQUIRED_PROFILE_FIELDS.filter(
    (field) => !profile[field] || profile[field].trim() === ''
  );

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
};
