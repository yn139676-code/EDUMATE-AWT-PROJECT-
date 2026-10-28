
import { useState } from 'react';

export default function ExamCountdown() {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [exams, setExams] = useState([]);

  const addExam = (e) => {
    e.preventDefault();

    if (!examName || !examDate) {
      alert('Please enter the exam name and date.');
      return;
    }

    const newExam = {
      id: Date.now(),
      name: examName,
      date: examDate,
    };

    setExams([...exams, newExam]);
    setExamName('');
    setExamDate('');
  };

  const deleteExam = (id) => {
    setExams(exams.filter((exam) => exam.id !== id));
  };

  const getDaysLeft = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const examDay = new Date(date);
    examDay.setHours(0, 0, 0, 0);

    return Math.ceil((examDay - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>📅 Exam Countdown</h1>
      <p>Keep track of your upcoming exams and stay prepared!</p>

      <form onSubmit={addExam}>
        <input
          type="text"
          placeholder="Enter exam name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />

        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />

        <button type="submit">Add Exam</button>
      </form>

      <div style={{ marginTop: '30px' }}>
        {exams.map((exam) => {
          const daysLeft = getDaysLeft(exam.date);

          return (
            <div
              key={exam.id}
              style={{
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '12px',
                background: '#f0edff',
                color: '#222',
              }}
            >
              <h3>{exam.name}</h3>

              <p>Exam Date: {exam.date}</p>

              <h2>
                {daysLeft > 0
                  ? `${daysLeft} days left`
                  : daysLeft === 0
                  ? 'Exam is today!'
                  : 'Exam completed'}
              </h2>

              <button onClick={() => deleteExam(exam.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

