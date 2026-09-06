import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  Zap,
  Target,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getTodayString } from '../data/mockData';
import { cn } from '../utils/cn';

interface DashboardViewProps {
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTaskModal,
  onOpenHabitModal,
}) => {
  const { user } = useAuth();
  const {
    tasks,
    habits,
    dailyCompletionPercentage,
    completedTasksCount,
    pendingTasksCount,
    totalActiveStreak,
    focusMinutesToday,
    currentQuote,
    refreshQuote,
    toggleTask,
    toggleHabitDay,
    setCurrentView,
    setActiveFocusTask,
  } = useApp();

  const todayStr = getTodayString(0);
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || !t.dueDate);
  const prioritizedTasks = [...todayTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  }).slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Circular progress SVG calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dailyCompletionPercentage / 100) * circumference;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121520] via-[#151928] to-[#121520] border border-white/5 relative overflow-hidden shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Daily Protocol Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
              {user?.displayName ? user.displayName.split(' ')[0] : 'Alex'}
            </span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            {dailyCompletionPercentage >= 80
              ? 'Outstanding velocity today. You are operating at peak cognitive discipline.'
              : dailyCompletionPercentage >= 50
              ? 'Steady momentum. Lock in your remaining high-leverage deliverables.'
              : 'The morning anchors the day. Focus on your single highest-priority task.'}
          </p>
        </div>

        {/* Quick Launch Button */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setCurrentView('focus')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <Clock className="w-4 h-4" />
            <span>Launch Focus Mode</span>
          </button>
        </div>
      </div>

      {/* Metrics Row: Circular Progress Ring & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Circular Progress Ring */}
        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md flex items-center justify-between shadow-card hover:border-white/10 transition-all">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Daily Completion
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{dailyCompletionPercentage}%</span>
              <span className="text-xs font-medium text-emerald-400">Paced</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {completedTasksCount} tasks done today
            </p>
          </div>

          {/* SVG Circular Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              {/* Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-white/5"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Card 2: Task Execution Ratio */}
        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card hover:border-white/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Tasks Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{completedTasksCount}</span>
              <span className="text-slate-500 text-lg font-bold">/ {todayTasks.length}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {pendingTasksCount} pending deliverables
            </p>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  todayTasks.length > 0 ? (completedTasksCount / todayTasks.length) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Habit Streak */}
        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card hover:border-white/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Peak Streak</span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalActiveStreak}</span>
              <span className="text-amber-400 text-sm font-semibold">Days Unbroken</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Consistency compound active
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 mt-4 w-fit">
            <span>Level {user?.level || 1} Initiate</span>
          </div>
        </div>

        {/* Card 4: Focus Minutes */}
        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card hover:border-white/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Deep Work</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{focusMinutesToday}</span>
              <span className="text-cyan-400 text-sm font-semibold">Mins Today</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Across verified focus intervals
            </p>
          </div>
          <button
            onClick={() => setCurrentView('focus')}
            className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-medium mt-4 group"
          >
            <span>Start 25m Pomodoro</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Motivational Quote & Philosophy Card */}
      <div className="p-6 rounded-2xl bg-[#121520]/60 border border-white/5 backdrop-blur-sm relative group overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400">
              Daily Philosophy • {currentQuote.category}
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-200 italic leading-relaxed">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs text-slate-400 font-mono">— {currentQuote.author}</p>
          </div>

          <button
            onClick={refreshQuote}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all shrink-0"
            title="Shuffle Quote"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Prioritized Tasks & Habit Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Today's Prioritized Tasks */}
        <div className="p-6 rounded-3xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Today's Priorities</h3>
                <p className="text-xs text-slate-400">
                  {completedTasksCount} of {todayTasks.length} accomplished
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTaskModal}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Add Task"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
              <button
                onClick={() => setCurrentView('tasks')}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          {/* Task items list */}
          <div className="space-y-2.5 pt-2">
            {prioritizedTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2.5">
                <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
                <p className="text-white font-semibold">No tasks scheduled for today</p>
                <p className="text-slate-400 max-w-xs mx-auto">Create your first priority objective to begin building daily execution velocity.</p>
                <button
                  onClick={onOpenTaskModal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md inline-block mt-2 transition-all hover:scale-105"
                >
                  Create First Task
                </button>
              </div>
            ) : (
              prioritizedTasks.map(task => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 group",
                    task.completed
                      ? "bg-white/[0.02] border-white/5 opacity-60"
                      : "bg-[#161926]/60 hover:bg-[#1A1E2E] border-white/5 hover:border-indigo-500/30 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0",
                        task.completed
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-white/20 hover:border-indigo-400 bg-black/20"
                      )}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold truncate transition-all",
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-slate-100 group-hover:text-white"
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded font-semibold",
                            task.priority === 'high'
                              ? 'text-rose-400 bg-rose-500/10'
                              : task.priority === 'medium'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-emerald-400 bg-emerald-500/10'
                          )}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{task.category}</span>
                        {task.dueTime && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.dueTime}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => {
                        setActiveFocusTask(task);
                        setCurrentView('focus');
                      }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-indigo-500/20 text-indigo-400 transition-all text-[11px] font-mono flex items-center gap-1"
                      title="Focus on this task"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Today's Habit Protocols */}
        <div className="p-6 rounded-3xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Habit Matrix</h3>
                <p className="text-xs text-slate-400">
                  Tap to lock in today's adherence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenHabitModal}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Add Habit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Habit</span>
              </button>
              <button
                onClick={() => setCurrentView('habits')}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                Tracker View
              </button>
            </div>
          </div>

          {/* Habit checklist */}
          <div className="space-y-2.5 pt-2">
            {habits.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2.5">
                <Flame className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
                <p className="text-white font-semibold">No habit protocols initialized</p>
                <p className="text-slate-400 max-w-xs mx-auto">Establish your first daily discipline anchor to start tracking streaks.</p>
                <button
                  onClick={onOpenHabitModal}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md inline-block mt-2 transition-all hover:scale-105"
                >
                  Create First Habit
                </button>
              </div>
            ) : (
              habits.map(habit => {
                const isDoneToday = Boolean(habit.history[todayStr]);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#161926]/60 hover:bg-[#1A1E2E] border border-white/5 hover:border-amber-500/30 transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-amber-300 group-hover:scale-105 transition-all shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 inline" />
                            {habit.currentStreak}d streak
                          </span>
                          <span>•</span>
                          <span>{habit.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Check Button */}
                    <button
                      onClick={() => toggleHabitDay(habit.id, todayStr)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition-all",
                        isDoneToday
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-white/5 hover:border-amber-500/30"
                      )}
                    >
                      {isDoneToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <span>Complete</span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Coach Insight Teaser */}
      <div
        onClick={() => setCurrentView('ai')}
        className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-[#121520] border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Ascend AI Intelligence Report</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gemini Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                "Peak cognitive velocity detected: your throughput is 2.4x higher between 08:30 – 11:30 AM."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 group-hover:text-purple-200">
            <span>Consult Coach</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
