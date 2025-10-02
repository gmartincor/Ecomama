export type UserProfile = {
  id: string;
  userId: string;
  bio: string | null;
  phone: string | null;
  location: string | null;
  avatar: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileWithUser = UserProfile & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile | null;
  memberSince: Date;
};

export type ProfileUpdateInput = {
  bio?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  isPublic?: boolean;
};
