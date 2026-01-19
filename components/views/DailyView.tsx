import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { HabitContextType } from '../../types';
import HabitCard from '../HabitCard';
import AIHelper from '../AIHelper';
import HabitForm from '../HabitForm';

// Helper to calculate streak
const calculateStreak = (dates: string[]): number => {
  if (!dates.length) return 0;
  
  const sorted = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let streak = 0;
  let currentCheck = today;
  
  // If not completed today, start check from yesterday
  if (!sorted.includes(today)) {
     currentCheck = yesterday;
  }

  let checkDate = new Date();
  if (!sorted.includes(today)) {
      checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
  }

  while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
      } else {
          break;
      }
  }
  return streak;
};

interface DailyViewProps extends HabitContextType {}

const DailyView: React.FC<DailyViewProps> = ({ 
  habits, 
  addHabit, 
  deleteHabit, 
  toggleHabitCompletion 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const sortedHabits = [...habits].sort((a, b) => {
      // Sort: Not completed first, then by creation time
      const aDone = a.completedDates.includes(today);
      const bDone = b.completedDates.includes(today);
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1;
  });

  return (
    <div className="max-w-xl md:max-w-3xl mx-auto pb-24 px-4 pt-6 md:pt-10">
      <header className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          {/* Logo Implementation */}
          <img 
            src="logo.png" 
            alt="Meus Hábitos" 
            className="h-14 md:h-28 w-auto object-contain mb-2 md:mb-4"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 hidden">Meus Hábitos</h1>
          <p className="text-gray-500 text-sm md:text-lg">Vamos fazer hoje um dia incrível?</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white p-3 md:p-4 rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </header>

      <AIHelper habits={habits} />

      <div className="space-y-4 md:space-y-6">
        {sortedHabits.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white/40 rounded-3xl border border-white border-dashed">
            <p className="md:text-lg">Nenhum hábito ainda.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-pink-500 font-semibold hover:underline mt-2 md:text-lg">
              Criar meu primeiro hábito
            </button>
          </div>
        ) : (
          sortedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={habit.completedDates.includes(today)}
              onToggle={() => toggleHabitCompletion(habit.id, today)}
              onDelete={() => deleteHabit(habit.id)}
              currentStreak={calculateStreak(habit.completedDates)}
            />
          ))
        )}
      </div>

      <HabitForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addHabit}
      />
      
      <div className="mt-12 md:mt-16 text-center">
        <p className="text-xs md:text-sm text-pink-400/70 font-medium">Feito por Isadora Matos 💖</p>
      </div>
    </div>
  );
};

export default DailyView;