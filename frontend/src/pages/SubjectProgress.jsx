
import { useState } from 'react';

function SubjectProgress() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [progress, setProgress] = useState('');

  const addSubject = () => {
    if (subjectName.trim() !== '' && progress !== '') {
      const newSubject = {
        id: Date.now(),
        name: subjectName,
        progress: Number(progress),
      };

      setSubjects([...subjects, newSubject]);
      setSubjectName('');
      setProgress('');
    }
  };

  return (
    <div style={{ padding: '30px', color: 'white' }}>
      <h1>📊 Subject Progress Tracker</h1>
      <p>Track your learning progress for each subject.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Progress %"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />

        <button onClick={addSubject}>Add Subject</button>
      </div>

      {subjects.map((subject) => (
        <div key={subject.id} style={{ marginBottom: '20px' }}>
          <h3>{subject.name} - {subject.progress}%</h3>

          <div style={{
            width: '100%',
            backgroundColor: '#ddd',
            borderRadius: '10px',
            height: '20px'
          }}>
            <div style={{
              width: `${subject.progress}%`,
              backgroundColor: '#7c3aed',
              height: '20px',
              borderRadius: '10px'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubjectProgress;

