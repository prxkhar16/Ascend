import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandMenu } from './components/common/CommandMenu';
import { TaskModal } from './components/modals/TaskModal';
import { HabitModal } from './components/modals/HabitModal';
import { QuickActionModal } from './components/modals/QuickActionModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { HabitsView } from './views/HabitsView';
import { AnalyticsView } from './views/AnalyticsView';
import { FocusView } from './views/FocusView';
import { AiCoachView } from './views/AiCoachView';

import { Task } from './types';

const MainAppContent: React.FC = () => {
  const { currentView, addTask, updateTask, addHabit } = useApp();
  const { user } = useAuth();

  // Navigation and Modals State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenTaskModal = (task?: Task | null) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  // If on landing view or user is not logged in, render the Landing View
  if (currentView === 'landing' || !user) {
    return <LandingView />;
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCommand={() => setIsCommandMenuOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCommand={() => setIsCommandMenuOpen(true)}
          onOpenQuickCreate={() => setIsQuickActionModalOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 px-4 sm:px-8 pt-6 pb-12 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenTaskModal={() => handleOpenTaskModal()}
              onOpenHabitModal={() => setIsHabitModalOpen(true)}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView onOpenTaskModal={handleOpenTaskModal} />
          )}

          {currentView === 'habits' && (
            <HabitsView onOpenHabitModal={() => setIsHabitModalOpen(true)} />
          )}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'focus' && <FocusView />}

          {currentView === 'ai' && <AiCoachView />}
        </main>
      </div>

      {/* Command Menu (⌘K / Ctrl+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onOpenTaskModal={() => handleOpenTaskModal()}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
      />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={addTask}
        onUpdate={updateTask}
        initialTask={editingTask}
      />

      {/* Habit Creation Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSubmit={addHabit}
      />

      {/* Quick Action Selection Modal */}
      <QuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onSelectTask={() => handleOpenTaskModal()}
        onSelectHabit={() => setIsHabitModalOpen(true)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
