 
import { useState, useEffect } from 'react';

function FocusTimer() {
 const [minutes, setMinutes] = useState(25);
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [selectedTime, setSelectedTime] = useState(25);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }

        setMinutes((prevMinutes) => {
          if (prevMinutes > 0) {
            return prevMinutes - 1;
          }
          return 0;
        });

        return 59;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      setIsRunning(false);
      alert('Great job! Focus session completed.');
    }
  }, [minutes, seconds]);

  const resetTimer = () => {
  setIsRunning(false);
  setMinutes(selectedTime);
  setSeconds(0);
};

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Focus Timer</h2>
<div>
  <button onClick={() => {
    setSelectedTime(15);
    setMinutes(15);
    setSeconds(0);
    setIsRunning(false);
  }}>15 min</button>

  <button onClick={() => {
    setSelectedTime(25);
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  }}>25 min</button>

  <button onClick={() => {
    setSelectedTime(45);
    setMinutes(45);
    setSeconds(0);
    setIsRunning(false);
  }}>45 min</button>

  <button onClick={() => {
    setSelectedTime(60);
    setMinutes(60);
    setSeconds(0);
    setIsRunning(false);
  }}>60 min</button>
</div>
      <h1>
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </h1>

      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>

      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default FocusTimer;

