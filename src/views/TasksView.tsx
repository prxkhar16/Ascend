import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskCategory } from '../types';
import { getTodayString } from '../data/mockData';
import { cn } from '../utils/cn';

interface TasksViewProps {
  onOpenTaskModal: (task?: Task | null) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenTaskModal }) => {
  const {
    tasks,
    toggleTask,
    deleteTask,
    reorderTasks,
    setActiveFocusTask,
    setCurrentView,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getTodayString(0);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Status
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    // Priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    // Category
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

    return true;
  });

  // Calculate stats
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderTasks(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < tasks.length - 1) reorderTasks(index, index + 1);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121520] via-[#151928] to-[#121520] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Execution Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Structure your day into concrete, high-leverage deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onOpenTaskModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Tasks</span>
          <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Pending</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Completed</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Execution Velocity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-400">{completionRate}%</span>
            <span className="text-xs text-slate-500 font-mono">today</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121520]/60 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-black/30 border border-white/5 text-xs">
            {(['all', 'pending', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium capitalize transition-all",
                  statusFilter === tab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141824] border border-white/10 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141824] border border-white/10 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Deep Work">Deep Work</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121520]/40 border border-white/5 space-y-3">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
            <h4 className="text-sm font-bold text-white">
              {tasks.length === 0 ? 'No daily tasks created yet' : 'No tasks match your filter criteria'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {tasks.length === 0
                ? 'Define your first high-leverage deliverable to jumpstart daily focus and track execution.'
                : 'Clear your search or filter options to reveal your other tasks.'}
            </p>
            <button
              onClick={() => onOpenTaskModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md inline-block hover:scale-105 transition-all"
            >
              {tasks.length === 0 ? 'Create First Task' : 'Add New Task'}
            </button>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isToday = task.dueDate === todayStr;
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group shadow-card",
                  task.completed
                    ? "bg-[#11131C]/60 border-white/5 opacity-65"
                    : "bg-[#141824]/80 hover:bg-[#181D2C] border-white/5 hover:border-indigo-500/30"
                )}
              >
                {/* Left: Drag Handle, Checkbox, Content */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:text-indigo-400 disabled:opacity-20 text-slate-400"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === tasks.length - 1}
                      className="p-1 hover:text-indigo-400 disabled:opacity-20 text-slate-400"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Complete Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "w-6 h-6 rounded-xl border flex items-center justify-center transition-all shrink-0",
                      task.completed
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-glow-sm"
                        : "border-white/20 hover:border-indigo-400 bg-white/[0.02]"
                    )}
                  >
                    {task.completed && <CheckSquare className="w-4 h-4 stroke-[2.5]" />}
                  </button>

                  {/* Details */}
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold truncate transition-all",
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-white group-hover:text-indigo-100"
                        )}
                      >
                        {task.title}
                      </p>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono">
                      {/* Priority pill */}
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md font-bold uppercase",
                          task.priority === 'high'
                            ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                            : task.priority === 'medium'
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        )}
                      >
                        {task.priority}
                      </span>

                      {/* Category */}
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                        {task.category}
                      </span>

                      {/* Due Time */}
                      {task.dueTime && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {task.dueTime}
                        </span>
                      )}

                      {/* Date */}
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {isToday ? 'Today' : task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Enter Focus Button */}
                  {!task.completed && (
                    <button
                      onClick={() => {
                        setActiveFocusTask(task);
                        setCurrentView('focus');
                      }}
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium transition-colors"
                      title="Focus on this task"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Focus</span>
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => onOpenTaskModal(task)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit Task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
