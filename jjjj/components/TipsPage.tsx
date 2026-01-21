import React, { useState } from 'react';
import { Lightbulb, Sparkles, Brain, Battery, Zap, Clock, Target } from 'lucide-react';
import { getProductivityTip } from '../services/geminiService';

export const TipsPage: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    { id: 'procrastination', label: 'Procrastination', icon: Clock, color: 'text-orange-400 bg-orange-400/10' },
    { id: 'deep-work', label: 'Deep Work', icon: Brain, color: 'text-purple-400 bg-purple-400/10' },
    { id: 'energy', label: 'Energy Management', icon: Battery, color: 'text-green-400 bg-green-400/10' },
    { id: 'discipline', label: 'Self Discipline', icon: Target, color: 'text-blue-400 bg-blue-400/10' },
    { id: 'burnout', label: 'Avoiding Burnout', icon: Zap, color: 'text-red-400 bg-red-400/10' },
  ];

  const handleGetTip = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setCurrentTip(null);
    const tip = await getProductivityTip(category);
    setCurrentTip(tip);
    setLoading(false);
  };

  return (
    <div className="space-y-8 fade-in">
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Productivity Dojo</h1>
          <p className="text-lg text-emerald-100 max-w-2xl">
            Unlock your potential with psychological hacks and advanced techniques provided by AI.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleGetTip(cat.label)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
              selectedCategory === cat.label
                ? 'bg-slate-800 border-slate-600 scale-105 shadow-xl'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`p-4 rounded-xl mb-4 ${cat.color}`}>
              <cat.icon size={24} />
            </div>
            <span className="font-medium text-slate-200 text-center">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[200px] flex items-center justify-center p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Sparkles className="text-yellow-400 mb-4 animate-spin" size={32} />
            <p className="text-slate-400">Consulting the productivity archives...</p>
          </div>
        ) : currentTip ? (
          <div className="text-center max-w-2xl relative z-10">
            <Lightbulb className="text-yellow-400 mx-auto mb-6" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              "{currentTip}"
            </h3>
            <p className="mt-6 text-slate-500 text-sm uppercase tracking-widest font-bold">
              Tip for {selectedCategory}
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>Select a category above to reveal a productivity secret.</p>
          </div>
        )}
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>
    </div>
  );
};