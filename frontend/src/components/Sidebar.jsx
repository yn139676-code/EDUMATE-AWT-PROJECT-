import { NavLink } from 'react-router-dom';
import {
  MdDashboard, MdAssignment, MdChecklist,
  MdSlideshow, MdClose, MdTimer , MdEvent
} from 'react-icons/md';


const navItems = [
  { to: '/', label: 'Dashboard', icon: <MdDashboard /> },
  { to: '/assignments', label: 'Assignments', icon: <MdAssignment /> },
  { to: '/tasks', label: 'Daily Tasks', icon: <MdChecklist /> },
  { to: '/presentations', label: 'Presentations', icon: <MdSlideshow /> },
  { to: '/focus-timer', label: 'Focus Timer', icon: <MdTimer /> },
  { to: '/exam-countdown', label: 'Exam Countdown', icon: <MdEvent /> },
  { to: '/study-streak', label: 'Study Streak', icon: '🔥' },
  { to: '/subject-progress', label: 'Subject Progress', icon: '📊' },
  { to: '/study-planner', label: 'Smart Study Planner', icon: '📅' },
];


export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>
          <h2>EduMate</h2>
        </div>

        <nav>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          EduMate v1.0 &bull; Day 1
        </div>
      </aside>
    </>
  );
}
