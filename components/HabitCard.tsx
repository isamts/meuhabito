import React from 'react';
import { Check, Trash2, Flame } from 'lucide-react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  currentStreak: number;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggle, onDelete, currentStreak }) => {
  return (
    <div className={`group relative flex items-center justify-between p-4 md:p-6 rounded-3xl transition-all duration-300 border ${
      isCompleted 
        ? 'bg-white/80 border-pink-200 shadow-sm' 
        : 'bg-white/40 border-white hover:bg-white/60 shadow-sm'
    }`}>
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={onToggle}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
            isCompleted
              ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200 scale-105'
              : 'bg-transparent border-gray-300 text-transparent hover:border-pink-300'
          }`}
        >
          <Check className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
        </button>
        
        <div>
          <h3 className={`font-semibold text-lg md:text-xl transition-colors ${isCompleted ? 'text-gray-400 line-through decoration-pink-300' : 'text-gray-800'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span 
              className="px-2 py-0.5 rounded-full bg-opacity-10 font-medium" 
              style={{ backgroundColor: habit.color, color: habit.color }}
            >
              {habit.category}
            </span>
            {currentStreak > 0 && (
              <span className="flex items-center gap-1 text-orange-500 font-bold">
                <Flame className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" /> {currentStreak} dias
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-2 md:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        title="Excluir hábito"
      >
        <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default HabitCard;