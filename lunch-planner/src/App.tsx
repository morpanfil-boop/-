import { useState } from 'react';
import type { Recipe, WeekPlan } from './types';
import { INITIAL_RECIPES } from './data';
import { useLocalStorage } from './useLocalStorage';
import { RecipeList } from './components/RecipeList';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import './index.css';

type Tab = 'planner' | 'recipes';

export default function App() {
  const [tab, setTab] = useState<Tab>('planner');
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', INITIAL_RECIPES);
  const [weekPlan, setWeekPlan] = useLocalStorage<WeekPlan>('weekPlan', {});

  const addRecipe = (r: Recipe) => setRecipes(prev => [...prev, r]);
  const updateRecipe = (r: Recipe) => setRecipes(prev => prev.map(x => x.id === r.id ? r : x));
  const deleteRecipe = (id: string) => setRecipes(prev => prev.filter(x => x.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">🍽️ ארוחות צהריים</h1>
            <p className="text-xs text-gray-400">עמרי · אלה · ניתאי · טוביה · מור</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTab('planner')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'planner' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📅 תכנון
            </button>
            <button
              onClick={() => setTab('recipes')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'recipes' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📋 מתכונים
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === 'planner' ? (
          <WeeklyPlanner
            recipes={recipes}
            weekPlan={weekPlan}
            onUpdate={setWeekPlan}
          />
        ) : (
          <RecipeList
            recipes={recipes}
            onAdd={addRecipe}
            onUpdate={updateRecipe}
            onDelete={deleteRecipe}
          />
        )}
      </main>
    </div>
  );
}
