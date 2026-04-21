import type { Benefit, BusinessProfile } from './types';
import { benefitsData } from './benefits-data';

export function matchBenefits(profile: BusinessProfile): Benefit[] {
  return benefitsData.filter((benefit) => {
    const { eligibility: e } = benefit;

    if (e.businessTypes?.length && !e.businessTypes.includes(profile.businessType)) {
      return false;
    }

    if (e.locations?.length && !e.locations.includes(profile.location)) {
      return false;
    }

    if (e.requiresWarAffected && !profile.warAffected) {
      return false;
    }

    if (e.requiresTurnoverDecline) {
      if (profile.turnover2024 <= 0) return false;
      const declinePct =
        ((profile.turnover2024 - profile.turnover2025) / profile.turnover2024) * 100;
      if (declinePct <= 0) return false;
      if (e.minTurnoverDeclinePercent && declinePct < e.minTurnoverDeclinePercent) {
        return false;
      }
    }

    if (e.maxMonthlyTurnover !== undefined && profile.turnover2025 > e.maxMonthlyTurnover) {
      return false;
    }

    return true;
  });
}

export function calcDeclinePercent(turnover2024: number, turnover2025: number): number {
  if (turnover2024 <= 0) return 0;
  return Math.round(((turnover2024 - turnover2025) / turnover2024) * 100);
}
