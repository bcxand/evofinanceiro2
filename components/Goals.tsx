import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { Trophy, BrainCircuit, Target, Plus, X, Trash2, Edit2, Save, PiggyBank, ArrowRight } from 'lucide-react';
import { Goal } from '../types';

export const Goals: React.FC = () => {
    const { goals, addGoal, removeGoal, updateGoal, addTransaction } = useFinance();
    const [showModal, setShowModal] = useState(false);
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
    const [depositModalGoal, setDepositModalGoal] = useState<Goal | null>(null);
    const [depositAmount, setDepositAmount] = useState('');
    
    // Form State
    const [goalForm, setGoalForm] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        color: '#3B82F6'
    });

    const resetForm = () => {
        setGoalForm({ name: '', targetAmount: '', currentAmount: '', deadline: '', color: '#3B82F6' });
        setEditingGoalId(null);
        setShowModal(false);
    };

    const handleOpenEdit = (goal: Goal) => {
        setGoalForm({
            name: goal.name,
            targetAmount: goal.targetAmount.toString(),
            currentAmount: goal.currentAmount.toString(),
            deadline: goal.deadline,
            color: goal.color
        });
        setEditingGoalId(goal.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!goalForm.name || !goalForm.targetAmount) return;
        
        const payload = {
            name: goalForm.name,
            targetAmount: parseFloat(goalForm.targetAmount),
            currentAmount: parseFloat(goalForm.currentAmount || '0'),
            deadline: goalForm.deadline,
            color: goalForm.color
        };

        if (editingGoalId) {
            await updateGoal(editingGoalId, payload);
        } else {
            await addGoal(payload as any);
        }
        
        resetForm();
    };

    const handleDeposit = async () => {
        if (!depositModalGoal || !depositAmount) return;

        await addTransaction({
            description: `Economia para: ${depositModalGoal.name}`,
            amount: parseFloat(depositAmount),
            type: 'EXPENSE', // Money leaving wallet -> Goal
            category: 'Investimento',
            expenseCategory: 'VARIABLE',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Conta Corrente',
            relatedEntityId: depositModalGoal.id
        });

        setDepositAmount('');
        setDepositModalGoal(null);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Metas</h2>
                    <p className="text-xs md:text-sm text-gray-500">Planejamento e sonhos da família</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    <span className="hidden md:inline">Nova Meta</span>
                </button>
            </div>

            {/* Modal for New/Edit Goal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{editingGoalId ? 'Atualizar Meta' : 'Definir Nova Meta'}</h3>
                            <button onClick={resetForm}><X size={20} className="text-gray-500" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nome do Objetivo</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded-lg" 
                                    placeholder="Ex: Viagem Disney"
                                    value={goalForm.name}
                                    onChange={e => setGoalForm({...goalForm, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Valor Alvo (R$)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border border-gray-300 rounded-lg" 
                                        placeholder="10000"
                                        value={goalForm.targetAmount}
                                        onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Já guardado (R$)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border border-gray-300 rounded-lg" 
                                        placeholder="0"
                                        value={goalForm.currentAmount}
                                        onChange={e => setGoalForm({...goalForm, currentAmount: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Prazo Estimado</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2 border border-gray-300 rounded-lg" 
                                    value={goalForm.deadline}
                                    onChange={e => setGoalForm({...goalForm, deadline: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Cor</label>
                                <div className="flex gap-2 mt-1">
                                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                                        <button 
                                            key={color}
                                            onClick={() => setGoalForm({...goalForm, color})}
                                            className={`w-8 h-8 rounded-full border-2 ${goalForm.color === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={handleSave}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {editingGoalId ? 'Salvar Alterações' : 'Criar Meta'}
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Deposit Modal */}
            {depositModalGoal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                     <Card className="w-full max-w-sm bg-white">
                         <div className="text-center mb-6">
                             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                 <PiggyBank size={24} />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900">Guardar Dinheiro</h3>
                             <p className="text-sm text-gray-500">Quanto você quer adicionar em {depositModalGoal.name}?</p>
                         </div>
                         <div className="mb-6">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Valor a Guardar</label>
                             <div className="relative mt-1">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                                 <input 
                                     type="number" 
                                     className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-xl font-bold outline-none focus:border-blue-500"
                                     placeholder="0,00"
                                     value={depositAmount}
                                     onChange={e => setDepositAmount(e.target.value)}
                                     autoFocus
                                 />
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <button onClick={() => setDepositModalGoal(null)} className="flex-1 py-3 bg-gray-100 font-bold text-gray-600 rounded-lg">Cancelar</button>
                             <button onClick={handleDeposit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">Confirmar</button>
                         </div>
                     </Card>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const percentage = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const suggestion = remaining / 6;

                    return (
                        <Card key={goal.id} className="relative overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between">
                             <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                 <button onClick={() => handleOpenEdit(goal)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                     <Edit2 size={14} />
                                 </button>
                                 <button onClick={() => removeGoal(goal.id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                     <Trash2 size={14} />
                                 </button>
                             </div>

                             <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <Trophy size={24} style={{ color: goal.color }} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                        {percentage}% Concluído
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.name}</h3>
                                <p className="text-gray-500 text-sm mb-6">Meta: <span className="font-semibold text-gray-700">R$ {goal.targetAmount.toLocaleString('pt-BR')}</span></p>
                                
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Acumulado</p>
                                        <span className="text-2xl font-bold text-gray-900">R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
                                    </div>
                                </div>
                                
                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 relative"
                                        style={{ width: `${percentage}%`, backgroundColor: goal.color }}
                                    >
                                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/20"></div>
                                    </div>
                                </div>
                             </div>

                             <button 
                                onClick={() => setDepositModalGoal(goal)}
                                className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2 mt-auto"
                             >
                                 Adicionar Economia <ArrowRight size={14} />
                             </button>

                        </Card>
                    );
                })}
                
                <Card 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="border-dashed border-2 border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center py-8 opacity-60 hover:opacity-100 transition-all cursor-pointer hover:border-blue-300 hover:bg-blue-50 h-full min-h-[300px]"
                >
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                        <Target size={24} className="text-blue-500" />
                    </div>
                    <span className="text-gray-600 text-sm font-bold">Criar nova meta</span>
                </Card>
            </div>
        </div>
    );
};