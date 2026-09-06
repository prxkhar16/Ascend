import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Zap,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HabitCategory } from '../types';
import { getTodayString } from '../data/mockData';
import { cn } from '../utils/cn';

interface HabitsViewProps {
  onOpenHabitModal: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({ onOpenHabitModal }) => {
  const { habits, toggleHabitDay, deleteHabit } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const todayStr = getTodayString(0);

  // Generate the last 7 days array for the interactive timeline
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i; // from 6 days ago up to today (index 0)
    const dateStr = getTodayString(-offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - offset);
    return {
      dateStr,
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNumber: dateObj.getDate(),
      isToday: offset === 0,
    };
  });

  // Category filter
  const filteredHabits = habits.filter(h =>
    selectedCategory === 'all' ? true : h.category === selectedCategory
  );

  // Stats calculation
  const totalHabits = habits.length;
  const highestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak)) : 0;
  const completedToday = habits.filter(h => h.history[todayStr]).length;
  const todayAdherence = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const categories: HabitCategory[] = [
    'Health',
    'Mindset',
    'Productivity',
    'Fitness',
    'Learning',
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          glow: 'shadow-glow-cyan',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
          dot: 'bg-cyan-500 text-slate-950',
          ring: 'border-cyan-500/40 text-cyan-400',
        };
      case 'emerald':
        return {
          glow: 'shadow-glow-emerald',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          dot: 'bg-emerald-500 text-slate-950',
          ring: 'border-emerald-500/40 text-emerald-400',
        };
      case 'amber':
        return {
          glow: 'shadow-glow-amber',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          dot: 'bg-amber-500 text-slate-950',
          ring: 'border-amber-500/40 text-amber-400',
        };
      case 'rose':
        return {
          glow: 'shadow-glow-rose',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          dot: 'bg-rose-500 text-white',
          ring: 'border-rose-500/40 text-rose-400',
        };
      default:
        return {
          glow: 'shadow-glow-md',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
          dot: 'bg-indigo-500 text-white',
          ring: 'border-indigo-500/40 text-indigo-400',
        };
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121520] via-[#181D2C] to-[#121520] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-medium">
            <Flame className="w-3.5 h-3.5" />
            <span>Consistency Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Habit Tracker & Streaks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Build discipline brick-by-brick. Interactive 7-day adherence matrix.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onOpenHabitModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Habit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Active Protocols</span>
          <p className="text-2xl font-bold text-white mt-1">{totalHabits}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Highest Streak</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-amber-400">{highestStreak}</span>
            <span className="text-xs text-amber-300/80 font-mono">days</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Today's Adherence</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{todayAdherence}%</span>
            <span className="text-xs text-slate-500 font-mono">({completedToday}/{totalHabits})</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Consistency Level</span>
          <div className="flex items-center gap-1.5 mt-1 text-indigo-300 font-bold text-lg">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>Level 1 Initiate</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
            selectedCategory === 'all'
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm"
              : "bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white"
          )}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              selectedCategory === cat
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm"
                : "bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit Cards Grid */}
      <div className="space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121520]/40 border border-white/5 space-y-3">
            <Flame className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
            <h4 className="text-sm font-bold text-white">
              {habits.length === 0 ? 'No habit protocols created yet' : 'No habits in this category'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {habits.length === 0
                ? 'Initialize your first daily discipline protocol to begin compounding unbroken streaks.'
                : 'Create a new habit protocol to begin tracking consistency in this domain.'}
            </p>
            <button
              onClick={onOpenHabitModal}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md inline-block hover:scale-105 transition-all"
            >
              {habits.length === 0 ? 'Create First Habit' : 'Create Habit'}
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const styles = getColorClasses(habit.color);

            // Compute 30-day success percentage
            const datesRecorded = Object.keys(habit.history);
            const completedCount = datesRecorded.filter(d => habit.history[d]).length;
            const successPct = datesRecorded.length > 0
              ? Math.round((completedCount / datesRecorded.length) * 100)
              : 0;

            return (
              <div
                key={habit.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#121520]/80 border border-white/5 hover:border-white/10 shadow-card transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Habit info & Streak */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 text-amber-400" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {habit.name}
                          </h3>
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold",
                              styles.badge
                            )}
                          >
                            {habit.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          Target: {habit.targetDaysPerWeek} days/week • Best streak: {habit.longestStreak} days
                        </p>
                      </div>
                    </div>

                    {/* Adherence progress meter */}
                    <div className="pt-2 max-w-sm">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>30-Day Adherence</span>
                        <span className="font-bold text-white">{successPct}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${successPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle: Streak Badge */}
                  <div className="flex items-center gap-4 bg-black/20 p-3 px-5 rounded-2xl border border-white/5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Flame className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">
                          {habit.currentStreak}
                        </span>
                        <span className="text-xs font-mono text-amber-400">days</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Current Streak
                      </span>
                    </div>
                  </div>

                  {/* Right: Interactive 7-Day Matrix */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    {last7Days.map(day => {
                      const isCompleted = Boolean(habit.history[day.dateStr]);
                      return (
                        <div key={day.dateStr} className="text-center">
                          <span className="text-[10px] font-mono text-slate-400 block mb-1">
                            {day.dayName}
                          </span>
                          <button
                            onClick={() => toggleHabitDay(habit.id, day.dateStr)}
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border text-xs font-mono font-bold",
                              isCompleted
                                ? `${styles.dot} shadow-sm border-transparent`
                                : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5",
                              day.isToday && !isCompleted && "ring-1 ring-amber-400/50"
                            )}
                            title={`${day.dateStr}: ${isCompleted ? 'Completed' : 'Missed'} (click to toggle)`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <span>{day.dayNumber}</span>
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {/* Delete action */}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 ml-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Philosophy Callout Banner */}
      <div className="p-6 rounded-3xl bg-[#121520]/50 border border-white/5 flex items-center gap-4 text-xs text-slate-400">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-0.5">The 21/90 Behavioral Rule</h4>
          <p className="leading-relaxed">
            It takes 21 consecutive days to establish neuro-chemical habit automaticity, and 90 days to permanently forge a lifestyle operating cadence. Tap any circle above to log past adherence.
          </p>
        </div>
      </div>
    </div>
  );
};
