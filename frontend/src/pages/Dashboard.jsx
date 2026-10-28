 import { useState, useEffect } from 'react';
import {
  getAssignments,
  getTasks,
  getPresentations,
} from '../api';

import {
  MdAssignment,
  MdChecklist,
  MdDoneAll,
  MdWarning,
  MdSlideshow,
  MdAutoAwesome,
  MdCalendarToday,
  MdArrowForward,
  MdAccessTime,
} from 'react-icons/md';

function StatCard({ label, value, icon, color, subtitle }) {
  return (
    <div className="premium-stat-card" style={{ '--stat-color': color }}>
      <div className="premium-stat-top">
        <div className="premium-stat-icon">{icon}</div>
        <span className="premium-stat-dot" />
      </div>

      <div className="premium-stat-value">{value}</div>

      <div className="premium-stat-label">{label}</div>

      <div className="premium-stat-subtitle">{subtitle}</div>
    </div>
  );
}

function UpcomingItem({ title, subject, date, type }) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const isOverdue = d < new Date();

  return (
    <div className="premium-upcoming-item">
      <div
        className={`premium-date-badge ${isOverdue ? 'overdue' : ''}`}
      >
        <span className="premium-date-day">{day}</span>
        <span className="premium-date-month">{month}</span>
      </div>

      <div className="premium-upcoming-info">
        <div className="premium-upcoming-title">{title}</div>

        <div className="premium-upcoming-meta">
          <span>{subject}</span>
          <span className="premium-meta-dot">•</span>
          <span>{type}</span>
        </div>
      </div>

      {isOverdue ? (
        <span className="premium-overdue-badge">Overdue</span>
      ) : (
        <MdArrowForward className="premium-upcoming-arrow" />
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    tasks: 0,
    tasksDone: 0,
    presentations: 0,
  });

  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, tRes, pRes] = await Promise.all([
          getAssignments(),
          getTasks(),
          getPresentations(),
        ]);

        const assignments = aRes.data.data;
        const tasks = tRes.data.data;
        const presentations = pRes.data.data;

        setStats({
          total: assignments.length,
          pending: assignments.filter(
            (a) => a.status === 'pending'
          ).length,
          completed: assignments.filter(
            (a) => a.status === 'completed'
          ).length,
          tasks: tasks.length,
          tasksDone: tasks.filter((t) => t.completed).length,
          presentations: presentations.length,
        });

        const upcomingItems = [
          ...assignments
            .filter((a) => a.status === 'pending')
            .map((a) => ({
              title: a.title,
              subject: a.subject,
              date: a.dueDate,
              type: 'Assignment',
            })),

          ...presentations.map((p) => ({
            title: p.title,
            subject: p.subject,
            date: p.presentationDate,
            type: 'Presentation',
          })),
        ]
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6);

        setUpcoming(upcomingItems);
      } catch (e) {
        console.warn('Backend not reachable:', e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="premium-loading-orb" />
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

  const completionRate =
    stats.tasks > 0
      ? Math.round((stats.tasksDone / stats.tasks) * 100)
      : 0;

  return (
    <div className="premium-dashboard">

      {/* HERO SECTION */}

      <section className="premium-hero">
        <div className="premium-hero-glow" />

        <div className="premium-hero-content">
          <div className="premium-hero-tag">
            <MdAutoAwesome />
            YOUR PERSONAL STUDY SPACE
          </div>

          <h1>
            {greeting}, <span>Scholar!</span> 👋
          </h1>

          <p>
            Your goals are within reach.
            Let's make today a productive one.
          </p>

          <div className="premium-hero-bottom">
            <div className="premium-hero-status">
              <span className="premium-status-dot" />
              Your workspace is ready
            </div>
          </div>
        </div>

        <div className="premium-hero-art">
          <div className="premium-orbit premium-orbit-one" />
          <div className="premium-orbit premium-orbit-two" />

          <div className="premium-hero-emoji">🎓</div>

          <div className="premium-floating-card">
            <MdAutoAwesome />
            <span>Stay focused</span>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="premium-section">
        <div className="premium-section-heading">
          <div>
            <span className="premium-section-eyebrow">
              YOUR OVERVIEW
            </span>

            <h2>Academic performance</h2>
          </div>

          <span className="premium-section-caption">
            Your progress at a glance
          </span>
        </div>

        <div className="premium-stat-grid">
          <StatCard
            label="Total Assignments"
            value={stats.total}
            icon={<MdAssignment />}
            color="#9275ff"
            subtitle="All your assignments"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<MdWarning />}
            color="#ffc66e"
            subtitle="Awaiting completion"
          />

          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<MdDoneAll />}
            color="#39e6b0"
            subtitle="Successfully finished"
          />

          <StatCard
            label="Presentations"
            value={stats.presentations}
            icon={<MdSlideshow />}
            color="#27d9ff"
            subtitle="Your presentations"
          />
        </div>
      </section>

      {/* LOWER DASHBOARD */}

      <section className="premium-dashboard-grid">

        {/* STUDY PROGRESS */}

        <div className="premium-panel premium-progress-panel">
          <div className="premium-panel-heading">
            <div>
              <span className="premium-section-eyebrow">
                DAILY ACTIVITY
              </span>

              <h2>Study progress</h2>
            </div>

            <div className="premium-panel-icon">
              <MdChecklist />
            </div>
          </div>

          <div className="premium-progress-number">
            <span>{completionRate}%</span>
            <span className="premium-progress-caption">
              completed
            </span>
          </div>

          <div className="premium-progress-track">
            <div
              className="premium-progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="premium-progress-footer">
            <span>
              {stats.tasksDone} of {stats.tasks} tasks completed
            </span>

            <span className="premium-progress-highlight">
              {completionRate === 100
                ? 'All done!'
                : 'Keep going'}
            </span>
          </div>

          <div className="premium-progress-divider" />

          <div className="premium-focus-message">
            <div className="premium-focus-icon">
              <MdAutoAwesome />
            </div>

            <div>
              <h3>Small steps, big results.</h3>
              <p>
                Every task you complete brings you closer to your goals.
              </p>
            </div>
          </div>
        </div>

        {/* UPCOMING DEADLINES */}

        <div className="premium-panel premium-deadlines-panel">
          <div className="premium-panel-heading">
            <div>
              <span className="premium-section-eyebrow">
                STAY ON TRACK
              </span>

              <h2>Upcoming deadlines</h2>
            </div>

            <div className="premium-panel-icon cyan">
              <MdCalendarToday />
            </div>
          </div>

          <div className="premium-deadlines-count">
            <span>{upcoming.length}</span>
            <span>
              {upcoming.length === 1
                ? 'upcoming item'
                : 'upcoming items'}
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="premium-empty-state">
              <div className="premium-empty-icon">🎉</div>

              <h3>You're all caught up!</h3>

              <p>
                No upcoming deadlines right now.
                Enjoy your breathing room.
              </p>
            </div>
          ) : (
            <div className="premium-upcoming-list">
              {upcoming.map((item, i) => (
                <UpcomingItem key={i} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM TIP */}

      <div className="premium-bottom-tip">
        <div className="premium-tip-icon">
          <MdAccessTime />
        </div>

        <div>
          <strong>Make time for focused learning</strong>
          <p>
            Consistency beats intensity. Keep showing up for yourself.
          </p>
        </div>
      </div>

    </div>
  );
}