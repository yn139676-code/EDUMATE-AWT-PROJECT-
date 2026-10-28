 import { useState } from 'react';

function StudyStreak() {
  const [streak, setStreak] = useState(0);
  const [studiedToday, setStudiedToday] = useState(false);

  function markStudied() {
    if (!studiedToday) {
      setStreak(streak + 1);
      setStudiedToday(true);
    }
  }

  return (
    <div style={{ padding: '30px', textAlign: 'center', color: 'white' }}>
      <h1>🔥 Study Streak</h1>

      <h2>{streak} {streak === 1 ? 'Day' : 'Days'}</h2>

      <p>
        {studiedToday
          ? 'Great job! You have studied today!'
          : 'Keep your learning streak going!'}
      </p>

      <button
        onClick={markStudied}
        disabled={studiedToday}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: studiedToday ? 'default' : 'pointer',
          backgroundColor: studiedToday ? '#888' : '#7c3aed',
          color: 'white'
        }}
      >
        {studiedToday ? 'Studied Today ✓' : 'I Studied Today'}
      </button>
    </div>
  );
}

export default StudyStreak;