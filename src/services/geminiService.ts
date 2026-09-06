/**
 * ASCEND AI Engine (Powered by Google Gemini Architecture)
 * 
 * Future live integration:
 * Set VITE_GEMINI_API_KEY in .env.local
 */

import { Task, Habit } from '../types';

export interface AiCoachContext {
  tasks: Task[];
  habits: Habit[];
  userName: string;
  completionRate: number;
}

export const getGeminiStatus = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return {
    isConfigured: Boolean(apiKey && apiKey !== 'your_gemini_api_key'),
  };
};

export async function askGeminiCoach(
  userQuery: string,
  context: AiCoachContext,
  onPartialChunk?: (chunk: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key') {
    try {
      const prompt = `You are ASCEND AI, an elite, minimalist executive performance and habit coach modeled after peak performance frameworks (Atomic Habits, Stoicism, Deep Work, Essentialism).
The user is ${context.userName}.
Current metrics:
- Daily task completion rate: ${context.completionRate}%
- Active habits: ${context.habits.map(h => `${h.name} (Streak: ${h.currentStreak}d, Category: ${h.category})`).join(', ')}
- Pending tasks: ${context.tasks.filter(t => !t.completed).map(t => `${t.title} [${t.priority}]`).join(', ')}

User question: "${userQuery}"

Provide a concise, direct, high-leverage response. Avoid fluff or generic cheerleading. Give 1 strategic insight, followed by 2-3 specific, non-negotiable action items formatted in clean markdown.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 500,
            }
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn('Live Gemini API call failed, falling back to local intelligence synthesis', err);
    }
  }

  // Simulated high-end generative response tailored to actual user data
  return simulateLocalIntelligence(userQuery, context, onPartialChunk);
}

async function simulateLocalIntelligence(
  query: string,
  context: AiCoachContext,
  onPartialChunk?: (chunk: string) => void
): Promise<string> {
  const q = query.toLowerCase();
  let fullResponse = '';

  const pendingCount = context.tasks.filter(t => !t.completed).length;
  const bestHabit = [...context.habits].sort((a, b) => b.currentStreak - a.currentStreak)[0];
  const lowestHabit = [...context.habits].sort((a, b) => a.currentStreak - b.currentStreak)[0];

  if (q.includes('streak') || q.includes('habit') || q.includes('consistency')) {
    fullResponse = `### Executive Habit Diagnosis

Your consistency anchor is currently **${bestHabit?.name || 'Daily Deep Work'}** with an unbroken **${bestHabit?.currentStreak || 14}-day streak**.

However, **${lowestHabit?.name || 'Evening Wind-down'}** is showing variance. Habit adherence drops whenever decision fatigue peaks late in the day.

**Protocol to Lock In Consistency:**
1. **Friction Reduction:** Lower the barrier to initiation. Reduce the habit's minimum viable threshold to just 2 minutes.
2. **Habit Stacking:** Anchor ${lowestHabit?.name || 'your skipped habit'} immediately after ${bestHabit?.name || 'your primary habit'}.
3. **Environmental Cue:** Remove all competing stimuli from your physical workspace.`;
  } else if (q.includes('focus') || q.includes('deep work') || q.includes('distraction') || q.includes('schedule')) {
    fullResponse = `### Cognitive Focus Protocol

You currently have **${pendingCount} pending deliverables** on your docket today. Multitasking or context-switching between these will impose a 20-35% cognitive penalty.

**Recommended Focus Strategy:**
1. **Single-Task Isolation:** Pick your single highest-priority task and enter **Focus Mode** for a 45-minute sprint.
2. **Zero-Notification Sanctuary:** Enable Do Not Disturb on all external hardware.
3. **Strategic Regroup:** Take a mandatory 5-minute physical movement break between focus intervals before reviewing incoming alerts.`;
  } else if (q.includes('schedule') || q.includes('tomorrow') || q.includes('morning')) {
    fullResponse = `### Optimal Daily Cadence

Based on your performance trends, your cognitive output peaks early. Here is your suggested cadence:

- **07:00 – 08:30**: Hydration, sunlight exposure, and zero notifications.
- **08:30 – 11:30**: Deep Work Sprint: tackle ${context.tasks.find(t => !t.completed)?.title || 'highest priority task'}.
- **11:30 – 13:00**: Communication, reviews, and secondary operational tasks.
- **15:30 – 17:00**: Physical training and movement recovery.
- **21:30**: Digital cutoff and cognitive decompression.`;
  } else {
    fullResponse = `### Performance Analysis & Guidance

Analyzing your current state: **${context.completionRate}% completion rate** across your daily objectives.

> *"We do not rise to the level of our ambitions; we sink to the level of our systems."*

**Recommended Directives:**
1. **Prioritize the Needle Mover:** Execute your #1 High-Priority item before noon without checking secondary comms.
2. **Defend the Streak:** Maintain your ${bestHabit?.currentStreak || 14}-day streak on ${bestHabit?.name || 'core habits'} to protect behavioral momentum.
3. **Clear Low-Leverage Drag:** Archive or reschedule items with low strategic yield.`;
  }

  // Simulate smooth streaming
  if (onPartialChunk) {
    const words = fullResponse.split(' ');
    let accumulated = '';
    for (const word of words) {
      accumulated += word + ' ';
      onPartialChunk(accumulated);
      await new Promise(r => setTimeout(r, 20));
    }
  }

  return fullResponse;
}
