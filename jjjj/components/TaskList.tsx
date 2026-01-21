import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Bot, Check, Trash2, Calendar, Tag, Filter, Search } from 'lucide-react';
import { suggestSubtasks } from '../services/geminiService';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, priority: Task['priority'], dueDate?: string, tags?: string[]) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  
  // Filter states
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      onAddTask(newTaskTitle, priority, dueDate || undefined, tags);
      setNewTaskTitle('');
      setTagsInput('');
      setDueDate('');
    }
  };

  const handleAIBreakdown = async (taskTitle: string) => {
    setLoadingAI(taskTitle);
    const subtasks = await suggestSubtasks(taskTitle);
    subtasks.forEach(st => onAddTask(st, 'medium'));
    setLoadingAI(null);
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/40 font-bold';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Tasks</h2>
          <p className="text-slate-400">Manage your daily priorities.</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search tasks or tags..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>All</button>
                <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-md text-sm ${filter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Pending</button>
                <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Done</button>
            </div>
        </div>
      </div>

       {/* Add Task Form */}
      <form onSubmit={handleAdd} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
            <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
            <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
            >
            <Plus size={20} />
            <span>Add Task</span>
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
            >
                <option value="low">🔵 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="critical">🔴 Critical</option>
            </select>
            
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
            </div>
            
             <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                />
            </div>
        </div>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
         {filteredTasks.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <p className="text-slate-500">No matching tasks found.</p>
          </div>
        )}

        {filteredTasks.map(task => (
          <div 
            key={task.id}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
              task.completed 
                ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-slate-600 hover:border-blue-500'
                }`}
              >
                {task.completed && <Check size={14} strokeWidth={3} />}
              </button>
              
              <div className="flex flex-col gap-1">
                <span className={`text-base font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </span>
                <div className="flex items-center flex-wrap gap-2">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                    </span>
                    {task.dueDate && (
                        <span className="flex items-center text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            <Calendar size={10} className="mr-1" /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                     {task.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                            #{tag}
                        </span>
                     ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!task.completed && (
                <button
                  onClick={() => handleAIBreakdown(task.title)}
                  disabled={loadingAI === task.title}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Bot size={14} />
                  {loadingAI === task.title ? 'Thinking...' : 'AI'}
                </button>
              )}
              
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-2 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};