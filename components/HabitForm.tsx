import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES, COLORS } from '../types';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: string, color: string) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, category, color);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Novo Hábito</h2>
          <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-full transition-colors text-pink-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Hábito</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beber 2L de água"
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all border ${
                    category === cat
                      ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-pink-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cor</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-gray-200' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Criar Hábito
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
