import type { Benefit } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// הוסף כאן הטבות חדשות. כל הטבה מכילה קריטריוני זכאות שקובעים למי היא מוצגת.
// eligibility fields (all optional):
//   businessTypes            – רשימת סוגי עסק זכאים (ריק = כולם)
//   locations                – רשימת אזורים זכאים (ריק = כולם)
//   requiresWarAffected      – true = רק עסקים שנפגעו מהמלחמה
//   requiresTurnoverDecline  – true = נדרשת ירידה במחזור בין 2024 ל-2025
//   minTurnoverDeclinePercent – אחוז ירידה מינימלי נדרש
//   maxMonthlyTurnover       – תקרת מחזור חודשי (₪)
// ─────────────────────────────────────────────────────────────────────────────
export const benefitsData: Benefit[] = [
  {
    id: 'war-rear-grant',
    name: 'מענק לעסקים בעורף',
    description:
      'מענק חד פעמי לעסקים שנפגעו מהמלחמה ביישובי העורף ורשמו ירידה של 25% לפחות במחזור העסקי.',
    url: '#',
    tags: ['מלחמה', 'מענק', 'ירידה במחזור'],
    eligibility: {
      requiresWarAffected: true,
      requiresTurnoverDecline: true,
      minTurnoverDeclinePercent: 25,
    },
  },
  {
    id: 'war-north-grant',
    name: 'מענק לעסקים בצפון',
    description:
      'מענק מיוחד לעסקים הממוקמים בצפון הארץ שנפגעו ממלחמת לבנון השנייה.',
    url: '#',
    tags: ['מלחמה', 'צפון', 'מענק'],
    eligibility: {
      locations: ['צפון', 'חיפה והקריות'],
      requiresWarAffected: true,
    },
  },
  {
    id: 'sme-subsidized-loan',
    name: 'הלוואה מוסבת לעסקים קטנים ובינוניים',
    description:
      'הלוואה בתנאים מועדפים לעסקים קטנים ובינוניים (מחזור עד 300,000 ₪/חודש) שנפגעו בתקופת המלחמה.',
    url: '#',
    tags: ['הלוואה', 'מוסבת', 'עסקים קטנים'],
    eligibility: {
      requiresWarAffected: true,
      maxMonthlyTurnover: 300000,
    },
  },
  {
    id: 'tourism-support',
    name: 'תמיכה לענף התיירות',
    description:
      'מענק לעסקים בענף התיירות והאירוח שנרשמה בהם ירידה בביקושים.',
    url: '#',
    tags: ['תיירות', 'מענק'],
    eligibility: {
      businessTypes: ['תיירות ואירוח'],
      requiresTurnoverDecline: true,
    },
  },
  {
    id: 'south-envelope-grant',
    name: 'מענק לעסקים בדרום ועוטף עזה',
    description:
      'תמיכה ייחודית לעסקים הממוקמים בעוטף עזה ובדרום שנפגעו ישירות מהמלחמה.',
    url: '#',
    tags: ['מלחמה', 'דרום', 'עוטף עזה'],
    eligibility: {
      locations: ['דרום'],
      requiresWarAffected: true,
    },
  },
];
