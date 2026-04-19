import { useState } from 'react';
import type { Recipe, FamilyMember } from '../types';
import { FAMILY_MEMBERS } from '../data';

const CATEGORIES: Recipe['category'][] = ['עוף', 'בשר', 'דגים', 'פסטה', 'אורז/דגנים', 'ירקות', 'אחר'];

interface Props {
  recipe?: Recipe;
  onSave: (r: Recipe) => void;
  onCancel: () => void;
}

export function RecipeForm({ recipe, onSave, onCancel }: Props) {
  const [name, setName] = useState(recipe?.name ?? '');
  const [category, setCategory] = useState<Recipe['category']>(recipe?.category ?? 'אחר');
  const [likedBy, setLikedBy] = useState<string[]>(recipe?.likedBy ?? []);
  const [isGlutenFree, setIsGlutenFree] = useState(recipe?.isGlutenFree ?? false);

  const toggleMember = (id: string) =>
    setLikedBy(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: recipe?.id ?? Date.now().toString(),
      name: name.trim(),
      category,
      likedBy,
      isGlutenFree,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">שם המנה</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="לדוגמה: פסטה ברוטב אדום"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          value={category}
          onChange={e => setCategory(e.target.value as Recipe['category'])}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">מי אוהב את זה?</label>
        <div className="flex flex-wrap gap-2">
          {FAMILY_MEMBERS.map((m: FamilyMember) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMember(m.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                likedBy.includes(m.id)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isGlutenFree}
          onChange={e => setIsGlutenFree(e.target.checked)}
          className="w-4 h-4 accent-orange-500"
        />
        <span className="text-sm text-gray-700">ללא גלוטן</span>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors"
        >
          שמור
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
