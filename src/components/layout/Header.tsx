import React from 'react';
import {
  Menu,
  Search,
  Plus,
  Timer,
  Calendar,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCommand: () => void;
  onOpenQuickCreate: () => void;
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenCommand,
  onOpenQuickCreate,
  onOpenTaskModal,
  onOpenHabitModal,
}) => {
  const { user } = useAuth();
  const { setCurrentView } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(new Date());
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile menu & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-white">
                {user?.displayName ? user.displayName.split(' ')[0] : 'Achiever'}
              </span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-300">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {getFormattedDate()}
            </span>
          </div>
          <p className="text-xs text-slate-300 hidden sm:block">
            Ascend Life OS • Daily Protocol Active
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search / Command bar trigger */}
        <button
          onClick={onOpenCommand}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-slate-300 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Quick Focus Mode Button */}
        <button
          onClick={() => setCurrentView('focus')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-all group"
          title="Enter Focus Mode"
        >
          <Timer className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Focus</span>
        </button>

        {/* + Add Habit Direct Action */}
        <button
          onClick={onOpenHabitModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="+ Add Habit Protocol"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
          <span>+ Add Habit</span>
        </button>

        {/* + Add Task Direct Action */}
        <button
          onClick={onOpenTaskModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="+ Add Custom Task"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Add Task</span>
        </button>

        {/* Profile picture */}
        {user && (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20 ml-1 cursor-pointer hover:ring-indigo-400 transition-all"
            onClick={() => setCurrentView('dashboard')}
          />
        )}
      </div>
    </header>
  );
};
