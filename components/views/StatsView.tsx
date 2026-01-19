import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Trophy, Activity, Target } from 'lucide-react';
import { HabitContextType } from '../../types';

interface StatsViewProps extends HabitContextType {}

const StatsView: React.FC<StatsViewProps> = ({ habits }) => {
  
  // 1. Calculate General Stats
  const activeHabits = habits.length;
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  
  // Find best streak among all habits
  const calculateStreak = (dates: string[]): number => {
    if (!dates.length) return 0;
    const sorted = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let checkDate = new Date();
    // Allow checking from today or yesterday
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!sorted.includes(todayStr)) checkDate.setDate(checkDate.getDate() - 1);
    
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

  const bestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => calculateStreak(h.completedDates))) 
    : 0;

  // 2. Prepare Data for Area Chart (Last 30 Days)
  const last30DaysData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const count = habits.reduce((acc, h) => 
      acc + (h.completedDates.includes(dateStr) ? 1 : 0), 0
    );
    
    last30DaysData.push({ date: displayDate, completions: count });
  }

  // 3. Prepare Data for Bar Chart (Frequency per habit)
  const frequencyData = habits.map(h => ({
    name: h.name.length > 10 ? h.name.substring(0, 10) + '...' : h.name,
    total: h.completedDates.length,
    color: h.color
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur p-3 border border-pink-100 rounded-xl shadow-lg">
          <p className="font-bold text-pink-600">{label}</p>
          <p className="text-gray-600 text-sm">Conclusões: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-xl md:max-w-3xl mx-auto pb-24 px-4 pt-6 md:pt-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10">Estatísticas</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        <div className="bg-white/70 backdrop-blur p-4 md:p-6 rounded-3xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 md:p-3 bg-yellow-100 text-yellow-600 rounded-full mb-2 md:mb-3">
            <Trophy size={20} className="md:w-8 md:h-8" />
          </div>
          <span className="text-2xl md:text-4xl font-bold text-gray-800">{bestStreak}</span>
          <span className="text-xs md:text-sm text-gray-500">Recorde Dias</span>
        </div>
        <div className="bg-white/70 backdrop-blur p-4 md:p-6 rounded-3xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 md:p-3 bg-pink-100 text-pink-500 rounded-full mb-2 md:mb-3">
            <Activity size={20} className="md:w-8 md:h-8" />
          </div>
          <span className="text-2xl md:text-4xl font-bold text-gray-800">{totalCompletions}</span>
          <span className="text-xs md:text-sm text-gray-500">Conclusões</span>
        </div>
        <div className="bg-white/70 backdrop-blur p-4 md:p-6 rounded-3xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 md:p-3 bg-blue-100 text-blue-500 rounded-full mb-2 md:mb-3">
            <Target size={20} className="md:w-8 md:h-8" />
          </div>
          <span className="text-2xl md:text-4xl font-bold text-gray-800">{activeHabits}</span>
          <span className="text-xs md:text-sm text-gray-500">Ativos</span>
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg shadow-pink-100 mb-8 md:mb-10 border border-white">
        <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4 md:mb-6">Progresso Mensal</h3>
        <div className="h-48 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last30DaysData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fbcfe8', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="completions" 
                stroke="#ec4899" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg shadow-pink-100 mb-8 border border-white">
        <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4 md:mb-6">Performance por Hábito</h3>
        <div className="h-48 md:h-72 w-full">
            {habits.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={frequencyData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} interval={0} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="total" radius={[8, 8, 8, 8]}>
                        {frequencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Sem dados suficientes
                </div>
            )}
        </div>
      </div>

      <div className="mt-12 md:mt-16 text-center">
        <p className="text-xs md:text-sm text-pink-400/70 font-medium">Feito por Isadora Matos 💖</p>
      </div>
    </div>
  );
};

export default StatsView;