import React, { useState } from 'react';
import { Habit } from '../types';
import { Plus, Flame, Check, Trash2, Target, BarChart2 } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onAddHabit: (title: string, category: Habit['category'], difficulty: Habit['difficulty'], target: string) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onAddHabit, onToggleHabit, onDeleteHabit }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('productivity');
  const [difficulty, setDifficulty] = useState<Habit['difficulty']>('medium');
  const [target, setTarget] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      onAddHabit(newHabitTitle, newHabitCategory, difficulty, target);
      setNewHabitTitle('');
      setTarget('');
    }
  };

  const getDifficultyColor = (d: string) => {
      switch(d) {
          case 'easy': return 'text-green-400 bg-green-400/10';
          case 'medium': return 'text-yellow-400 bg-yellow-400/10';
          case 'hard': return 'text-red-400 bg-red-400/10';
          default: return 'text-slate-400';
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Habits</h2>
          <p className="text-slate-400">Build consistency, one day at a time.</p>
        </div>
      </div>

      {/* Add Habit Form */}
      <form onSubmit={handleAdd} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 shadow-xl">
         <div className="flex flex-col md:flex-row gap-4">
            <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter a new habit..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
             <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
            >
            <Plus size={20} />
            <span>Add Habit</span>
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
            value={newHabitCategory}
            onChange={(e) => setNewHabitCategory(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
            >
            <option value="health">💪 Health</option>
            <option value="learning">📚 Learning</option>
            <option value="productivity">🚀 Productivity</option>
            <option value="mindfulness">🧘 Mindfulness</option>
            </select>
            
            <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
            >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            </select>
            
            <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Daily Target (e.g. 30 mins)"
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 text-sm"
            />
         </div>
      </form>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 gap-4">
        {habits.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <p className="text-slate-500">No habits tracked yet. Start today!</p>
          </div>
        )}
        
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`group flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
              habit.completedToday
                ? 'bg-blue-900/10 border-blue-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onToggleHabit(habit.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  habit.completedToday
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-110 shadow-lg shadow-blue-500/40'
                    : 'bg-slate-800 text-slate-600 border border-slate-700 hover:border-slate-500'
                }`}
              >
                {habit.completedToday && <Check size={20} strokeWidth={3} />}
              </button>
              
              <div>
                <h3 className={`font-medium text-lg ${habit.completedToday ? 'text-blue-200' : 'text-slate-200'}`}>
                  {habit.title}
                </h3>
                <div className="flex items-center space-x-3 mt-1.5">
                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {habit.category}
                  </span>
                   <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getDifficultyColor(habit.difficulty)}`}>
                    {habit.difficulty}
                  </span>
                  {habit.target && (
                      <span className="flex items-center text-[10px] text-slate-400">
                          <Target size={10} className="mr-1" /> {habit.target}
                      </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1 text-orange-400 mb-1">
                    <Flame size={16} fill={habit.streak > 0 ? "currentColor" : "none"} />
                    <span className="font-bold text-lg">{habit.streak}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Streak</span>
              </div>
              <button 
                onClick={() => onDeleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};