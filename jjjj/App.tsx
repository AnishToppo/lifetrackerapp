import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HabitList } from './components/HabitList';
import { TaskList } from './components/TaskList';
import { TipsPage } from './components/TipsPage';
import { Habit, Task, ViewState, UserStats } from './types';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Initial Data / Persistence
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Morning Meditation', streak: 5, completedToday: false, category: 'mindfulness', difficulty: 'medium', target: '10 mins' },
      { id: '2', title: 'Read 30 mins', streak: 12, completedToday: true, category: 'learning', difficulty: 'easy', target: '30 mins' },
    ];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Complete Project Documentation', completed: false, priority: 'high', tags: ['work'], dueDate: '' },
      { id: '2', title: 'Review Team PRs', completed: true, priority: 'medium', tags: ['work'], dueDate: '' }
    ];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
      const saved = localStorage.getItem('userStats');
      return saved ? JSON.parse(saved) : { xp: 0, level: 1, points: 0 };
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
      localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Gamification Logic
  const awardXP = (amount: number) => {
      setUserStats(prev => {
          const newXP = prev.xp + amount;
          const nextLevelXP = prev.level * 100;
          let newLevel = prev.level;
          let currentXP = newXP;

          // Simple level up logic
          if (currentXP >= nextLevelXP) {
              newLevel += 1;
              currentXP = currentXP - nextLevelXP; // wrap around or keep accumulating?
              // Let's keep accumulating total XP for display, but recalculate level
              // Formula: Level = floor(sqrt(totalXP / 100)) + 1 approximately
              // For simplicity here, let's just increment level
          }
          
          return {
              ...prev,
              xp: newXP, // Keep total XP
              level: Math.floor(Math.sqrt(newXP / 100)) + 1,
              points: prev.points + amount
          };
      });
  };

  // Handlers
  const addHabit = (title: string, category: Habit['category'], difficulty: Habit['difficulty'], target: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      streak: 0,
      completedToday: false,
      category,
      difficulty,
      target
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleting = !h.completedToday;
        
        // Award XP if completing
        if (isCompleting) {
            let xp = 20;
            if (h.difficulty === 'medium') xp = 50;
            if (h.difficulty === 'hard') xp = 100;
            awardXP(xp);
        }

        return {
          ...h,
          completedToday: isCompleting,
          streak: isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addTask = (title: string, priority: Task['priority'], dueDate?: string, tags: string[] = []) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random(),
      title,
      completed: false,
      priority,
      dueDate,
      tags
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
        if (t.id === id) {
            const isCompleting = !t.completed;
            if (isCompleting) {
                let xp = 10;
                if (t.priority === 'medium') xp = 30;
                if (t.priority === 'high') xp = 50;
                if (t.priority === 'critical') xp = 100;
                awardXP(xp);
            }
            return { ...t, completed: isCompleting };
        }
        return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Render Logic
  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard habits={habits} tasks={tasks} userStats={userStats} />;
      case ViewState.HABITS:
        return <HabitList habits={habits} onAddHabit={addHabit} onToggleHabit={toggleHabit} onDeleteHabit={deleteHabit} />;
      case ViewState.TASKS:
        return <TaskList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />;
      case ViewState.TIPS:
        return <TipsPage />;
      default:
        return <Dashboard habits={habits} tasks={tasks} userStats={userStats} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;