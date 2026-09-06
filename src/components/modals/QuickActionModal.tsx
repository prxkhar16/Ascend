import React from 'react';
import { X, CheckSquare, Flame, ArrowRight } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: () => void;
  onSelectHabit: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectTask,
  onSelectHabit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#11141E] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white">Create New Item</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Option: Task */}
          <button
            onClick={() => {
              onClose();
              onSelectTask();
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-indigo-600/15 border border-white/5 hover:border-indigo-500/30 text-left transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-200">
                  Daily Task / Deliverable
                </p>
                <p className="text-xs text-slate-400">
                  Single high-leverage objective with priority & due time
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option: Habit */}
          <button
            onClick={() => {
              onClose();
              onSelectHabit();
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-amber-600/15 border border-white/5 hover:border-amber-500/30 text-left transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-amber-200">
                  Habit Protocol
                </p>
                <p className="text-xs text-slate-400">
                  Recurring daily/weekly discipline routine with streak tracking
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};
