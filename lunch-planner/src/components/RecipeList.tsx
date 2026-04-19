import { useState } from 'react';
import type { Recipe } from '../types';
import { FAMILY_MEMBERS } from '../data';
import { RecipeForm } from './RecipeForm';

interface Props {
  recipes: Recipe[];
  onAdd: (r: Recipe) => void;
  onUpdate: (r: Recipe) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'עוף': 'bg-yellow-100 text-yellow-800',
  'בשר': 'bg-red-100 text-red-800',
  'דגים': 'bg-blue-100 text-blue-800',
  'פסטה': 'bg-amber-100 text-amber-800',
  'אורז/דגנים': 'bg-green-100 text-green-800',
  'ירקות': 'bg-emerald-100 text-emerald-800',
  'אחר': 'bg-gray-100 text-gray-700',
};

export function RecipeList({ recipes, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterGF, setFilterGF] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r => {
    if (filterGF && !r.isGlutenFree) return false;
    if (filterMember !== 'all' && !r.likedBy.includes(filterMember)) return false;
    if (search && !r.name.includes(search)) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, Recipe[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          placeholder="חיפוש מנה..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setFilterMember('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterMember === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            כולם
          </button>
          {FAMILY_MEMBERS.map(m => (
            <button
              key={m.id}
              onClick={() => setFilterMember(m.id === filterMember ? 'all' : m.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterMember === m.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {m.emoji} {m.name}
            </button>
          ))}
          <button
            onClick={() => setFilterGF(v => !v)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterGF ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            🌾 ללא גלוטן
          </button>
        </div>
      </div>

      {/* Add button */}
      {!showForm && !editing && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          + הוספת מנה חדשה
        </button>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">מנה חדשה</h3>
          <RecipeForm
            onSave={r => { onAdd(r); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">עריכת מנה</h3>
          <RecipeForm
            recipe={editing}
            onSave={r => { onUpdate(r); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Recipe groups */}
      {Object.entries(grouped).length === 0 && (
        <p className="text-center text-gray-400 py-8">אין מנות להציג</p>
      )}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cat]}`}>{cat}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {items.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{r.name}</span>
                    {r.isGlutenFree && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">ללא גלוטן</span>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {FAMILY_MEMBERS.filter(m => r.likedBy.includes(m.id)).map(m => (
                      <span key={m.id} className="text-xs text-gray-500">{m.emoji}{m.name}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                    title="עריכה"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="מחיקה"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
