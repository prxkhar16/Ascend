import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  ListFilter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FocusModeType } from '../types';
import { cn } from '../utils/cn';

export const FocusView: React.FC = () => {
  const {
    tasks,
    activeFocusTask,
    setActiveFocusTask,
    addFocusSession,
    focusMinutesToday,
    focusSessions,
    playSuccessSound,
    triggerConfetti,
  } = useApp();

  // Modes: work (25 min or 50 min), short-break (5 min), long-break (15 min)
  const [mode, setMode] = useState<FocusModeType>('work');
  const [workDuration, setWorkDuration] = useState<number>(25); // 25 or 50 min
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState<boolean>(false);

  // Audio Context Ref for ambient white noise
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Pending tasks available for focus selection
  const pendingTasks = tasks.filter(t => !t.completed);

  // Initialize time when mode or duration changes
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work') {
        setTimeLeft(workDuration * 60);
      } else if (mode === 'short-break') {
        setTimeLeft(5 * 60);
      } else {
        setTimeLeft(15 * 60);
      }
    }
  }, [mode, workDuration, isRunning]);

  // Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session!
      setIsRunning(false);
      playSuccessSound();
      triggerConfetti();

      const completedDuration =
        mode === 'work' ? workDuration : mode === 'short-break' ? 5 : 15;

      addFocusSession({
        durationMinutes: completedDuration,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taskId: activeFocusTask?.id,
        taskTitle: activeFocusTask?.title || 'Deep Work Focus Block',
        mode,
      });

      // Switch mode automatically
      if (mode === 'work') {
        setMode('short-break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, workDuration, activeFocusTask, addFocusSession, playSuccessSound, triggerConfetti]);

  // Ambient sound synthesis
  useEffect(() => {
    if (ambientAudioOn) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Generate gentle pink noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } catch {
        setAmbientAudioOn(false);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
        noiseNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [ambientAudioOn]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const totalSecs =
      mode === 'work' ? workDuration * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60;
    setTimeLeft(totalSecs);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular calculations
  const totalModeSeconds =
    mode === 'work' ? workDuration * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60;
  const progressRatio = (totalModeSeconds - timeLeft) / totalModeSeconds;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium">
          <Timer className="w-3.5 h-3.5" />
          <span>Distraction-Free Sanctuary</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Deep Work Focus Protocol
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Single-task isolation. Eliminate context switching and enter flow state.
        </p>
      </div>

      {/* Main Focus Console Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141724] to-[#0F121C] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Ambient background glow when timer is active */}
        <div
          className={cn(
            "absolute inset-0 bg-indigo-600/10 blur-3xl pointer-events-none transition-opacity duration-1000 -z-0",
            isRunning ? "opacity-100" : "opacity-20"
          )}
        />

        {/* Mode Switcher Tabs */}
        <div className="relative z-10 flex items-center p-1.5 rounded-2xl bg-black/40 border border-white/5 mb-8">
          <button
            onClick={() => {
              setMode('work');
              setIsRunning(false);
            }}
            className={cn(
              "px-5 py-2 rounded-xl text-xs font-semibold transition-all",
              mode === 'work'
                ? "bg-indigo-600 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Deep Work ({workDuration}m)
          </button>
          <button
            onClick={() => {
              setMode('short-break');
              setIsRunning(false);
            }}
            className={cn(
              "px-5 py-2 rounded-xl text-xs font-semibold transition-all",
              mode === 'short-break'
                ? "bg-emerald-600 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => {
              setMode('long-break');
              setIsRunning(false);
            }}
            className={cn(
              "px-5 py-2 rounded-xl text-xs font-semibold transition-all",
              mode === 'long-break'
                ? "bg-cyan-600 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Work Duration Toggle if in work mode */}
        {mode === 'work' && !isRunning && (
          <div className="relative z-10 flex items-center gap-2 mb-6">
            <span className="text-[11px] font-mono text-slate-400">Duration:</span>
            <button
              onClick={() => setWorkDuration(25)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono transition-all",
                workDuration === 25
                  ? "bg-white/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              25m Standard
            </button>
            <button
              onClick={() => setWorkDuration(50)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono transition-all",
                workDuration === 50
                  ? "bg-white/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              50m Deep Flow
            </button>
          </div>
        )}

        {/* Active Task Selector / Anchor */}
        <div className="relative z-10 w-full max-w-md mb-8">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <ListFilter className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Focus Objective:
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {activeFocusTask ? activeFocusTask.title : 'General Unassigned Deep Work Session'}
                </p>
              </div>
            </div>

            {/* Quick Picker Dropdown */}
            {pendingTasks.length > 0 && (
              <select
                value={activeFocusTask?.id || ''}
                onChange={e => {
                  const found = pendingTasks.find(t => t.id === e.target.value);
                  setActiveFocusTask(found || null);
                }}
                className="bg-[#141824] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none max-w-[130px] truncate"
              >
                <option value="">Choose Task</option>
                {pendingTasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Circular Animated SVG Timer */}
        <div className="relative z-10 w-72 h-72 flex items-center justify-center mb-8">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="text-white/[0.04]"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Glowing Active Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className={cn(
                "transition-all duration-1000 ease-linear",
                mode === 'work'
                  ? "text-indigo-500"
                  : mode === 'short-break'
                  ? "text-emerald-500"
                  : "text-cyan-500"
              )}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{
                filter:
                  mode === 'work'
                    ? 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.7))'
                    : 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))',
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mt-2">
              {mode === 'work' ? (isRunning ? 'Flow State Active' : 'Ready to Execute') : 'Recharge Interval'}
            </span>
          </div>
        </div>

        {/* Action Controls: Start / Pause / Reset */}
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={cn(
              "flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95",
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            )}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Interval</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft < totalModeSeconds ? 'Resume Flow' : 'Start Focus'}</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Ambient Noise Generator Toggle */}
          <button
            onClick={() => setAmbientAudioOn(prev => !prev)}
            className={cn(
              "flex items-center gap-2 px-4 py-3.5 rounded-2xl border transition-all text-xs font-medium",
              ambientAudioOn
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-glow-sm"
                : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-slate-200"
            )}
            title="Toggle Ambient Pink Noise"
          >
            {ambientAudioOn ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Zen Audio</span>
          </button>
        </div>
      </div>

      {/* Session History & Daily Focus Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Focus Minutes Today</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white">{focusMinutesToday}</span>
            <span className="text-xs font-mono text-cyan-400">minutes</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Target: 180 min deep work daily</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Completed Intervals</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white">{focusSessions.length}</span>
            <span className="text-xs font-mono text-indigo-400">sessions</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Zero cognitive context switching</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#121520]/80 border border-white/5 backdrop-blur-md shadow-card">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Focus Streak</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-400">{focusSessions.length > 0 ? 1 : 0}</span>
            <span className="text-xs font-mono text-amber-300/80">days consecutive</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Neuroplastic discipline compounds</p>
        </div>
      </div>
    </div>
  );
};
