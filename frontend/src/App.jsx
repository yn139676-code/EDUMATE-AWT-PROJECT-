import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import MobileTopbar from './components/MobileTopbar';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Tasks from './pages/Tasks';
import Presentations from './pages/Presentations';
import FocusTimer from './components/FocusTimer';
import ExamCountdown from './pages/ExamCountdown';
import StudyStreak from './pages/StudyStreak';
import SubjectProgress from './pages/SubjectProgress';
import StudyPlanner from './pages/StudyPlanner';
import './index.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="layout">
        <MobileTopbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/presentations" element={<Presentations />} />
            <Route path="/focus-timer" element={<FocusTimer />} />
            <Route path="/exam-countdown" element={<ExamCountdown />} />
            <Route path="/study-streak" element={<StudyStreak />} />
            <Route path="/subject-progress" element={<SubjectProgress />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="*" element={
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Page not found</h3>
                <p>Go back to the Dashboard.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}
