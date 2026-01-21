import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, CheckSquare, Activity, Menu, X, Zap, Lightbulb } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="text-white" size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            FocusFlow
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.HABITS} icon={Activity} label="Habit Tracker" />
          <NavItem view={ViewState.TASKS} icon={CheckSquare} label="Task Manager" />
          <NavItem view={ViewState.TIPS} icon={Lightbulb} label="Tips & Tricks" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            &copy; 2026 Akib Khan Assignment
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="text-white" size={20} fill="currentColor" />
          </div>
          <span className="font-bold">FocusFlow</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-20 px-6">
          <nav className="space-y-4">
            <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={ViewState.HABITS} icon={Activity} label="Habit Tracker" />
            <NavItem view={ViewState.TASKS} icon={CheckSquare} label="Task Manager" />
            <NavItem view={ViewState.TIPS} icon={Lightbulb} label="Tips & Tricks" />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};