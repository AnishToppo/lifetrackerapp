import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Habit, Task, UserStats } from '../types';
import { Sparkles, TrendingUp, CheckCircle2, ListTodo, Trophy, Star } from 'lucide-react';
import { getMotivation } from '../services/geminiService';

interface DashboardProps {
  habits: Habit[];
  tasks: Task[];
  userStats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ habits, tasks, userStats }) => {
  const [motivation, setMotivation] = useState<string>("Analyzing your productivity...");
  const [loadingAI, setLoadingAI] = useState(false);

  const activeHabits = habits.length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // XP to next level formula: 100 * level
  const xpForNextLevel = userStats.level * 100;
  const xpProgress = (userStats.xp / xpForNextLevel) * 100;

  useEffect(() => {
    let mounted = true;
    const fetchMotivation = async () => {
      setLoadingAI(true);
      const text = await getMotivation(habits, tasks);
      if (mounted) {
        setMotivation(text);
        setLoadingAI(false);
      }
    };
    fetchMotivation();
    return () => { mounted = false; };
  }, [habits, tasks]); 

  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const COLORS = ['#3b82f6', '#1e293b'];

  const habitData = habits.map(h => ({
    name: h.title,
    streak: h.streak
  }));

  return (
    <div className="space-y-8 fade-in">
      {/* Hero Section & Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 shadow-2xl shadow-blue-900/20 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                2026 ASSIGNMENT PROJECT
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, <br/>
              <span className="text-blue-400">Akib Khan</span>
            </h1>
            
             <div className="mt-6 inline-flex items-center bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 w-full">
              <Sparkles className="text-yellow-400 mr-3 flex-shrink-0 animate-pulse" />
              <p className="text-sm md:text-base text-slate-200 italic line-clamp-2">
                {loadingAI ? "Consulting AI Coach..." : `"${motivation}"`}
              </p>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        </div>

        {/* Level Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Trophy size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-slate-400 font-medium">Current Level</span>
              <span className="text-3xl font-black text-yellow-400">LVL {userStats.level}</span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>{userStats.xp} XP</span>
              <span>{xpForNextLevel} XP</span>
            </div>
            <div className="mt-6 flex items-center space-x-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="font-semibold">{userStats.points} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Task Completion</p>
              <h3 className="text-3xl font-bold text-white mt-2">{completionRate}%</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <CheckCircle2 className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-white mt-2">{pendingTasks}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ListTodo className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Habits</p>
              <h3 className="text-3xl font-bold text-white mt-2">{activeHabits}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Habits Done</p>
              <h3 className="text-3xl font-bold text-white mt-2">{completedHabits}</h3>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Sparkles className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Task Breakdown</h3>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-sm text-slate-400">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Completed</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-slate-800 mr-2"></span> Pending</div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Habit Streaks</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="streak" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};