import React from 'react';
import {
  ArrowRight,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Timer,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const LandingView: React.FC = () => {
  const { loginWithGoogle, loginAsGuest, isFirebaseConfigured } = useAuth();
  const { setCurrentView } = useApp();

  const handleLaunch = () => {
    loginAsGuest();
    setCurrentView('dashboard');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 22h20L12 2z" />
              <path d="M12 8l-4.5 9h9L12 8z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white">ASCEND</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunch}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Explore Demo
          </button>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 20.4 7.5 23 12 23z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>v1.0 Life Operating System • Built for Disciplined Achievers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Architect your daily discipline.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
            Compound your potential.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Not another generic checklist. ASCEND is a premium personal Life OS integrating high-leverage daily task architecture, unbroken habit streak psychology, distraction-free focus sessions, and AI-driven performance coaching.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Enter Life OS Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-sm transition-all"
          >
            <span>Google Sign-In</span>
            <span className="text-xs font-mono text-slate-400">
              ({isFirebaseConfigured ? 'Firebase Live' : 'Demo Mode'})
            </span>
          </button>
        </div>

        {/* Interactive App Preview Showcase Card */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0E111A]/90 p-4 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden">
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400">ascend.lifeos.app</span>
            </div>
            <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Clean Slate Architecture • Level 1
            </span>
          </div>

          {/* Grid Preview */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Metric 1 */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">Daily Execution</span>
                <span className="text-xs font-bold text-indigo-400">0% Baseline</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">0 Tasks Active</p>
              <p className="text-xs text-slate-400">Ready to organize daily priorities</p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">Streak Foundation</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">0 Days Streak</p>
              <p className="text-xs text-slate-400">Start day 1 with your first habit</p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">Ascend AI Coach</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">Calibrated</p>
              <p className="text-xs text-slate-400">Cognitive engine ready to assist</p>
            </div>
          </div>
        </div>

        {/* Feature Pillars */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">High-Leverage Tasks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prioritize with intention. Drag-and-drop order, priority weights, and instant daily completion velocity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Habit Streak Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              7-day interactive history tracking, psychological streak retention, and category distribution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Distraction-Free Focus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sleek Pomodoro timer with task binding, ambient audio modes, and verified deep work intervals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Ascend AI Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pattern diagnosis, weekly performance audits, and actionable directives engineered for Gemini API.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 ASCEND Life OS. Engineered for peak personal consistency.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Operational
          </span>
          <button
            onClick={handleLaunch}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Launch Web App
          </button>
        </div>
      </footer>
    </div>
  );
};
