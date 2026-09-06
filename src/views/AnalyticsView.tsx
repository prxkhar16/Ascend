import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayString } from '../data/mockData';
import { cn } from '../utils/cn';

export const AnalyticsView: React.FC = () => {
  const { habits, tasks } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Dynamic weekly data based on active tasks
  const completedToday = tasks.filter(t => t.completed).length;
  const totalToday = tasks.length;
  const todayPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const weeklyData = [
    { day: 'Mon', completed: 0, total: 0, percentage: 0 },
    { day: 'Tue', completed: 0, total: 0, percentage: 0 },
    { day: 'Wed', completed: 0, total: 0, percentage: 0 },
    { day: 'Thu', completed: 0, total: 0, percentage: 0 },
    { day: 'Fri', completed: 0, total: 0, percentage: 0 },
    { day: 'Sat', completed: 0, total: 0, percentage: 0 },
    { day: 'Sun', completed: completedToday, total: totalToday, percentage: todayPct },
  ];

  // Best & Most Skipped Habits
  const sortedHabits = [...habits].sort((a, b) => {
    const rateA = Object.values(a.history).filter(Boolean).length / Math.max(Object.keys(a.history).length, 1);
    const rateB = Object.values(b.history).filter(Boolean).length / Math.max(Object.keys(b.history).length, 1);
    return rateB - rateA;
  });

  const bestHabit = sortedHabits[0];
  const mostSkippedHabit = habits.length > 1 ? sortedHabits[sortedHabits.length - 1] : null;

  // Category breakdown
  const categoryStats = [
    {
      category: 'Deep Work & Productivity',
      rate: habits.filter(h => h.category === 'Productivity').length > 0 ? 100 : 0,
      color: 'bg-indigo-500',
    },
    {
      category: 'Mindset & Stoic Reflection',
      rate: habits.filter(h => h.category === 'Mindset').length > 0 ? 100 : 0,
      color: 'bg-amber-500',
    },
    {
      category: 'Physical Health & Recovery',
      rate: habits.filter(h => h.category === 'Health' || h.category === 'Fitness').length > 0 ? 100 : 0,
      color: 'bg-cyan-500',
    },
    {
      category: 'Lifelong Learning',
      rate: habits.filter(h => h.category === 'Learning').length > 0 ? 100 : 0,
      color: 'bg-emerald-500',
    },
  ];

  // Generate 84-day (12 weeks) completion heatmap data
  const heatmapWeeks = Array.from({ length: 12 }, (_, weekIdx) => {
    return Array.from({ length: 7 }, (_, dayIdx) => {
      const daysAgo = (11 - weekIdx) * 7 + (6 - dayIdx);
      const dateStr = getTodayString(-daysAgo);
      // Intensity determined by habits completed on that date
      const activeCount = habits.filter(h => h.history[dateStr]).length;
      const intensity = habits.length > 0 ? activeCount / habits.length : 0;
      return {
        dateStr,
        intensity,
        count: activeCount,
      };
    });
  });

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/[0.03] border-white/5';
    if (intensity < 0.3) return 'bg-indigo-950/60 border-indigo-900/40';
    if (intensity < 0.6) return 'bg-indigo-800/70 border-indigo-700/50';
    if (intensity < 0.85) return 'bg-indigo-600 border-indigo-500/60';
    return 'bg-indigo-400 border-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]';
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121520] via-[#151A27] to-[#121520] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Quantitative Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Performance & Consistency Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Data-backed visibility into your execution cadence and behavioral patterns.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-xl border border-white/5 z-10">
          <button
            onClick={() => setTimeRange('week')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              timeRange === 'week'
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Weekly View
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              timeRange === 'month'
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {/* Top Highlight Cards: Best Habit & Most Skipped */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Habit */}
        <div className="p-6 rounded-3xl bg-[#121520]/80 border border-white/5 hover:border-emerald-500/30 shadow-card transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Highest Consistency Anchor</span>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {bestHabit ? 'Active Protocol' : '0% Calibrated'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {bestHabit ? bestHabit.name : 'No habits tracked yet'}
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-mono">
            {bestHabit
              ? `Unbroken streak: ${bestHabit.currentStreak} days • Category: ${bestHabit.category}`
              : 'Add your first habit protocol to establish consistency anchors'}
          </p>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {bestHabit
                ? 'This habit represents your highest behavioral adherence. Continue defending the streak.'
                : 'Consistency compounds exponentially after 7 unbroken days. Begin by setting a daily baseline.'}
            </p>
          </div>
        </div>

        {/* Most Skipped Habit */}
        <div className="p-6 rounded-3xl bg-[#121520]/80 border border-white/5 hover:border-amber-500/30 shadow-card transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Friction Point Analysis</span>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {mostSkippedHabit ? 'Variance Detected' : 'Clean Baseline'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {mostSkippedHabit ? mostSkippedHabit.name : 'No habit friction recorded'}
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-mono">
            {mostSkippedHabit
              ? `Current streak: ${mostSkippedHabit.currentStreak} days • Category: ${mostSkippedHabit.category}`
              : 'All daily protocols are operating without resistance'}
          </p>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {mostSkippedHabit
                ? 'Habit adherence drops whenever friction is high. Reduce the habit initiation threshold to under 2 minutes.'
                : 'As you track habits, ASCEND AI will diagnose drop-off patterns and suggest behavioral adjustments.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Weekly Productivity Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121520]/80 border border-white/5 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">Weekly Execution Cadence</h3>
            <p className="text-xs text-slate-400">
              Daily deliverables completed vs planned commitments
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <div className="w-3 h-3 rounded bg-white/10" />
              <span>Planned Total</span>
            </div>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-64 border-b border-white/5">
          {weeklyData.map(item => (
            <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-mono text-slate-400 group-hover:text-indigo-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.percentage}%
              </span>

              {/* Bar track container */}
              <div className="w-full max-w-[42px] bg-white/[0.04] rounded-xl h-48 flex flex-col justify-end p-1 relative overflow-hidden border border-white/5 group-hover:border-indigo-500/40 transition-colors">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-700 ease-out group-hover:shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                  style={{ height: `${item.percentage}%` }}
                />
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white block">
                  {item.day}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {item.completed}/{item.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub-style 84-Day Completion Heatmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121520]/80 border border-white/5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Consistency Matrix</h3>
            </div>
            <p className="text-xs text-slate-400">
              84-day historical habit and task density heatmap
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-white/[0.03] border border-white/5" />
              <div className="w-3 h-3 rounded bg-indigo-950/60 border border-indigo-900/40" />
              <div className="w-3 h-3 rounded bg-indigo-800/70 border border-indigo-700/50" />
              <div className="w-3 h-3 rounded bg-indigo-600 border border-indigo-500/60" />
              <div className="w-3 h-3 rounded bg-indigo-400 border border-indigo-300" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 pt-2">
            {heatmapWeeks.flatMap(week =>
              week.map(cell => (
                <div
                  key={cell.dateStr}
                  title={`${cell.dateStr}: ${cell.count} habits completed`}
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border transition-transform hover:scale-125 cursor-pointer",
                    getHeatmapColor(cell.intensity)
                  )}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121520]/80 border border-white/5 shadow-card space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white">Domain Performance</h3>
          <p className="text-xs text-slate-400">
            Adherence distribution across life operating verticals
          </p>
        </div>

        <div className="space-y-4">
          {categoryStats.map(stat => (
            <div key={stat.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{stat.category}</span>
                <span className="font-mono font-bold text-white">{stat.rate}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", stat.color)}
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
