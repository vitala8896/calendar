import React, { useState } from 'react';

interface DayCellProps {
  day: string;
  tasks: string[];
  onAddTask: (task: string) => void;
  onRemoveTask: (task: string) => void;
  isToday: boolean; 
}

const DayCell: React.FC<DayCellProps> = ({ day, tasks, onAddTask, onRemoveTask, isToday }) => {
  const [showButtons, setShowButtons] = useState(false);

  const isWeekend = new Date(day).getDay() === 6 || new Date(day).getDay() === 5;
  const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  return (
    <div
      style={{
        backgroundColor: isWeekend ? '#d0d0d0' : '#f0f0f0',
        padding: '8px',
        position: 'relative',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '150px',
        border: isToday ? '2px solid lightgreen' : 'none',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <h3>{day}</h3>
      <ul style={{ padding: '0' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{backgroundColor: 'white', borderRadius: '5px',
           listStyle: 'none', height: '50px', width: '100%', position: 'relative', marginBottom: '3px' }}>
            <div style={{
              height: '5px',
              width: '25px',
              borderRadius: '4px',
              background: getRandomHexColor(),
              margin: '3px'
            }}></div>
            {task}
            {showButtons && (
              <button
                style={{
                  position: 'absolute',
                  top: 0, 
                  right: 0,
                  color: 'black',
                  marginLeft: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => onRemoveTask(task)}
              >
                x
              </button>
            )}
          </li>
        ))}
      </ul>
      {showButtons && (
        <button
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: 'black',
            cursor: 'pointer',
          }}
          onClick={() => onAddTask(prompt('Enter a task') || '')}
        >
          +
        </button>
      )}
    </div>
  );
};

export default DayCell;
