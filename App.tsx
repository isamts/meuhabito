import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Calendar, BarChart2 } from 'lucide-react';
import { Habit, AgendaEvent } from './types';
import DailyView from './components/views/DailyView';
import CalendarView from './components/views/CalendarView';
import StatsView from './components/views/StatsView';

function App() {
  // --- State Management ---
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('bloom_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<AgendaEvent[]>(() => {
    const saved = localStorage.getItem('bloom_events');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('bloom_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('bloom_events', JSON.stringify(events));
  }, [events]);

  // --- Actions ---
  const addHabit = (name: string, category: string, color: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      category,
      color,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: isCompleted
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date]
        };
      }
      return h;
    }));
  };

  const addEvent = (title: string, date: string, time: string) => {
    const newEvent: AgendaEvent = {
      id: crypto.randomUUID(),
      title,
      date,
      time
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // --- Navigation & Layout ---
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${
          isActive ? 'text-pink-600' : 'text-gray-400 hover:text-pink-400'
        }`}
      >
        <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-pink-100 scale-110' : ''}`}>
          <Icon size={24} className="md:w-8 md:h-8" strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] md:text-xs font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </Link>
    );
  };

  const contextValues = {
    habits,
    events,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    addEvent,
    deleteEvent
  };

  return (
    <div className="min-h-screen relative font-sans text-gray-800">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[80px]" />
      </div>

      <main>
        <Routes>
          <Route path="/" element={<DailyView {...contextValues} />} />
          <Route path="/calendar" element={<CalendarView {...contextValues} />} />
          <Route path="/stats" element={<StatsView {...contextValues} />} />
        </Routes>
      </main>

      {/* Mobile Navigation Tab Bar */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md md:max-w-xl h-20 md:h-24 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-pink-200/50 border border-white/50 flex justify-between items-center px-6 md:px-12 z-50">
        <NavLink to="/" icon={LayoutGrid} label="Diário" />
        <NavLink to="/calendar" icon={Calendar} label="Mês" />
        <NavLink to="/stats" icon={BarChart2} label="Stats" />
      </nav>
    </div>
  );
}

export default App;