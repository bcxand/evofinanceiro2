import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { parseFinancialInput } from '../utils/nlpEngine';
import { ParsedInput } from '../types';
import { Sparkles, ArrowRight, Tag, CreditCard, X } from 'lucide-react';

interface SmartInputProps {
  onClose: () => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({ onClose }) => {
  const { addTransaction } = useFinance();
  const [inputValue, setInputValue] = useState('');
  const [parsed, setParsed] = useState<ParsedInput | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.length > 2) {
      const result = parseFinancialInput(inputValue);
      setParsed(result);
    } else {
      setParsed(null);
    }
  }, [inputValue]);

  useEffect(() => {
    // Auto focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (!parsed || !parsed.amount) return;
    
    setIsAnimating(true);
    
    // Simulate haptic
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
      addTransaction({
        description: parsed.description,
        amount: parsed.amount!,
        type: parsed.type,
        category: parsed.category || 'Outros',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: parsed.paymentMethod || 'Outros'
      });
      setIsAnimating(false);
      setInputValue('');
      onClose();
    }, 600);
  };

  const placeholders = [
    "120 mercado crédito",
    "recebimento 1800 pix",
    "salário 4500",
    "uber 32 corporativo"
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className={`relative w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl transition-all duration-300 transform border border-gray-100 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Smart Input IA</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-8">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholders[placeholderIdx]}
                className="w-full bg-transparent text-4xl font-bold text-gray-900 placeholder-gray-300 outline-none caret-blue-600 tracking-tight"
            />
        </div>

        {/* Real-time Feedback Chips */}
        <div className="h-12 flex flex-wrap gap-3 mb-6 content-start transition-all">
            {parsed?.amount && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100 animate-fade-in shadow-sm">
                   <span className="font-bold">R$ {parsed.amount.toFixed(2)}</span>
                </div>
            )}
            {parsed?.category && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 animate-fade-in shadow-sm">
                   <Tag size={14} />
                   <span>{parsed.category}</span>
                </div>
            )}
            {parsed?.paymentMethod && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100 animate-fade-in shadow-sm">
                   <CreditCard size={14} />
                   <span>{parsed.paymentMethod}</span>
                </div>
            )}
        </div>

        <button 
            onClick={handleSave}
            disabled={!parsed?.amount}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
            ${parsed?.amount 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transform hover:-translate-y-0.5' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
            <span>Confirmar Lançamento</span>
            <ArrowRight size={20} />
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            Digite como você fala. A IA categoriza automaticamente.
        </p>

      </div>
    </div>
  );
};
