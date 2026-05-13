export interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoKey: string | null;
  photoUrl?: string | null;
  biography: string | null;
  provider: string | null;
  activityLevel: string;
  createdAt: string;
  updatedAt: string;
  myTicketsCount: number;
  likedTicketsCount: number;
}

export const USER_LEVELS = ["NEWBIE", "REGULAR", "ACTIVE", "EXPERT"] as const;

export type UserLevel = (typeof USER_LEVELS)[number];
