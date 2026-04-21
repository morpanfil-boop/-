export interface Benefit {
  id: string;
  name: string;
  description: string;
  url: string;
  tags?: string[];
  eligibility: BenefitEligibility;
}

export interface BenefitEligibility {
  businessTypes?: string[];
  locations?: string[];
  requiresWarAffected?: boolean;
  requiresTurnoverDecline?: boolean;
  minTurnoverDeclinePercent?: number;
  maxMonthlyTurnover?: number;
}

export interface BusinessProfile {
  businessType: string;
  location: string;
  turnover2024: number;
  turnover2025: number;
  warAffected: boolean;
}

export const BUSINESS_TYPES = [
  'קמעונאות',
  'מסעדנות ומזון',
  'תיירות ואירוח',
  'שירותים',
  'בנייה וקבלנות',
  'ייצור ותעשייה',
  'טכנולוגיה',
  'חקלאות',
  'בריאות ורפואה',
  'חינוך',
  'אחר',
] as const;

export const LOCATIONS = [
  'צפון',
  'חיפה והקריות',
  'השרון',
  'מרכז',
  'תל אביב',
  'ירושלים',
  'שפלה',
  'דרום',
  'ערבה ואילת',
  'יהודה ושומרון',
] as const;
