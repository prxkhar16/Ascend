import React, { useState } from 'react';
import { X, Flame, AlertCircle, Sparkles } from 'lucide-react';
import { Habit, HabitCategory, HabitFrequency } from '../../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'history' | 'createdAt'>) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetDays, setTargetDays] = useState(7);
  const [color, setColor] = useState<'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose'>('amber');
  const [icon, setIcon] = useState('Flame');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories: HabitCategory[] = ['Health', 'Mindset', 'Productivity', 'Fitness', 'Learning'];
  const colors: { id: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose'; bg: string; name: string }[] = [
    { id: 'amber', bg: 'bg-amber-500', name: 'Amber Flame' },
    { id: 'indigo', bg: 'bg-indigo-500', name: 'Electric Indigo' },
    { id: 'cyan', bg: 'bg-cyan-500', name: 'Cyan Focus' },
    { id: 'emerald', bg: 'bg-emerald-500', name: 'Emerald Vitality' },
    { id: 'rose', bg: 'bg-rose-500', name: 'Rose Intensity' },
  ];

  const icons = ['Flame', 'Zap', 'Sun', 'Activity', 'BookOpen', 'Moon', 'Target', 'Compass'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a habit name');
      return;
    }

    onSubmit({
      name: name.trim(),
      category,
      frequency,
      targetDaysPerWeek: targetDays,
      color,
      icon,
    });

    setName('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#11141E] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">+ Add Habit Protocol</h3>
              <p className="text-xs text-slate-400">Define daily/weekly frequency and discipline targets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Habit Name <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 15-Minute Morning Mobility & Sunlight"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Domain Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {categories.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all text-left truncate ${
                    category === c
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Cadence & Target Frequency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Cadence & Target Days
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {targetDays} {targetDays === 1 ? 'day' : 'days'} / week
              </span>
            </div>

            {/* Quick Days Selector */}
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setTargetDays(num)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    targetDays === num
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-sm'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>

            {/* Frequency Type */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setFrequency('daily');
                  setTargetDays(7);
                }}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  frequency === 'daily'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                Daily Cadence (7/7)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFrequency('weekly');
                  setTargetDays(5);
                }}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  frequency === 'weekly'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                Weekly Target (5/7)
              </button>
            </div>
          </div>

          {/* Color & Icon Glyph */}
          <div className="grid grid-cols-2 gap-4">
            {/* Color Accent */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Accent Theme
              </label>
              <div className="flex items-center gap-2">
                {colors.map(c => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    title={c.name}
                    className={`w-7 h-7 rounded-lg ${c.bg} transition-transform ${
                      color === c.id ? 'scale-110 ring-2 ring-white shadow-md' : 'opacity-50 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Icon Glyph */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Glyph
              </label>
              <div className="flex flex-wrap gap-1.5">
                {icons.map(ic => (
                  <button
                    type="button"
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`px-2 py-1 text-[11px] rounded-lg border font-mono transition-all ${
                      icon === ic
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/25 transition-all hover:scale-[1.02]"
            >
              + Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
