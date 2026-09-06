import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Clock, Calendar, Tag, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '../../types';
import { getTodayString } from '../../data/mockData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [dueDate, setDueDate] = useState(getTodayString(0));
  const [dueTime, setDueTime] = useState('10:00');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate || getTodayString(0));
      setDueTime(initialTask.dueTime || '10:00');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setDueDate(getTodayString(0));
      setDueTime('10:00');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (initialTask && onUpdate) {
      onUpdate(initialTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate,
        dueTime: dueTime || undefined,
      });
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate,
        dueTime: dueTime || undefined,
        completed: false,
      });
    }

    onClose();
  };

  const categories: TaskCategory[] = [
    'Work',
    'Deep Work',
    'Health',
    'Personal',
    'Learning',
    'Finance',
  ];

  const timePresets = ['08:00', '10:00', '13:00', '15:30', '18:00', '21:00'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#11141E] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {initialTask ? 'Edit Task' : '+ Add Custom Task'}
              </h3>
              <p className="text-xs text-slate-300">Set priority tags and target schedule</p>
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

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Architect distributed event pipeline"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Action Deliverables (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Key deliverables, acceptance criteria, or links..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Priority Selection with distinct colored tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Priority Tag <span className="text-indigo-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  priority === 'high'
                    ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-rose-300 hover:bg-rose-500/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>High</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-amber-300 hover:bg-amber-500/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  priority === 'low'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Low</span>
              </button>
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-400" /> Domain Category
                </span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c} className="bg-[#141824] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" /> Due Date
                </span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Due Time & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" /> Due Time
              </label>
              <span className="text-[11px] font-mono text-indigo-400">{dueTime}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick time preset chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono text-slate-500 shrink-0">Presets:</span>
              {timePresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setDueTime(preset)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                    dueTime === preset
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {preset}
                </button>
              ))}
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              {initialTask ? 'Save Changes' : '+ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
