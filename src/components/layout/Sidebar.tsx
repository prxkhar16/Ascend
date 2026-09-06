import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  BarChart3,
  Timer,
  Sparkles,
  ChevronRight,
  LogOut,
  Command,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ViewType } from '../../types';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenCommand }) => {
  const { currentView, setCurrentView, pendingTasksCount, totalActiveStreak } = useApp();
  const { user, logout } = useAuth();

  const navItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'tasks',
      label: 'Daily Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'habits',
      label: 'Habit Tracker',
      icon: Flame,
      badge: totalActiveStreak > 0 ? `${totalActiveStreak}d` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    {
      id: 'ai',
      label: 'AI Coach',
      icon: Sparkles,
      badge: 'Gemini',
      badgeColor: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-indigo-200 border border-indigo-500/30',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0C0E15]/95 border-r border-white/5 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div
            onClick={() => {
              setCurrentView('dashboard');
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 22h20L12 2z" />
                <path d="M12 8l-4.5 9h9L12 8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white">ASCEND</span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">OS</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Life Operating System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Command Trigger */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              onOpenCommand();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs text-slate-400 hover:text-slate-200 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-indigo-400" />
              <span>Search or command...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-slate-400 group-hover:text-slate-200">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-600/15 text-white border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400/70" />
                  )}
                </div>

                {/* Subtle active indicator pill */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      Lvl {user.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  View Landing Page
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium text-center transition-colors shadow-sm"
            >
              Sign In to Ascend
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
