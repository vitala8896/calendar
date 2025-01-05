import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DayCell from './DayCell';



const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks && Object.keys(tasks).length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const getMonthDaysWithPadding = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; 

    const emptyDays = Array.from({ length: firstDayIndex }, () => null);

    
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(date.getFullYear(), date.getMonth(), i + 1);
      return day;
    });

    return [...emptyDays, ...days];
  };

  const handleSwitchDate = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleAddTask = (day: string, task: string) => {
    setTasks((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), task],
    }));
  };

  const handleRemoveTask = (day: string, task: string) => {
    setTasks((prev) => {
      const updatedTasks = { ...prev };
      updatedTasks[day] = updatedTasks[day].filter((t) => t !== task);
      return updatedTasks;
    });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysToDisplay = getMonthDaysWithPadding(currentDate);

  return (
    <Wrapper>
      <Container>
        <Header>
          <div>
            <button onClick={handleSwitchDate.bind(null, 'prev')}>&uarr;</button>
            <button onClick={handleSwitchDate.bind(null, 'next')}>&darr;</button>
          </div>
          <MonthYear>{`${monthName} ${year}`}</MonthYear>
        </Header>

        <DayNames>
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </DayNames>

        <CalendarGrid>
          {daysToDisplay.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />; // Порожня комірка
            }

            const dayStr = day.toISOString().split('T')[0];
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <DayCell
                key={dayStr}
                day={dayStr}
                tasks={tasks[dayStr] || []}
                onAddTask={(task) => handleAddTask(dayStr, task)}
                onRemoveTask={(task) => handleRemoveTask(dayStr, task)}
                isToday={isToday}
              />
            );
          })}
        </CalendarGrid>
      </Container>
    </Wrapper>
    
  );
};

export default Calendar;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 80%;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 стовпців для днів тижня */
  gap: 8px;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthYear = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const DayNames = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
  margin-bottom: 8px;
`;