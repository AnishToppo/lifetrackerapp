export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  category: 'health' | 'learning' | 'productivity' | 'mindfulness';
  difficulty: 'easy' | 'medium' | 'hard';
  target: string; // e.g. "30 mins", "1 chapter"
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  points: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  HABITS = 'HABITS',
  TASKS = 'TASKS',
  TIPS = 'TIPS'
}

export interface DashboardStats {
  completionRate: number;
  activeHabits: number;
  pendingTasks: number;
  totalStreak: number;
}