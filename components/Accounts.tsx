import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { Wallet, CreditCard as CreditCardIcon, Plus, Calendar, AlertCircle, Trash2, X, Hash } from 'lucide-react';

export const Accounts: React.FC = () => {
    const { creditCards, recurringBills, addRecurringBill, removeRecurringBill, addCreditCard, removeCreditCard, familyMembers } = useFinance();
    
    // States for adding Bill
    const [showAddBill, setShowAddBill] = useState(false);
    const [newBill, setNewBill] = useState({ description: '', amount: '', dueDay: '', category: 'Moradia' });

    // States for adding Card
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({ name: '', limit: '', dueDate: '', ownerId: '', lastDigits: '' });

    // Handlers Bill
    const handleSaveBill = async () => {
        if (!newBill.description || !newBill.amount) return;
        await addRecurringBill({
            description: newBill.description,
            amount: parseFloat(newBill.amount),
            dueDay: parseInt(newBill.dueDay),
            category: newBill.category,
            isAutoPaid: false
        });
        setNewBill({ description: '', amount: '', dueDay: '', category: 'Moradia' });
        setShowAddBill(false);
    };

    // Handlers Card
    const handleSaveCard = async () => {
        if (!newCard.name || !newCard.limit || !newCard.lastDigits) return;
        await addCreditCard({
            name: newCard.name,
            limit: parseFloat(newCard.limit),
            used: 0,
            dueDate: newCard.dueDate,
            lastDigits: newCard.lastDigits,
            ownerId: newCard.ownerId,
            color: '#111827' // Default dark
        });
        setNewCard({ name: '', limit: '', dueDate: '', ownerId: '', lastDigits: '' });
        setShowAddCard(false);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contas & Cartões</h2>
                    <p className="text-sm text-gray-500">Gestão de saldos e compromissos fixos.</p>
                </div>
                <button 
                    onClick={() => setShowAddCard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-black transition-colors"
                >
                    <Plus size={16} /> Novo Cartão
                </button>
            </div>

            {/* Add Card Modal / Inline */}
            {showAddCard && (
                <Card className="border-2 border-gray-900 mb-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Novo Cartão de Crédito</h3>
                        <button onClick={() => setShowAddCard(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                    </div>
                    
                    {/* Mobile-Friendly Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Nome do Cartão (Apelido)</label>
                             <input 
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all" 
                                placeholder="Ex: Nubank Platinum" 
                                value={newCard.name} 
                                onChange={e => setNewCard({...newCard, name: e.target.value})} 
                             />
                        </div>
                        
                        <div className="md:col-span-3">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Limite Total (R$)</label>
                             <input 
                                type="number" 
                                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900" 
                                placeholder="5000" 
                                value={newCard.limit} 
                                onChange={e => setNewCard({...newCard, limit: e.target.value})} 
                             />
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Últimos 4 Dígitos</label>
                             <div className="relative">
                                 <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input 
                                    type="text" 
                                    maxLength={4}
                                    className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900" 
                                    placeholder="1234" 
                                    value={newCard.lastDigits} 
                                    onChange={e => setNewCard({...newCard, lastDigits: e.target.value.replace(/\D/g,'')})} 
                                 />
                             </div>
                        </div>

                        <div className="md:col-span-3">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Dia Vencimento</label>
                             <input 
                                type="number" 
                                min="1" max="31"
                                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900" 
                                placeholder="Dia 10" 
                                value={newCard.dueDate} 
                                onChange={e => setNewCard({...newCard, dueDate: e.target.value})} 
                             />
                        </div>

                        <div className="md:col-span-4">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Dono (Membro)</label>
                             <select 
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900" 
                                value={newCard.ownerId} 
                                onChange={e => setNewCard({...newCard, ownerId: e.target.value})}
                             >
                                 <option value="">Selecione...</option>
                                 {familyMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                             </select>
                        </div>
                        
                        <div className="md:col-span-8 flex items-end justify-end">
                            <button 
                                onClick={handleSaveCard} 
                                className="w-full md:w-auto bg-gray-900 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-black transition-colors shadow-lg"
                            >
                                Salvar Cartão
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Credit Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creditCards.map(card => {
                    const owner = familyMembers.find(m => m.id === card.ownerId);
                    return (
                    <Card key={card.id} className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none group">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        {/* Delete Button (Visible on Hover) */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); removeCreditCard(card.id); }}
                            className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
                        >
                            <Trash2 size={14} />
                        </button>

                        <div className="relative z-10 p-2">
                            <div className="flex justify-between items-start mb-8">
                                <CreditCardIcon size={32} className="text-white/80" />
                                <div className="text-right">
                                    <span className="font-mono text-xl tracking-widest text-white/50 block">**** {card.lastDigits || '0000'}</span>
                                    {owner && <span className="text-[10px] uppercase font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded">{owner.name}</span>}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-lg font-bold">{card.name}</p>
                            </div>

                            <div className="space-y-1 mb-6">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Fatura Atual</p>
                                <p className="text-3xl font-bold">R$ {card.used.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Vencimento</p>
                                    <p className="font-medium">Dia {card.dueDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase">Limite Total</p>
                                    <p className="font-medium">R$ {card.limit.toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )})}
            </div>

            {/* Recurring Bills Section */}
            <div className="mt-8">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" />
                        Contas Fixas (Vencimentos)
                    </h3>
                    <button 
                        onClick={() => setShowAddBill(!showAddBill)}
                        className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Plus size={16} /> Nova Conta Fixa
                    </button>
                 </div>

                 {showAddBill && (
                     <Card className="mb-6 bg-blue-50/50 border-blue-100">
                         <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-sm text-gray-700">Adicionar Conta Recorrente</h4>
                             <button onClick={() => setShowAddBill(false)}><X size={16} className="text-gray-500"/></button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                             <div>
                                 <label className="text-xs font-bold text-gray-500">Descrição</label>
                                 <input 
                                    type="text" 
                                    value={newBill.description}
                                    onChange={e => setNewBill({...newBill, description: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                                    placeholder="Ex: Aluguel"
                                />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500">Valor (R$)</label>
                                 <input 
                                    type="number" 
                                    value={newBill.amount}
                                    onChange={e => setNewBill({...newBill, amount: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                                    placeholder="0,00"
                                />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500">Dia Vencimento</label>
                                 <input 
                                    type="number" 
                                    min="1" max="31"
                                    value={newBill.dueDay}
                                    onChange={e => setNewBill({...newBill, dueDay: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                                    placeholder="Dia"
                                />
                             </div>
                             <button onClick={handleSaveBill} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                                 Salvar
                             </button>
                         </div>
                     </Card>
                 )}

                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 border-b border-gray-100">
                             <tr>
                                 <th className="px-6 py-4 font-semibold text-gray-500">Descrição</th>
                                 <th className="px-6 py-4 font-semibold text-gray-500">Categoria</th>
                                 <th className="px-6 py-4 font-semibold text-gray-500">Vencimento</th>
                                 <th className="px-6 py-4 font-semibold text-gray-500 text-right">Valor</th>
                                 <th className="px-6 py-4 font-semibold text-gray-500 text-center">Status</th>
                                 <th className="px-6 py-4"></th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {recurringBills.map(bill => {
                                 const today = new Date().getDate();
                                 const isOverdue = today > bill.dueDay;
                                 
                                 return (
                                     <tr key={bill.id} className="hover:bg-gray-50 group">
                                         <td className="px-6 py-4 font-medium text-gray-900">{bill.description}</td>
                                         <td className="px-6 py-4">
                                             <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{bill.category}</span>
                                         </td>
                                         <td className="px-6 py-4 text-gray-600">Todo dia <span className="font-bold text-gray-900">{bill.dueDay}</span></td>
                                         <td className="px-6 py-4 text-right font-bold text-gray-900">R$ {bill.amount.toLocaleString('pt-BR')}</td>
                                         <td className="px-6 py-4 text-center">
                                             {isOverdue ? (
                                                 <span className="flex items-center justify-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                                     <AlertCircle size={12} /> Atrasado?
                                                 </span>
                                             ) : (
                                                 <span className="flex items-center justify-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                                                     <Calendar size={12} /> A vencer
                                                 </span>
                                             )}
                                         </td>
                                         <td className="px-6 py-4 text-right">
                                             <button onClick={() => removeRecurringBill(bill.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                 <Trash2 size={16} />
                                             </button>
                                         </td>
                                     </tr>
                                 );
                             })}
                             {recurringBills.length === 0 && (
                                 <tr>
                                     <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhuma conta fixa cadastrada.</td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
};