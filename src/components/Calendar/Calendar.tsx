import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DayCell from './DayCell';

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'week' | 'month'>('month'); 

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

    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Перенос тижня з понеділка
    const emptyDays = Array.from({ length: firstDayIndex }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(date.getFullYear(), date.getMonth(), i + 1);
      return day;
    });

    return [...emptyDays, ...days];
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayIndex = (startOfWeek.getDay() + 6) % 7; // Зсув на понеділок
    startOfWeek.setDate(startOfWeek.getDate() - dayIndex);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  };

  const handleSwitchDate = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);

    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }

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

  const daysToDisplay =
    view === 'month' ? getMonthDaysWithPadding(currentDate) : getWeekDays(currentDate);

  return (
    <Wrapper>
      <Container>
        <Header>
          <div>
            <button onClick={handleSwitchDate.bind(null, 'prev')}>☝️</button>
            <button onClick={handleSwitchDate.bind(null, 'next')}>👇</button>
          </div>
          <MonthYear>{`${monthName} ${year}`}</MonthYear>
          <ViewSwitch>
            <button
              className={view === 'month' ? 'active' : ''}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              className={view === 'week' ? 'active' : ''}
              onClick={() => setView('week')}
            >
              Week
            </button>
          </ViewSwitch>
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
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 16px 0;
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

const ViewSwitch = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 8px 16px;
    border: none;
    background: rgb(199, 199, 199);
    color: #fff;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: rgb(139, 140, 141);
    }

    &.active {
      background: rgb(154, 203, 255);
      font-weight: bold;
    }
  }
`;
