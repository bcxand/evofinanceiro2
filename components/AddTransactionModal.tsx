import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, DollarSign, Calendar, Tag, CreditCard, Users, Repeat } from 'lucide-react';

interface AddTransactionModalProps {
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const { addTransaction, familyMembers, creditCards } = useFinance();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'EXPENSE',
    expenseCategory: 'VARIABLE', // VARIABLE or FIXED
    category: 'Alimentação',
    familyMemberId: familyMembers[0]?.id || '',
    paymentMethod: 'Pix',
    creditCardId: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction({
      amount: parseFloat(formData.amount),
      description: formData.description,
      type: formData.type as any,
      expenseCategory: formData.expenseCategory as any,
      category: formData.category,
      familyMemberId: formData.familyMemberId,
      paymentMethod: formData.paymentMethod,
      creditCardId: formData.paymentMethod === 'Crédito' ? formData.creditCardId : undefined,
      details: formData.details,
      date: formData.date,
      isRecurring: formData.isRecurring
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Nova Transação Familiar</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Top Row: Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Lançamento</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'EXPENSE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Despesa
                    </button>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, type: 'INCOME'})}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        Receita / Salário
                    </button>
                </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                 <div className="relative">
                     <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="number" 
                        step="0.01"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold text-gray-900"
                        placeholder="0,00"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                     />
                 </div>
             </div>
          </div>

          {/* Fixed vs Variable (Only for Expenses) */}
          {formData.type === 'EXPENSE' && (
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classificação</label>
                  <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                          <input 
                            type="radio" 
                            name="expenseCategory" 
                            value="VARIABLE"
                            checked={formData.expenseCategory === 'VARIABLE'}
                            onChange={() => setFormData({...formData, expenseCategory: 'VARIABLE'})}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                              <span className="block text-sm font-bold text-gray-900">Variável</span>
                              <span className="block text-xs text-gray-500">Mercado, Lazer, Extras</span>
                          </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                          <input 
                            type="radio" 
                            name="expenseCategory" 
                            value="FIXED"
                            checked={formData.expenseCategory === 'FIXED'}
                            onChange={() => setFormData({...formData, expenseCategory: 'FIXED'})}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                              <span className="block text-sm font-bold text-gray-900">Fixa</span>
                              <span className="block text-xs text-gray-500">Aluguel, Luz, Escola</span>
                          </div>
                      </label>
                  </div>
              </div>
          )}

          {/* Description & Details */}
          <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Principal</label>
                 <input 
                    type="text" 
                    required
                    placeholder={formData.type === 'INCOME' ? "Ex: Salário Mensal" : "Ex: Compras no Mercadinho"}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>
              {formData.type === 'EXPENSE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalhes (Itens comprados)</label>
                    <textarea 
                        rows={2}
                        placeholder="Ex: 2kg de Arroz, Leite, Pão, Detergente..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={formData.details}
                        onChange={e => setFormData({...formData, details: e.target.value})}
                    />
                  </div>
              )}
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Users size={14} /> Quem gastou/recebeu?
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.familyMemberId}
                    onChange={e => setFormData({...formData, familyMemberId: e.target.value})}
                  >
                      {familyMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                      ))}
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Tag size={14} /> Categoria
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                      <option>Alimentação</option>
                      <option>Moradia</option>
                      <option>Transporte</option>
                      <option>Educação</option>
                      <option>Lazer</option>
                      <option>Saúde</option>
                      <option>Salário</option>
                      <option>Outros</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <CreditCard size={14} /> Forma de Pagamento
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.paymentMethod}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                      <option>Pix</option>
                      <option>Débito</option>
                      <option>Crédito</option>
                      <option>Dinheiro</option>
                      <option>Boleto</option>
                  </select>
              </div>

              {formData.paymentMethod === 'Crédito' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qual Cartão?</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.creditCardId}
                        onChange={e => setFormData({...formData, creditCardId: e.target.value})}
                    >
                        <option value="">Selecione...</option>
                        {creditCards.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                  </div>
              )}
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar size={14} /> Data
                  </label>
                  <input 
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                 />
              </div>

              <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        checked={formData.isRecurring}
                        onChange={e => setFormData({...formData, isRecurring: e.target.checked})}
                      />
                      <div className="flex items-center gap-2">
                          <Repeat size={16} className="text-gray-500" />
                          <div>
                            <span className="block text-sm font-medium text-gray-900">Repetir mensalmente?</span>
                            <span className="block text-xs text-gray-500">Útil para assinaturas e contas fixas</span>
                          </div>
                      </div>
                  </label>
              </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
              >
                  Cancelar
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
              >
                  Salvar Lançamento
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};