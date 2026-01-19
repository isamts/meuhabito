import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Plus, Clock } from 'lucide-react';
import { HabitContextType, AgendaEvent } from '../../types';

interface CalendarViewProps extends HabitContextType {}

const CalendarView: React.FC<CalendarViewProps> = ({ habits, events, addEvent, deleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Helpers
  const formatMonth = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const formatSelectedDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Get data for selected date
  const habitsCompletedOnDate = habits.filter(h => h.completedDates.includes(selectedDate));
  const eventsOnDate = events.filter(e => e.date === selectedDate);

  const handleDayClick = (day: number) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    setSelectedDate(`${year}-${monthStr}-${dayStr}`);
    setIsAddingEvent(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      addEvent(newEventTitle, selectedDate, newEventTime);
      setNewEventTitle('');
      setIsAddingEvent(false);
    }
  };

  return (
    <div className="max-w-xl md:max-w-3xl mx-auto pb-24 px-4 pt-6 md:pt-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10">Calendário</h1>

      {/* Calendar Grid */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg shadow-pink-100 mb-8 border border-white">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-pink-100 rounded-full text-pink-500 transition-colors"><ChevronLeft size={24} /></button>
          <h2 className="text-lg md:text-xl font-bold capitalize text-gray-700">{formatMonth(currentDate)}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-pink-100 rounded-full text-pink-500 transition-colors"><ChevronRight size={24} /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-3 text-center mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <span key={d} className="text-xs md:text-sm font-semibold text-gray-400">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            
            const monthStr = (month + 1).toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            // Check if any habit was done this day
            const hasActivity = habits.some(h => h.completedDates.includes(dateStr));

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-sm md:text-lg font-medium relative transition-all
                  ${isSelected ? 'bg-pink-500 text-white shadow-md' : 'hover:bg-pink-100 text-gray-600'}
                  ${isToday && !isSelected ? 'border-2 border-pink-300' : ''}
                `}
              >
                {day}
                {hasActivity && !isSelected && (
                  <span className="absolute bottom-1 md:bottom-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-end border-b border-pink-100 pb-2">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">{formatSelectedDate(selectedDate)}</h3>
        </div>

        {/* Habits List */}
        <div>
          <h4 className="text-sm md:text-base font-semibold text-gray-500 mb-3 uppercase tracking-wider">Hábitos Concluídos</h4>
          {habitsCompletedOnDate.length > 0 ? (
            <div className="flex flex-wrap gap-2 md:gap-3">
              {habitsCompletedOnDate.map(h => (
                <span key={h.id} className="px-3 py-1 md:px-4 md:py-2 bg-white/80 border border-pink-100 rounded-lg text-sm md:text-base text-gray-700 shadow-sm">
                  {h.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm md:text-base italic">Nenhum hábito registrado neste dia.</p>
          )}
        </div>

        {/* Agenda */}
        <div>
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider">Agenda</h4>
             <button 
                onClick={() => setIsAddingEvent(!isAddingEvent)}
                className="text-pink-500 hover:bg-pink-50 p-1 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 transition-colors"
             >
               <Plus size={14} className="md:w-5 md:h-5" /> Novo Evento
             </button>
          </div>

          {isAddingEvent && (
            <form onSubmit={handleAddEvent} className="bg-white/60 p-4 md:p-6 rounded-2xl mb-4 border border-pink-100">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Título do evento..."
                className="w-full mb-3 px-3 py-2 md:px-4 md:py-3 rounded-xl bg-white border border-pink-100 focus:outline-pink-300 text-sm md:text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="px-3 py-2 md:px-4 md:py-3 rounded-xl bg-white border border-pink-100 focus:outline-pink-300 text-sm md:text-base"
                />
                <button type="submit" className="flex-1 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 text-sm md:text-base">
                  Salvar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2 md:space-y-3">
            {eventsOnDate.length > 0 ? (
              eventsOnDate.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 md:p-4 bg-white/80 rounded-2xl border-l-4 border-l-pink-400 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-xs md:text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock size={12} className="md:w-4 md:h-4" /> {e.time}
                    </div>
                    <span className="text-gray-700 font-medium text-sm md:text-base">{e.title}</span>
                  </div>
                  <button onClick={() => deleteEvent(e.id)} className="text-gray-300 hover:text-red-400">
                    <Trash2 size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm md:text-base italic">Nada agendado.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16 text-center">
        <p className="text-xs md:text-sm text-pink-400/70 font-medium">Feito por Isadora Matos 💖</p>
      </div>
    </div>
  );
};

export default CalendarView;