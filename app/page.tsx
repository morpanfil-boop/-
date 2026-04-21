import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg">
          <span className="text-3xl">🏛️</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          הטבות לעסקים
        </h1>
        <p className="text-xl text-slate-600 mb-10">
          בדוק אילו הטבות ממשלתיות מגיעות לעסק שלך — בחינם, ללא הרשמה
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 text-right">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">איך זה עובד?</h2>
          <ol className="space-y-4">
            {[
              'ענה על כמה שאלות קצרות על העסק שלך',
              'המערכת תנתח את הפרופיל שלך',
              'קבל רשימה של הטבות שמתאימות לך עם קישורים ישירים',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-slate-600 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/questionnaire"
          className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          בדוק אילו הטבות מגיעות לך
        </Link>
        <p className="mt-4 text-sm text-slate-400">לוקח כ-2 דקות • ללא שמירת מידע</p>
      </div>
    </main>
  );
}
