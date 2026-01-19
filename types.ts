export interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  completedDates: string[]; // ISO YYYY-MM-DD
  createdAt: string; // ISO Date
}

export interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  date: string; // YYYY-MM-DD
}

export interface HabitContextType {
  habits: Habit[];
  events: AgendaEvent[];
  addHabit: (name: string, category: string, color: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  addEvent: (title: string, date: string, time: string) => void;
  deleteEvent: (id: string) => void;
}

export const CATEGORIES = ['Saúde', 'Trabalho', 'Estudos', 'Espiritual', 'Lazer'];
export const COLORS = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];
