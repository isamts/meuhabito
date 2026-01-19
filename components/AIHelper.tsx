import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Habit } from '../types';
import { getMotivationalQuote } from '../services/geminiService';

interface AIHelperProps {
  habits: Habit[];
}

const AIHelper: React.FC<AIHelperProps> = ({ habits }) => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuote = async () => {
    setLoading(true);
    const newQuote = await getMotivationalQuote(habits);
    setQuote(newQuote);
    setLoading(false);
  };

  useEffect(() => {
    // Fetch initial quote
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-6 md:p-8 shadow-xl shadow-pink-200 mb-6 md:mb-8 text-white">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={80} className="md:w-32 md:h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-200 animate-pulse md:w-6 md:h-6" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-pink-100">Daily Inspiration</span>
          </div>
          <button 
            onClick={fetchQuote} 
            disabled={loading}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin md:w-6 md:h-6" : "md:w-6 md:h-6"} />
          </button>
        </div>
        
        <p className="text-lg md:text-xl font-medium leading-relaxed italic">
          {loading ? "Florescendo pensamentos..." : `"${quote}"`}
        </p>
      </div>
    </div>
  );
};

export default AIHelper;