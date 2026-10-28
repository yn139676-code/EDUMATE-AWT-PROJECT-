
import { useState } from 'react';

function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState('');

  const addTask = () => {
    if (subject.trim() && taskName.trim() && date) {
      const newTask = {
        id: Date.now(),
        subject,
        taskName,
        date,
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setSubject('');
      setTaskName('');
      setDate('');
    }
  };

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div style={{ padding: '30px', color: 'white' }}>
      <h1>📅 Smart Study Planner</h1>
      <p>Plan your study sessions and stay organized.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Subject (e.g. Mathematics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Study task (e.g. Revise Chapter 2)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={addTask}>Add Study Plan</button>
      </div>

      <h2>My Study Plans</h2>

      {tasks.length === 0 && <p>No study plans added yet.</p>}

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            marginBottom: '15px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: '#28243a',
          }}
        >
          <h3>{task.subject}</h3>
          <p>{task.taskName}</p>
          <p>📅 {task.date}</p>

          <button onClick={() => toggleCompleted(task.id)}>
            {task.completed ? 'Completed ✓' : 'Mark as Completed'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudyPlanner;

