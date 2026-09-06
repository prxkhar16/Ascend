import { Task, Habit, FocusSession, AiInsight, UserProfile, DailyQuote } from '../types';

// Helper to get formatted dates relative to today
export const getTodayString = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER: UserProfile = {
  uid: 'ascend-usr-001',
  email: 'alex.ascend@lifeos.internal',
  displayName: 'Alex Thorne',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  role: 'Life OS Initiate',
  joinedDate: 'September 2026',
  level: 1,
  xp: 0,
  streakRecord: 0,
  bio: 'Starting my discipline and focus journey with ASCEND Life OS.',
};

// Reset to empty arrays as requested
export const INITIAL_TASKS: Task[] = [];

export const INITIAL_HABITS: Habit[] = [];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [];

export const MOTIVATIONAL_QUOTES: DailyQuote[] = [
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (interpreting Aristotle)",
    category: "Mastery",
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "Systems",
  },
  {
    quote: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    category: "Discipline",
  },
  {
    quote: "Focus is a muscle. The more you eliminate non-essential noise, the sharper your execution becomes.",
    author: "Ascend Philosophy",
    category: "Focus",
  },
  {
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    category: "Purpose",
  },
  {
    quote: "Inspiration is perishable. When you have an idea, act on it immediately.",
    author: "Naval Ravikant",
    category: "Action",
  }
];

export const INITIAL_AI_INSIGHTS: AiInsight[] = [
  {
    id: 'insight-1',
    type: 'recommendation',
    title: 'Clean Slate Protocol Activated',
    summary: 'Your Life OS is initialized and calibrated. Establish your first 2 core habits and define up to 3 daily high-priority deliverables.',
    actionItem: 'Add 1 health habit and 1 deep work objective using the "+ New" button.',
    category: 'Onboarding',
    timestamp: 'Just now',
    metric: 'Level 1 Baseline',
  },
  {
    id: 'insight-2',
    type: 'streak',
    title: 'Discipline Momentum Rule',
    summary: 'The initial 7 days represent the highest friction barrier. Keep habit duration under 15 minutes to guarantee 100% adherence.',
    actionItem: 'Choose small, non-negotiable habits to trigger early compounding.',
    category: 'Habits',
    timestamp: 'Today',
    metric: '0-Day Foundation',
  }
];
