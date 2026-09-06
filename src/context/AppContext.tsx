import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, Habit, FocusSession, DailyQuote, ViewType } from '../types';
import {
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_FOCUS_SESSIONS,
  MOTIVATIONAL_QUOTES,
  getTodayString,
} from '../data/mockData';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  currentQuote: DailyQuote;
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;

  // Habit Actions
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'history' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;

  // Focus Actions
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;

  // Reset helper
  resetAllData: () => void;

  // Utilities
  refreshQuote: () => void;
  playSuccessSound: () => void;
  triggerConfetti: () => void;

  // Computed Metrics
  dailyCompletionPercentage: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  totalActiveStreak: number;
  focusMinutesToday: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TASKS_KEY = 'ascend_tasks_v2';
const HABITS_KEY = 'ascend_habits_v2';
const FOCUS_KEY = 'ascend_focus_v2';

// Synthesize pleasant luxury acoustic feedback without external asset dependencies
export const playLuxuryChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2 (harmonious fifth)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
    gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context may be restricted by browser policy before first interaction
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Purge legacy v1 mock seed storage keys
  useEffect(() => {
    try {
      localStorage.removeItem('ascend_tasks_v1');
      localStorage.removeItem('ascend_habits_v1');
      localStorage.removeItem('ascend_focus_v1');
    } catch {
      // ignore
    }
  }, []);
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(HABITS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HABITS;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem(FOCUS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FOCUS_SESSIONS;
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(FOCUS_KEY, JSON.stringify(focusSessions));
  }, [focusSessions]);

  const resetAllData = () => {
    setTasks([]);
    setHabits([]);
    setFocusSessions([]);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(FOCUS_KEY);
  };

  const refreshQuote = () => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B'],
      disableForReducedMotion: true,
    });
  };

  const playSuccessSound = () => {
    playLuxuryChime();
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      order: tasks.length,
      dueDate: taskData.dueDate || getTodayString(0),
    };
    setTasks(prev => [newTask, ...prev]);
    playLuxuryChime();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            playLuxuryChime();
            triggerConfetti();
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return t;
      })
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((t, idx) => ({ ...t, order: idx }));
    });
  };

  // Habit Actions
  const addHabit = (
    habitData: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'history' | 'createdAt'>
  ) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      longestStreak: 0,
      history: {},
      createdAt: getTodayString(0),
    };
    setHabits(prev => [newHabit, ...prev]);
    playLuxuryChime();
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const calculateStreak = (history: Record<string, boolean>): { current: number; longest: number } => {
    const today = getTodayString(0);
    const yesterday = getTodayString(-1);
    
    let current = 0;
    // Check if started today or yesterday
    let checkDateOffset = history[today] ? 0 : history[yesterday] ? -1 : null;

    if (checkDateOffset !== null) {
      while (true) {
        const d = getTodayString(checkDateOffset);
        if (history[d]) {
          current++;
          checkDateOffset--;
        } else {
          break;
        }
      }
    }

    const dates = Object.keys(history).filter(k => history[k]);
    const longest = Math.max(current, dates.length > 5 ? Math.min(dates.length, 30) : current);

    return { current, longest };
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const nextHistory = { ...h.history, [dateStr]: !h.history[dateStr] };
          if (!h.history[dateStr]) {
            // Checked habit
            playLuxuryChime();
            triggerConfetti();
          }
          const { current, longest } = calculateStreak(nextHistory);
          return {
            ...h,
            history: nextHistory,
            currentStreak: current,
            longestStreak: Math.max(h.longestStreak, longest),
          };
        }
        return h;
      })
    );
  };

  // Focus Actions
  const addFocusSession = (sessionData: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: `focus-${Date.now()}`,
    };
    setFocusSessions(prev => [newSession, ...prev]);
    playLuxuryChime();
    triggerConfetti();
  };

  // Computed Metrics
  const todayStr = getTodayString(0);
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || !t.dueDate);
  const completedTasksCount = todayTasks.filter(t => t.completed).length;
  const pendingTasksCount = todayTasks.length - completedTasksCount;

  // Daily habits adherence
  const habitsDoneToday = habits.filter(h => h.history[todayStr]).length;
  const totalHabitsCount = habits.length;

  // Combined daily completion %
  const totalDailyUnits = todayTasks.length + totalHabitsCount;
  const completedDailyUnits = completedTasksCount + habitsDoneToday;
  const dailyCompletionPercentage =
    totalDailyUnits > 0 ? Math.round((completedDailyUnits / totalDailyUnits) * 100) : 0;

  const totalActiveStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.currentStreak))
    : 0;

  const focusMinutesToday = focusSessions
    .filter(s => s.completedAt.includes('AM') || s.completedAt.includes('PM') || s.completedAt.includes(todayStr))
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        tasks,
        habits,
        focusSessions,
        currentQuote: MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0],
        activeFocusTask,
        setActiveFocusTask,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        reorderTasks,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDay,
        addFocusSession,
        resetAllData,
        refreshQuote,
        playSuccessSound,
        triggerConfetti,
        dailyCompletionPercentage,
        completedTasksCount,
        pendingTasksCount,
        totalActiveStreak,
        focusMinutesToday,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
