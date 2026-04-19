export interface FamilyMember {
  id: string;
  name: string;
  isGlutenFree: boolean;
  emoji: string;
}

export interface Recipe {
  id: string;
  name: string;
  likedBy: string[];
  isGlutenFree: boolean;
  category: 'עוף' | 'בשר' | 'דגים' | 'פסטה' | 'אורז/דגנים' | 'ירקות' | 'אחר';
}

export interface DayPlan {
  recipeId: string | null;
  notes: string;
}

export type WeekPlan = Record<string, DayPlan>;
