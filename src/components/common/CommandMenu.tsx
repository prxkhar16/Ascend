import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Flame,
  BarChart3,
  Timer,
  Sparkles,
  Plus,
  RefreshCw,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onOpenTaskModal,
  onOpenHabitModal,
}) => {
  const { setCurrentView, refreshQuote } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'dash',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => setCurrentView('dashboard'),
    },
    {
      id: 'tasks',
      title: 'Go to Daily Tasks',
      category: 'Navigation',
      icon: CheckSquare,
      action: () => setCurrentView('tasks'),
    },
    {
      id: 'habits',
      title: 'Go to Habit Tracker',
      category: 'Navigation',
      icon: Flame,
      action: () => setCurrentView('habits'),
    },
    {
      id: 'analytics',
      title: 'View Productivity Analytics',
      category: 'Navigation',
      icon: BarChart3,
      action: () => setCurrentView('analytics'),
    },
    {
      id: 'focus',
      title: 'Launch Pomodoro Focus Mode',
      category: 'Focus',
      icon: Timer,
      action: () => setCurrentView('focus'),
    },
    {
      id: 'ai',
      title: 'Open Ascend AI Coach',
      category: 'Intelligence',
      icon: Sparkles,
      action: () => setCurrentView('ai'),
    },
    {
      id: 'new-task',
      title: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      action: () => onOpenTaskModal(),
    },
    {
      id: 'new-habit',
      title: 'Create New Habit',
      category: 'Actions',
      icon: Flame,
      action: () => onOpenHabitModal(),
    },
    {
      id: 'refresh-quote',
      title: 'Shuffle Motivational Quote',
      category: 'Actions',
      icon: RefreshCw,
      action: () => refreshQuote(),
    },
  ];

  const filtered = actions.filter(
    a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-[#11141E] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 animate-slide-up">
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, page name, or action..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching actions found for "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-600/15 hover:border-indigo-500/20 border border-transparent text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-300 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-200">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/30 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↑↓</kbd>
            <span>Select</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↵</kbd>
          </div>
          <div className="flex items-center gap-1">
            <span>Close</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">ESC</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
