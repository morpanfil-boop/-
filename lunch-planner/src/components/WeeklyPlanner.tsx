import { useState } from 'react';
import type { Recipe, WeekPlan, DayPlan } from '../types';
import { FAMILY_MEMBERS } from '../data';

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];

function getWeekKey(offset = 0): string {
  const d = new Date();
  const day = d.getDay();
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - day + offset * 7);
  return sunday.toISOString().slice(0, 10);
}

function getDayKeys(weekStart: string): string[] {
  const base = new Date(weekStart);
  return DAYS.map((_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function formatDate(key: string): string {
  const d = new Date(key);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
}

interface DayCardProps {
  dayName: string;
  dateKey: string;
  plan: DayPlan;
  recipes: Recipe[];
  onChange: (key: string, plan: DayPlan) => void;
}

function DayCard({ dayName, dateKey, plan, recipes, onChange }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const selected = recipes.find(r => r.id === plan.recipeId);

  const glutenFreeRecipes = recipes.filter(r => r.isGlutenFree);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">{dayName}</span>
          <span className="text-xs text-gray-400">{formatDate(dateKey)}</span>
        </div>
        <div className="flex items-center gap-2">
          {selected ? (
            <span className="text-sm text-orange-600 font-medium">{selected.name}</span>
          ) : (
            <span className="text-sm text-gray-400">לא תוכנן</span>
          )}
          <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">בחרי מנה לצהריים</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm"
              value={plan.recipeId ?? ''}
              onChange={e => onChange(dateKey, { ...plan, recipeId: e.target.value || null })}
            >
              <option value="">-- ללא בחירה --</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}{r.isGlutenFree ? ' 🌾' : ''}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">אוהבים: </span>
              {FAMILY_MEMBERS.filter(m => selected.likedBy.includes(m.id)).map(m => `${m.emoji}${m.name}`).join(', ') || 'לא צוין'}
              {selected.isGlutenFree && <span className="mr-2 text-green-600">• ללא גלוטן ✓</span>}
            </div>
          )}

          {selected && !selected.isGlutenFree && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700">
              ⚠️ המנה מכילה גלוטן — טוביה לא יוכל לאכול. אפשרויות ללא גלוטן: {glutenFreeRecipes.slice(0, 3).map(r => r.name).join(', ')}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">הערות</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              placeholder="הערה כלשהי..."
              value={plan.notes}
              onChange={e => onChange(dateKey, { ...plan, notes: e.target.value })}
            />
          </div>

          <button
            onClick={() => onChange(dateKey, { recipeId: null, notes: '' })}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            נקה יום
          </button>
        </div>
      )}
    </div>
  );
}

interface Props {
  recipes: Recipe[];
  weekPlan: WeekPlan;
  onUpdate: (plan: WeekPlan) => void;
}

export function WeeklyPlanner({ recipes, weekPlan, onUpdate }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = getWeekKey(weekOffset);
  const dayKeys = getDayKeys(weekStart);

  const handleDayChange = (key: string, day: DayPlan) => {
    onUpdate({ ...weekPlan, [key]: day });
  };

  const getDay = (key: string): DayPlan =>
    weekPlan[key] ?? { recipeId: null, notes: '' };

  const planned = dayKeys.filter(k => getDay(k).recipeId).length;
  const glutenWarnings = dayKeys.filter(k => {
    const r = recipes.find(x => x.id === getDay(k).recipeId);
    return r && !r.isGlutenFree;
  }).length;

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
        <button
          onClick={() => setWeekOffset(v => v - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ›
        </button>
        <div className="text-center">
          <div className="font-semibold text-gray-800">
            {weekOffset === 0 ? 'השבוע' : weekOffset === 1 ? 'שבוע הבא' : weekOffset === -1 ? 'שבוע שעבר' : `שבוע ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
          </div>
          <div className="text-xs text-gray-400">{formatDate(dayKeys[0])} – {formatDate(dayKeys[4])}</div>
        </div>
        <button
          onClick={() => setWeekOffset(v => v + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ‹
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{planned}</div>
          <div className="text-xs text-orange-500">ימים מתוכננים</div>
        </div>
        <div className={`rounded-xl p-3 text-center ${glutenWarnings > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
          <div className={`text-2xl font-bold ${glutenWarnings > 0 ? 'text-amber-600' : 'text-green-600'}`}>{glutenWarnings}</div>
          <div className={`text-xs ${glutenWarnings > 0 ? 'text-amber-500' : 'text-green-500'}`}>ימים עם גלוטן</div>
        </div>
      </div>

      {/* Day cards */}
      {DAYS.map((day, i) => (
        <DayCard
          key={dayKeys[i]}
          dayName={day}
          dateKey={dayKeys[i]}
          plan={getDay(dayKeys[i])}
          recipes={recipes}
          onChange={handleDayChange}
        />
      ))}
    </div>
  );
}
