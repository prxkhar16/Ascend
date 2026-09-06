export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'Work' | 'Health' | 'Personal' | 'Learning' | 'Finance' | 'Deep Work';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm format
  completed: boolean;
  completedAt?: string;
  order: number;
}

export type HabitCategory = 'Health' | 'Mindset' | 'Productivity' | 'Fitness' | 'Learning';
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDaysPerWeek: number;
  color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
  icon: string;
  currentStreak: number;
  longestStreak: number;
  history: Record<string, boolean>; // key: YYYY-MM-DD, value: true/false
  createdAt: string;
}

export type FocusModeType = 'work' | 'short-break' | 'long-break';

export interface FocusSession {
  id: string;
  durationMinutes: number;
  completedAt: string;
  taskId?: string;
  taskTitle?: string;
  mode: FocusModeType;
}

export interface AiInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'streak' | 'warning';
  title: string;
  summary: string;
  actionItem: string;
  category: string;
  timestamp: string;
  metric?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  joinedDate: string;
  level: number;
  xp: number;
  streakRecord: number;
  bio?: string;
}

export interface DailyQuote {
  quote: string;
  author: string;
  category: string;
}

export type ViewType = 'dashboard' | 'tasks' | 'habits' | 'analytics' | 'focus' | 'ai' | 'landing';
