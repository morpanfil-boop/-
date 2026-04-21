'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BUSINESS_TYPES, LOCATIONS } from '@/lib/types';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  businessType: string;
  location: string;
  turnover2024: string;
  turnover2025: string;
  warAffected: boolean | null;
}

const STEP_TITLES: Record<Step, string> = {
  1: 'סוג העסק',
  2: 'מיקום העסק',
  3: 'מחזור חודשי ממוצע',
  4: 'פגיעה מהמלחמה',
};

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    businessType: '',
    location: '',
    turnover2024: '',
    turnover2025: '',
    warAffected: null,
  });

  const canProceed = (): boolean => {
    if (step === 1) return !!form.businessType;
    if (step === 2) return !!form.location;
    if (step === 3) return form.turnover2024 !== '' && form.turnover2025 !== '';
    if (step === 4) return form.warAffected !== null;
    return false;
  };

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const submit = () => {
    const params = new URLSearchParams({
      businessType: form.businessType,
      location: form.location,
      turnover2024: form.turnover2024,
      turnover2025: form.turnover2025,
      warAffected: String(form.warAffected),
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm">
            → חזור לדף הבית
          </Link>
          <span className="text-sm text-slate-500">{STEP_TITLES[step]}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>שלב {step} מתוך 4</span>
            <span>{step * 25}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Step 1: Business type */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">סוג העסק</h2>
              <p className="text-slate-500 mb-6">בחר את הקטגוריה המתאימה לעסק שלך</p>
              <div className="grid grid-cols-2 gap-2.5">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm((f) => ({ ...f, businessType: type }))}
                    className={`p-3 rounded-xl border-2 text-right text-sm font-medium transition-all ${
                      form.businessType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">מיקום העסק</h2>
              <p className="text-slate-500 mb-6">באיזה אזור פועל העסק שלך?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setForm((f) => ({ ...f, location: loc }))}
                    className={`p-3 rounded-xl border-2 text-right text-sm font-medium transition-all ${
                      form.location === loc
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Turnover */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">מחזור חודשי ממוצע</h2>
              <p className="text-slate-500 mb-6">הזן מחזור עסקי ממוצע לחודש (בשקלים)</p>
              <div className="space-y-5">
                {([
                  { year: '2024', key: 'turnover2024' },
                  { year: '2025', key: 'turnover2025' },
                ] as const).map(({ year, key }) => (
                  <div key={year}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      שנת {year}
                    </label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₪</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full pr-8 pl-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-right text-slate-900 placeholder-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {form.turnover2024 && form.turnover2025 && Number(form.turnover2024) > 0 && (
                <p className="mt-4 text-sm text-slate-500">
                  {Number(form.turnover2025) < Number(form.turnover2024) ? (
                    <span className="text-red-600">
                      ירידה של{' '}
                      {Math.round(
                        ((Number(form.turnover2024) - Number(form.turnover2025)) /
                          Number(form.turnover2024)) *
                          100,
                      )}%
                      {' '}במחזור
                    </span>
                  ) : (
                    <span className="text-green-600">ללא ירידה במחזור</span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Step 4: War affected */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">פגיעה מהמלחמה</h2>
              <p className="text-slate-500 mb-6">האם העסק שלך נפגע כתוצאה ממלחמת חרבות ברזל?</p>
              <div className="space-y-3">
                <button
                  onClick={() => setForm((f) => ({ ...f, warAffected: true }))}
                  className={`w-full p-4 rounded-xl border-2 text-right font-medium transition-all ${
                    form.warAffected === true
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">כן</span> — העסק נפגע מהמלחמה
                </button>
                <button
                  onClick={() => setForm((f) => ({ ...f, warAffected: false }))}
                  className={`w-full p-4 rounded-xl border-2 text-right font-medium transition-all ${
                    form.warAffected === false
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">לא</span> — העסק לא נפגע מהמלחמה
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 ? (
              <button
                onClick={back}
                className="px-5 py-2.5 border-2 border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
              >
                → חזור
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                המשך ←
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canProceed()}
                className="px-8 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                הצג הטבות ←
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
