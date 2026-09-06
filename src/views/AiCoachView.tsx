import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Brain,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_AI_INSIGHTS } from '../data/mockData';
import { askGeminiCoach, getGeminiStatus } from '../services/geminiService';
import { cn } from '../utils/cn';

export const AiCoachView: React.FC = () => {
  const { user } = useAuth();
  const { tasks, habits, dailyCompletionPercentage, focusMinutesToday } = useApp();
  
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const geminiStatus = getGeminiStatus();

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || isGenerating) return;
    setIsGenerating(true);
    setChatResponse('');

    const context = {
      tasks,
      habits,
      userName: user?.displayName ? user.displayName.split(' ')[0] : 'Alex',
      completionRate: dailyCompletionPercentage,
    };

    try {
      const response = await askGeminiCoach(questionText, context, (partial) => {
        setChatResponse(partial);
      });
      setChatResponse(response);
    } catch (err) {
      console.error(err);
      setChatResponse('An unexpected error occurred while generating coaching advice. Please try again.');
    } finally {
      setIsGenerating(false);
      setQuery('');
    }
  };

  const samplePrompts = [
    "Diagnose my current habit consistency",
    "How can I optimize my morning focus window?",
    "Design tomorrow's high-leverage execution schedule",
    "Identify friction points slowing down my deliverables",
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171228] via-[#1E1638] to-[#121520] border border-purple-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 blur-3xl pointer-events-none -z-0" />

        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini AI Cognitive Layer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ascend Intelligence & AI Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Continuous synthesis of your habits, deliverables, and focus velocity to provide tactical executive directives.
          </p>
        </div>

        {/* Engine Status Badge */}
        <div className="z-10 flex items-center gap-2 p-2 px-3.5 rounded-2xl bg-black/40 border border-purple-500/20 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block uppercase">Security Architecture</span>
            <span className="text-slate-200 font-semibold">
              {geminiStatus.isConfigured ? 'Gemini Live Connected' : 'Simulated Engine (Offline Safe)'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive AI Coach Prompt Terminal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121520]/90 border border-purple-500/20 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Consult Ascend AI Coach</h3>
            <p className="text-xs text-slate-400">
              Inquire about scheduling, habit stacking, cognitive friction, or output bottlenecks.
            </p>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(promptText);
                handleAsk(promptText);
              }}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-200 text-xs font-medium transition-all hover:scale-[1.02] disabled:opacity-50 text-left"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={isGenerating}
            placeholder="Ask your coach anything (e.g. 'How should I structure my work intervals today?')..."
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim() || isGenerating}
            className="absolute right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Response Box */}
        {(chatResponse || isGenerating) && (
          <div className="p-6 rounded-2xl bg-[#161928] border border-purple-500/30 text-slate-200 text-xs sm:text-sm space-y-3 leading-relaxed shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono text-purple-300">
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Ascend Tactical Output</span>
              </span>
              {isGenerating && (
                <span className="animate-pulse text-purple-400">Synthesizing...</span>
              )}
            </div>

            <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line">
              {chatResponse}
            </div>
          </div>
        )}
      </div>

      {/* Weekly Executive Performance Audit */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121520]/80 border border-white/5 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
              Sprint 1 Calibrated
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Weekly Executive Summary</h3>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
            Baseline Active • Level 1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400">Deep Work Accumulation</span>
            <p className="text-2xl font-bold text-white">{(focusMinutesToday / 60).toFixed(1)} Hours</p>
            <p className="text-[11px] text-slate-400">Target: 15h weekly cadence</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400">Habit Adherence Rate</span>
            <p className="text-2xl font-bold text-white">
              {habits.length > 0 ? `${Math.round((habits.filter(h => h.currentStreak > 0).length / habits.length) * 100)}%` : '0%'}
            </p>
            <p className="text-[11px] text-amber-400">{habits.length} Active Protocols</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400">Execution Yield</span>
            <p className="text-2xl font-bold text-white">
              {tasks.length > 0 ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` : '0%'}
            </p>
            <p className="text-[11px] text-cyan-400">
              {tasks.filter(t => t.completed).length} of {tasks.length} objectives completed
            </p>
          </div>
        </div>
      </div>

      {/* Structured Tactical Insights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Algorithmic Pattern Insights</h3>
          <span className="text-xs font-mono text-slate-500">{INITIAL_AI_INSIGHTS.length} Active Signals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INITIAL_AI_INSIGHTS.map(insight => {
            const isWarning = insight.type === 'warning';
            const isStreak = insight.type === 'streak';

            return (
              <div
                key={insight.id}
                className={cn(
                  "p-6 rounded-3xl bg-[#121520]/80 border shadow-card transition-all space-y-4",
                  isWarning
                    ? "border-amber-500/20 hover:border-amber-500/40"
                    : isStreak
                    ? "border-indigo-500/20 hover:border-indigo-500/40"
                    : "border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "p-2 rounded-xl",
                        isWarning
                          ? "bg-amber-500/10 text-amber-400"
                          : isStreak
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-purple-500/10 text-purple-400"
                      )}
                    >
                      {isWarning ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isStreak ? (
                        <Flame className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {insight.category} • {insight.timestamp}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{insight.title}</h4>
                    </div>
                  </div>

                  {insight.metric && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5 shrink-0">
                      {insight.metric}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {insight.summary}
                </p>

                {/* Non-negotiable Action Item */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-200 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-purple-300">Action Item: </span>
                    <span>{insight.actionItem}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
