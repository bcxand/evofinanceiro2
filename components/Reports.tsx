import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, LineChart, Line, CartesianGrid, YAxis } from 'recharts';
import { Sparkles, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export const Reports: React.FC = () => {
    const { transactions, income, expenses } = useFinance();
    
    // Group expenses by category
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
        color: ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#6366F1', '#EC4899'][index % 7]
    }));

    // Dynamic Comparison Data (Strictly current month context)
    // No fake data/simulation allowed per user request
    const comparisonData = useMemo(() => {
        const today = new Date();
        const currentMonthName = today.toLocaleString('pt-BR', { month: 'short' });
        
        return [
            { name: currentMonthName, income: income, expense: expenses }
        ];
    }, [income, expenses]);

    const generateHeatmap = () => {
        const days = Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            // Calculate intensity based on transactions on that day
            const txCount = transactions.filter(t => new Date(t.date).getDate() === day).reduce((acc, t) => acc + t.amount, 0);
            let intensity = 1;
            if (txCount > 500) intensity = 4;
            else if (txCount > 200) intensity = 3;
            else if (txCount > 0) intensity = 2;
            
            return { day, intensity, value: txCount };
        });
        return days;
    };
    const heatmapData = useMemo(() => generateHeatmap(), [transactions]);

    const getIntensityColor = (intensity: number) => {
        switch(intensity) {
            case 1: return 'bg-gray-100';
            case 2: return 'bg-emerald-200';
            case 3: return 'bg-emerald-400';
            case 4: return 'bg-emerald-600';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Relatórios Detalhados</h2>
                    <p className="text-sm text-gray-500">Análise completa dos gastos familiares</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                    <Sparkles size={12} />
                    <span>Inteligência Ativa</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Comparison Line Chart (Updated) */}
                <Card className="col-span-1 md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-900 font-bold text-lg">Evolução: Receitas vs Despesas</h3>
                            <p className="text-sm text-gray-500">Comparativo Mensal</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Receitas
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Despesas
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#6B7280'}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#6B7280'}} 
                                    tickFormatter={(val) => `R$${val/1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} 
                                    formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="income" 
                                    name="Receita Total"
                                    stroke="#10B981" 
                                    strokeWidth={3} 
                                    dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} 
                                    activeDot={{r: 6}} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="expense" 
                                    name="Despesa Total"
                                    stroke="#EF4444" 
                                    strokeWidth={3} 
                                    dot={{r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff'}} 
                                    activeDot={{r: 6}} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Distribution Chart */}
                <Card>
                    <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                        Distribuição por Categoria
                    </h3>
                    <div className="h-64 w-full">
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
                                        contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#111827' }}
                                        formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="h-full flex items-center justify-center text-gray-400">Sem dados para exibir</div>
                        )}
                    </div>
                </Card>

                {/* Heatmap */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                            <Calendar size={18} className="text-gray-400" />
                            Intensidade de Gastos (Mês Atual)
                        </h3>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                        {heatmapData.map((d) => (
                            <div 
                                key={d.day} 
                                className={`aspect-square rounded-md ${getIntensityColor(d.intensity)} transition-all hover:scale-110 cursor-pointer`}
                                title={`Dia ${d.day}: R$ ${d.value}`}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-3 px-1">
                        <span>Dia 1</span>
                        <div className="flex gap-1 items-center">
                            <div className="w-2 h-2 bg-gray-100 rounded"></div>
                            <div className="w-2 h-2 bg-emerald-200 rounded"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded"></div>
                            <div className="w-2 h-2 bg-emerald-600 rounded"></div>
                        </div>
                        <span>Dia 30</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};