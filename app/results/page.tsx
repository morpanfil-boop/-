'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { matchBenefits, calcDeclinePercent } from '@/lib/matching';
import type { BusinessProfile } from '@/lib/types';

function ResultsContent() {
  const searchParams = useSearchParams();

  const profile: BusinessProfile = {
    businessType: searchParams.get('businessType') ?? '',
    location: searchParams.get('location') ?? '',
    turnover2024: Number(searchParams.get('turnover2024') ?? 0),
    turnover2025: Number(searchParams.get('turnover2025') ?? 0),
    warAffected: searchParams.get('warAffected') === 'true',
  };

  const matched = matchBenefits(profile);
  const declinePct = calcDeclinePercent(profile.turnover2024, profile.turnover2025);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">תוצאות ההתאמה</h1>
          <p className="text-slate-500">
            {matched.length > 0
              ? `נמצאו ${matched.length} הטבות שמתאימות לפרופיל העסק שלך`
              : 'לא נמצאו הטבות מתאימות כרגע'}
          </p>
        </div>

        {/* Profile summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 mb-3">פרופיל העסק</h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div className="text-slate-500">
              סוג: <span className="font-medium text-slate-900">{profile.businessType}</span>
            </div>
            <div className="text-slate-500">
              אזור: <span className="font-medium text-slate-900">{profile.location}</span>
            </div>
            <div className="text-slate-500">
              מחזור 2024:{' '}
              <span className="font-medium text-slate-900">
                ₪{profile.turnover2024.toLocaleString('he-IL')}
              </span>
            </div>
            <div className="text-slate-500">
              מחזור 2025:{' '}
              <span className="font-medium text-slate-900">
                ₪{profile.turnover2025.toLocaleString('he-IL')}
              </span>
            </div>
            {declinePct > 0 && (
              <div className="col-span-2 text-slate-500">
                ירידה במחזור:{' '}
                <span className="font-medium text-red-600">{declinePct}%</span>
              </div>
            )}
            <div className="col-span-2 text-slate-500">
              פגיעה מלחמה:{' '}
              <span
                className={`font-medium ${
                  profile.warAffected ? 'text-orange-600' : 'text-slate-900'
                }`}
              >
                {profile.warAffected ? 'כן' : 'לא'}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        {matched.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-700 font-medium mb-1">לא נמצאו הטבות מותאמות</p>
            <p className="text-sm text-slate-400">
              ייתכן שהטבות נוספות יתווספו למערכת בקרוב
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matched.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-1">{benefit.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{benefit.description}</p>
                {benefit.tags && benefit.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {benefit.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={benefit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  למידע נוסף ולהגשת בקשה ←
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-6 text-sm">
          <Link href="/questionnaire" className="text-slate-500 hover:text-slate-700 underline">
            חזור לשאלון
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-700 underline">
            דף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">טוען תוצאות...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
