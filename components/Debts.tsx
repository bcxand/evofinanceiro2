import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { Plus, Trash2, X, AlertTriangle, CheckCircle2, TrendingDown, Calendar, Banknote, ArrowRight } from 'lucide-react';
import { Debt } from '../types';

export const Debts: React.FC = () => {
    const { debts, addDebt, removeDebt, addTransaction } = useFinance();
    const [showModal, setShowModal] = useState(false);
    const [paymentModalDebt, setPaymentModalDebt] = useState<Debt | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    
    // Form State
    const [newDebt, setNewDebt] = useState({
        name: '',
        totalValue: '',
        currentValue: '',
        creditor: '',
        dueDate: '',
        interestRate: ''
    });

    const handleSave = async () => {
        if (!newDebt.name || !newDebt.totalValue) return;
        
        await addDebt({
            name: newDebt.name,
            totalValue: parseFloat(newDebt.totalValue),
            currentValue: parseFloat(newDebt.currentValue || newDebt.totalValue),
            creditor: newDebt.creditor,
            dueDate: newDebt.dueDate,
            interestRate: parseFloat(newDebt.interestRate || '0'),
            status: 'active'
        });
        
        setNewDebt({ name: '', totalValue: '', currentValue: '', creditor: '', dueDate: '', interestRate: '' });
        setShowModal(false);
    };

    const handlePayment = async () => {
        if (!paymentModalDebt || !paymentAmount) return;
        
        // Register payment as transaction linked to Debt
        await addTransaction({
            description: `Pagamento Dívida: ${paymentModalDebt.name}`,
            amount: parseFloat(paymentAmount),
            type: 'EXPENSE',
            category: 'Dívidas',
            expenseCategory: 'FIXED',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Conta Corrente',
            relatedEntityId: paymentModalDebt.id
        });

        setPaymentAmount('');
        setPaymentModalDebt(null);
    };

    const totalDebt = debts.reduce((acc, d) => acc + d.currentValue, 0);
    const totalOriginal = debts.reduce((acc, d) => acc + d.totalValue, 0);
    const paidOff = totalOriginal - totalDebt;
    const progress = totalOriginal > 0 ? (paidOff / totalOriginal) * 100 : 0;

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 text-slate-800">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-900">Gestão de Dívidas</h2>
                    <p className="text-xs md:text-sm text-slate-500">Acompanhe e elimine seus débitos.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    <span className="hidden md:inline">Nova Dívida</span>
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="bg-red-50 border border-red-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20} /></div>
                        <span className="text-sm font-bold text-red-800">Total a Pagar</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">R$ {totalDebt.toLocaleString('pt-BR')}</p>
                </Card>
                <Card className="bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
                        <span className="text-sm font-bold text-emerald-800">Já Quitado</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">R$ {paidOff.toLocaleString('pt-BR')}</p>
                </Card>
                <Card className="bg-white border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><AlertTriangle size={20} /></div>
                        <span className="text-sm font-bold text-slate-600">Progresso Geral</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold text-slate-900">{Math.round(progress)}%</p>
                        <span className="text-xs text-slate-400 mb-1">livre de dívidas</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </Card>
            </div>

            {/* Debt List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {debts.map(debt => {
                    const debtProgress = ((debt.totalValue - debt.currentValue) / debt.totalValue) * 100;
                    return (
                        <Card key={debt.id} className="relative group border border-slate-200 hover:border-emerald-200 transition-colors">
                             <button 
                                onClick={() => removeDebt(debt.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                             >
                                 <Trash2 size={16} />
                             </button>

                             <div className="flex items-start gap-4 mb-6">
                                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                     <Banknote size={24} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-lg text-slate-900">{debt.name}</h3>
                                     <p className="text-sm text-slate-500">{debt.creditor}</p>
                                 </div>
                             </div>

                             <div className="flex justify-between items-end mb-2">
                                 <div>
                                     <p className="text-xs text-slate-400 uppercase">Restante</p>
                                     <p className="text-xl font-bold text-slate-900">R$ {debt.currentValue.toLocaleString('pt-BR')}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xs text-slate-400 uppercase">Original</p>
                                     <p className="text-sm font-medium text-slate-600 line-through">R$ {debt.totalValue.toLocaleString('pt-BR')}</p>
                                 </div>
                             </div>

                             <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                                 <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                                    style={{ width: `${debtProgress}%` }}
                                 ></div>
                             </div>

                             <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-50">
                                 <div className="flex items-center gap-2 text-slate-500">
                                     <Calendar size={14} />
                                     <span>Vence: {new Date(debt.dueDate).toLocaleDateString('pt-BR')}</span>
                                 </div>
                                 {debt.interestRate && debt.interestRate > 0 && (
                                     <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                         Juros: {debt.interestRate}% a.m
                                     </span>
                                 )}
                             </div>
                             
                             <button 
                                onClick={() => setPaymentModalDebt(debt)}
                                className="w-full mt-4 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors text-sm flex items-center justify-center gap-2"
                             >
                                 Registrar Pagamento <ArrowRight size={14} />
                             </button>
                        </Card>
                    );
                })}
            </div>

            {/* Payment Modal */}
            {paymentModalDebt && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                     <Card className="w-full max-w-sm bg-white">
                         <div className="text-center mb-6">
                             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                                 <Banknote size={24} />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900">Abater Dívida</h3>
                             <p className="text-sm text-gray-500">Quanto você pagou em {paymentModalDebt.name}?</p>
                         </div>
                         <div className="mb-6">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Valor Pago</label>
                             <div className="relative mt-1">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                                 <input 
                                     type="number" 
                                     className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-xl font-bold outline-none focus:border-emerald-500"
                                     placeholder="0,00"
                                     value={paymentAmount}
                                     onChange={e => setPaymentAmount(e.target.value)}
                                     autoFocus
                                 />
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <button onClick={() => setPaymentModalDebt(null)} className="flex-1 py-3 bg-gray-100 font-bold text-gray-600 rounded-lg">Cancelar</button>
                             <button onClick={handlePayment} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700">Confirmar</button>
                         </div>
                     </Card>
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Nova Dívida</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700">Nome</label>
                                <input className="w-full p-2 border rounded-lg" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})} placeholder="Ex: Empréstimo" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700">Credor</label>
                                <input className="w-full p-2 border rounded-lg" value={newDebt.creditor} onChange={e => setNewDebt({...newDebt, creditor: e.target.value})} placeholder="Ex: Banco Itaú" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Valor Total</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={newDebt.totalValue} onChange={e => setNewDebt({...newDebt, totalValue: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Valor Atual</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={newDebt.currentValue} onChange={e => setNewDebt({...newDebt, currentValue: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Vencimento</label>
                                    <input type="date" className="w-full p-2 border rounded-lg" value={newDebt.dueDate} onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Juros (%)</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={newDebt.interestRate} onChange={e => setNewDebt({...newDebt, interestRate: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={handleSave} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 mt-2">Salvar Dívida</button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};