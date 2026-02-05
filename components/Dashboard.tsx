import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Download,
  Users,
  Home,
  ShoppingCart,
  PieChart as PieIcon,
  Activity,
  ArrowRight,
  Filter,
  Trophy,
  Banknote,
  Bell,
  Check,
  Plus,
  LogOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Distinct Palette for Categories
const CHART_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316'  // Orange
];

interface DashboardProps {
    onAddTransaction: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddTransaction }) => {
  const { 
    balance, 
    income, 
    expenses, 
    transactions, 
    familyMembers,
    goals,
    debts,
    notifications,
    handleNotificationAction
  } = useFinance();
  
  const navigate = useNavigate();

  const formatMoney = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('member_access_code');
    window.location.reload();
  };

  // EMPTY STATE CHECK
  if (transactions.length === 0 && familyMembers.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-lg shadow-emerald-200">
                  <Wallet size={48} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Seu Dashboard está pronto!</h1>
              <p className="text-slate-500 max-w-md text-lg">
                  Parece que você é novo por aqui. Comece adicionando membros da família ou sua primeira transação.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/members')}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                      <Users size={20} /> Adicionar Membros
                  </button>
                  <button 
                    onClick={onAddTransaction}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                      <Plus size={20} /> Primeiro Lançamento
                  </button>
              </div>
              
              <button 
                onClick={handleLogout}
                className="mt-8 text-slate-400 hover:text-red-500 font-medium flex items-center gap-2 transition-colors"
              >
                  <LogOut size={16} /> Sair da conta
              </button>
          </div>
      );
  }

  // --- REPORT DATA CALCS ---

  const fixedExpenses = transactions
    .filter(t => t.type === 'EXPENSE' && t.expenseCategory === 'FIXED')
    .reduce((acc, t) => acc + t.amount, 0);

  const variableExpenses = transactions
    .filter(t => t.type === 'EXPENSE' && t.expenseCategory === 'VARIABLE')
    .reduce((acc, t) => acc + t.amount, 0);

  // Group expenses by category (Pie Chart)
  const expensesByCategory = useMemo(() => {
    return transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);
  }, [transactions]);
    
  const pieData = Object.keys(expensesByCategory).map((cat, index) => ({
    name: cat,
    value: expensesByCategory[cat],
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // Line Chart Data
  // STRICTLY Monthly Separation: We do NOT simulate past/future data if it doesn't exist.
  // The line chart will show 0 for months without data.
  // Since context only returns CURRENT MONTH transactions, this chart effectively shows only the current month's point accurately,
  // which is correct behavior for "What was spent last month stays last month".
  const comparisonData = useMemo(() => {
      // Create a 6-month window ending in current month
      const today = new Date();
      const months = [];
      
      // Since context only gives us current month transactions, we only populate the current month.
      // In a full implementation, we would fetch aggregation for past 6 months.
      // But per instructions "Leave everything zeroed", we avoid fake data.
      
      const currentMonthName = today.toLocaleString('pt-BR', { month: 'short' });
      const currentYear = today.getFullYear();
      
      // Just showing current month activity vs 0 for context
      // This ensures we don't show "ghost" entries.
      return [
        { name: currentMonthName, income: income, expense: expenses }
      ];
  }, [income, expenses]);

  // Annual Data for Bar Chart
  const annualData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    const data = months.map(name => ({ name, income: 0, expense: 0 }));

    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === currentYear) {
            const monthIndex = date.getMonth();
            if (t.type === 'INCOME') {
                data[monthIndex].income += t.amount;
            } else if (t.type === 'EXPENSE') {
                data[monthIndex].expense += t.amount;
            }
        }
    });
    return data;
  }, [transactions]);

  // Debt Calculations
  const totalDebt = debts.reduce((acc, d) => acc + d.currentValue, 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-800 pb-24 md:pb-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">Visão Geral</h1>
          <p className="text-emerald-600/70 font-medium">Bem-vindo ao seu painel financeiro.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white border border-slate-200 rounded-lg flex items-center px-4 py-2 gap-2 shadow-sm flex-1 md:flex-none justify-center md:justify-start">
                <Users size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-600">{familyMembers.length} Membros</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
                <Download size={16} />
                <span className="hidden md:inline">Relatório PDF</span>
            </button>
        </div>
      </div>

      {/* NOTIFICATIONS / ACTION CENTER */}
      {notifications.length > 0 && (
          <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Bell size={14} /> Ações Pendentes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notifications.map(note => (
                      <div key={note.id} className="bg-white border-l-4 border-l-blue-500 rounded-lg shadow-sm p-4 flex flex-col gap-3 animate-fade-in">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="font-bold text-slate-800 text-sm">{note.title}</p>
                                  <p className="text-xs text-slate-500 mt-1">{note.message}</p>
                              </div>
                              {note.amount && (
                                  <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2 py-1 rounded">
                                      {formatMoney(note.amount)}
                                  </span>
                              )}
                          </div>
                          <div className="flex gap-2 justify-end mt-1">
                              {note.type !== 'GOAL_REMINDER' ? (
                                  <>
                                    <button 
                                        onClick={() => handleNotificationAction(note, 'DISMISS')}
                                        className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5"
                                    >
                                        Agora não
                                    </button>
                                    <button 
                                        onClick={() => handleNotificationAction(note, 'CONFIRM')}
                                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
                                    >
                                        <Check size={12} /> Confirmar
                                    </button>
                                  </>
                              ) : (
                                  <button 
                                        onClick={() => handleNotificationAction(note, 'DISMISS')}
                                        className="text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full"
                                  >
                                      Entendido
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* KPI Cards Row - Horizontal Scroll on Mobile */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 md:mx-0 md:px-0 hide-scrollbar">
          <div className="snap-center shrink-0 w-[85%] md:w-auto">
            <Card className="h-full border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-500/5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Atual</p>
                        <h3 className="text-3xl font-bold text-emerald-900 tracking-tight">{formatMoney(balance)}</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-100/50 text-emerald-600 rounded-xl">
                        <Wallet size={24} />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs flex items-center border border-emerald-100">
                        <ArrowUpRight size={12} className="mr-1" /> Mês Atual
                    </span>
                </div>
            </Card>
          </div>

          <div className="snap-center shrink-0 w-[85%] md:w-auto">
            <Card className="h-full shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entradas</p>
                        <h3 className="text-2xl font-bold text-slate-900">{formatMoney(income)}</h3>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{width: income > 0 ? '100%' : '0%'}}></div>
                </div>
            </Card>
          </div>

          <div className="snap-center shrink-0 w-[85%] md:w-auto">
            <Card className="h-full shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saídas Fixas</p>
                        <h3 className="text-2xl font-bold text-slate-900">{formatMoney(fixedExpenses)}</h3>
                    </div>
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                        <Home size={24} />
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{width: `${income > 0 ? (fixedExpenses/income)*100 : 0}%`}}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">Compromete {income > 0 ? Math.round((fixedExpenses/income)*100) : 0}% da renda</span>
            </Card>
          </div>

          <div className="snap-center shrink-0 w-[85%] md:w-auto">
            <Card className="h-full shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Variável / Lazer</p>
                        <h3 className="text-2xl font-bold text-slate-900">{formatMoney(variableExpenses)}</h3>
                    </div>
                    <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
                        <ShoppingCart size={24} />
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-orange-400 h-full rounded-full" style={{width: `${income > 0 ? (variableExpenses/income)*100 : 0}%`}}></div>
                </div>
            </Card>
          </div>
      </div>

      {/* Main Charts Section (Consolidated from Reports) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Evolution (Line) */}
          <div className="lg:col-span-2">
            <Card className="h-[400px] flex flex-col shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-emerald-500" />
                        Evolução Mensal
                    </h3>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} tickFormatter={(val) => `R$${val/1000}k`} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                                formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="income" name="Receita" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} />
                            <Line type="monotone" dataKey="expense" name="Despesa" stroke="#F43F5E" strokeWidth={3} dot={{r: 4, fill: '#F43F5E', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>

          {/* Chart 2: Categories (Pie) */}
          <div className="lg:col-span-1">
            <Card className="h-[400px] flex flex-col shadow-md">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PieIcon size={20} className="text-emerald-500" />
                    Distribuição
                </h3>
                <div className="flex-1 min-h-[200px]">
                      {pieData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={pieData}
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {pieData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                      ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                                    formatter={(value: number) => formatMoney(value)}
                                  />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                              </PieChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                              Sem dados neste mês
                          </div>
                      )}
                </div>
            </Card>
          </div>
      </div>

      {/* Goals & Debts Summary Section (New) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Goals */}
          <Card>
              <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <Trophy size={20} className="text-emerald-500" />
                       Minhas Metas
                   </h3>
                   <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{goals.length} ativas</span>
              </div>
              <div className="space-y-4">
                  {goals.slice(0, 3).map(goal => {
                      const percentage = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
                      return (
                          <div key={goal.id}>
                              <div className="flex justify-between items-end mb-1">
                                  <span className="text-sm font-bold text-slate-700">{goal.name}</span>
                                  <span className="text-xs font-medium text-slate-500">{formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                  <div className="h-full rounded-full transition-all" style={{width: `${percentage}%`, backgroundColor: goal.color}}></div>
                              </div>
                          </div>
                      );
                  })}
                  {goals.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Nenhuma meta definida.</p>}
              </div>
          </Card>

          {/* Debt Summary */}
          <Card>
              <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <Banknote size={20} className="text-red-500" />
                       Dívidas Ativas
                   </h3>
                   <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Total: {formatMoney(totalDebt)}</span>
              </div>
              <div className="space-y-3">
                   {debts.slice(0, 3).map(debt => (
                       <div key={debt.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-800">{debt.name}</span>
                               <span className="text-xs text-slate-400">{debt.creditor}</span>
                           </div>
                           <span className="font-bold text-sm text-slate-900">{formatMoney(debt.currentValue)}</span>
                       </div>
                   ))}
                   {debts.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Parabéns! Nenhuma dívida ativa.</p>}
              </div>
          </Card>
      </div>

      {/* Recent Transactions & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-md" noPadding>
                <div className="p-6 flex justify-between items-center border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Últimos Lançamentos</h3>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.slice(0, 5).map((t) => (
                                <tr key={t.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">{t.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'} {formatMoney(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && <div className="p-6 text-center text-slate-400">Nenhum lançamento neste mês</div>}
                </div>

                {/* Mobile List View */}
                <div className="md:hidden">
                    {transactions.slice(0, 5).map((t) => (
                         <div key={t.id} className="p-4 border-b border-slate-50 last:border-none flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-800 text-sm">{t.description}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {t.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                            <span className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {t.type === 'INCOME' ? '+' : '-'} {formatMoney(t.amount)}
                            </span>
                         </div>
                    ))}
                    {transactions.length === 0 && <div className="p-6 text-center text-slate-400">Nenhum lançamento neste mês</div>}
                    {transactions.length > 0 && (
                        <div className="p-4 text-center">
                            <button className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1">
                                Ver tudo <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
                </div>

            </Card>
        </div>

        {/* Annual Summary */}
        <div className="lg:col-span-1">
             <Card className="h-full shadow-md">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Fluxo Anual</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={annualData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                            <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} barSize={10} />
                            <Bar dataKey="expense" fill="#CBD5E1" radius={[2, 2, 0, 0]} barSize={10} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
             </Card>
        </div>
      </div>
    </div>
  );
};