
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MonthContextType, Transaction, Budget, Goal, CreditCard, FamilyMember, RecurringBill, Debt, Insight, Notification } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const FinanceContext = createContext<MonthContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children?: ReactNode }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]); // Store all
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Store filtered
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Member Filter State
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);

  const currentMonth = currentMonthDate.toISOString().slice(0, 7); // YYYY-MM

  // Initialize Member Login if applicable (Legacy support or future implementation)
  useEffect(() => {
      const code = localStorage.getItem('member_access_code');
      if (code && familyMembers.length > 0) {
          const member = familyMembers.find(m => m.accessCode === code);
          if (member) {
              setCurrentMemberId(member.id);
          }
      }
  }, [familyMembers]);

  // Helper: Check if an entity has a transaction this month
  const hasTransactionThisMonth = (relatedId: string, type: 'INCOME' | 'EXPENSE') => {
      return rawTransactions.some(t => 
          t.relatedEntityId === relatedId && 
          t.type === type &&
          t.date.startsWith(currentMonth)
      );
  };

  const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const today = new Date();
      const currentDay = today.getDate();
      const isSameMonth = today.getMonth() === currentMonthDate.getMonth() && today.getFullYear() === currentMonthDate.getFullYear();

      if (!isSameMonth) {
          setNotifications([]);
          return;
      }

      // Filter notifications based on logged member if applicable
      const visibleMembers = currentMemberId 
        ? familyMembers.filter(m => m.id === currentMemberId) 
        : familyMembers;

      // 1. Check Salaries (Income)
      visibleMembers.forEach(member => {
          if (member.salary > 0 && currentDay >= member.payDay) {
              if (!hasTransactionThisMonth(member.id, 'INCOME')) {
                  newNotifications.push({
                      id: `salary-${member.id}`,
                      type: 'SALARY_DUE',
                      title: 'Recebimento de Salário',
                      message: `${member.name} recebeu o salário hoje?`,
                      amount: member.salary,
                      relatedId: member.id,
                      date: today.toISOString().split('T')[0]
                  });
              }
          }
      });

      // 2. Check Recurring Bills (Expense)
      // If member is logged in, show only bills assigned to them OR unassigned bills
      const visibleBills = currentMemberId
        ? recurringBills.filter(b => b.familyMemberId === currentMemberId || !b.familyMemberId)
        : recurringBills;

      visibleBills.forEach(bill => {
          if (!bill.isAutoPaid && currentDay >= bill.dueDay) {
              if (!hasTransactionThisMonth(bill.id, 'EXPENSE')) {
                  newNotifications.push({
                      id: `bill-${bill.id}`,
                      type: 'BILL_DUE',
                      title: 'Conta a Pagar',
                      message: `Você já pagou ${bill.description}?`,
                      amount: bill.amount,
                      relatedId: bill.id,
                      date: today.toISOString().split('T')[0]
                  });
              }
          }
      });

      // 3. Check Debts
      debts.forEach(debt => {
          if (debt.status === 'active') {
              const dueDay = parseInt(debt.dueDate.split('-')[2]);
              if (currentDay >= dueDay) {
                  if (!hasTransactionThisMonth(debt.id, 'EXPENSE')) {
                      const estimatedInstallment = debt.totalValue / 12;
                      newNotifications.push({
                          id: `debt-${debt.id}`,
                          type: 'DEBT_DUE',
                          title: 'Parcela de Dívida',
                          message: `Pagamento da dívida ${debt.name} realizado?`,
                          amount: estimatedInstallment,
                          relatedId: debt.id,
                          date: today.toISOString().split('T')[0]
                      });
                  }
              }
          }
      });

      setNotifications(newNotifications);
  };

  // Fetch Data
  const refreshData = async () => {
    setIsLoading(true);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const startOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).toISOString();
        const endOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).toISOString();

        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .gte('date', startOfMonth)
          .lte('date', endOfMonth)
          .order('date', { ascending: false });

        if (txData) setRawTransactions(txData);

        const { data: memberData } = await supabase.from('family_members').select('*');
        if (memberData) setFamilyMembers(memberData);
        
        const { data: cardData } = await supabase.from('credit_cards').select('*');
        if (cardData) setCreditCards(cardData);

        const { data: goalData } = await supabase.from('goals').select('*');
        if (goalData) setGoals(goalData);
        
        const { data: billsData } = await supabase.from('recurring_bills').select('*');
        if (billsData) setRecurringBills(billsData);
        
        const { data: debtsData } = await supabase.from('debts').select('*');
        if (debtsData) setDebts(debtsData);

      } catch (error) {
        console.error("Supabase fetch error:", error);
      }
    }
    // No mock fallback anymore. If DB is empty, dashboard is empty.
    
    setIsLoading(false);
  };

  // Filter transactions when member changes or raw data changes
  useEffect(() => {
      if (currentMemberId) {
          setTransactions(rawTransactions.filter(t => t.familyMemberId === currentMemberId));
      } else {
          setTransactions(rawTransactions);
      }
  }, [currentMemberId, rawTransactions]);

  useEffect(() => {
      if (!isLoading) {
          generateNotifications();
      }
  }, [isLoading, rawTransactions, recurringBills, familyMembers, debts, currentMonthDate, currentMemberId]);

  useEffect(() => {
    refreshData();
  }, [currentMonth]);

  // Derived Calculations
  const income = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  // --- ACTIONS ---

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    // 1. Add Transaction
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('transactions').insert([tx]);
      if (!error) refreshData();
    } 

    // 2. SIDE EFFECTS (Update Goals or Debts)
    if (tx.relatedEntityId) {
        // Is it a Debt Payment?
        const debt = debts.find(d => d.id === tx.relatedEntityId);
        if (debt && tx.type === 'EXPENSE') {
            const newCurrent = Math.max(0, debt.currentValue - tx.amount);
            await updateDebt(debt.id, { currentValue: newCurrent });
        }

        // Is it a Goal Deposit?
        const goal = goals.find(g => g.id === tx.relatedEntityId);
        if (goal && tx.type === 'EXPENSE') { // Saving money is treated as an 'Expense' from the main wallet to the goal wallet
            const newCurrent = goal.currentAmount + tx.amount;
            await updateGoal(goal.id, { currentAmount: newCurrent });
        }
    }
  };

  // NOTIFICATION HANDLER
  const handleNotificationAction = async (notification: Notification, action: 'CONFIRM' | 'DISMISS') => {
      if (action === 'DISMISS') {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
          return;
      }

      if (action === 'CONFIRM') {
          // Logic based on type
          if (notification.type === 'SALARY_DUE') {
              await addTransaction({
                  description: `Salário Referente ${notification.date}`,
                  amount: notification.amount || 0,
                  type: 'INCOME',
                  category: 'Salário',
                  date: notification.date,
                  paymentMethod: 'Conta Corrente',
                  expenseCategory: 'FIXED',
                  relatedEntityId: notification.relatedId,
                  familyMemberId: notification.relatedId
              });
          } else if (notification.type === 'BILL_DUE') {
              const bill = recurringBills.find(b => b.id === notification.relatedId);
              await addTransaction({
                  description: notification.title.replace('Conta a Pagar', 'Pagamento') + `: ${notification.message.split('?')[0].replace('Você já pagou ', '')}`,
                  amount: notification.amount || 0,
                  type: 'EXPENSE',
                  category: 'Moradia',
                  date: notification.date,
                  paymentMethod: 'Conta Corrente',
                  expenseCategory: 'FIXED',
                  relatedEntityId: notification.relatedId,
                  familyMemberId: bill?.familyMemberId
              });
          } else if (notification.type === 'DEBT_DUE') {
              await addTransaction({
                  description: notification.title,
                  amount: notification.amount || 0,
                  type: 'EXPENSE',
                  category: 'Dívidas',
                  date: notification.date,
                  paymentMethod: 'Conta Corrente',
                  expenseCategory: 'FIXED',
                  relatedEntityId: notification.relatedId
              });
          }

          setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }
  };

  // MEMBERS
  const addFamilyMember = async (member: Omit<FamilyMember, 'id'>) => {
      if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('family_members').insert([member]);
          if (!error) refreshData();
      }
  };

  const updateFamilyMember = async (id: string, updates: Partial<FamilyMember>) => {
      if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('family_members').update(updates).eq('id', id);
          if (!error) refreshData();
      }
  };

  const removeFamilyMember = async (id: string) => {
      if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('family_members').delete().eq('id', id);
          if (!error) refreshData();
      }
  };

  // BILLS
  const addRecurringBill = async (bill: Omit<RecurringBill, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('recurring_bills').insert([bill]);
        if (!error) refreshData();
    }
  };

  const removeRecurringBill = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('recurring_bills').delete().eq('id', id);
        if (!error) refreshData();
    }
  };

  // DEBTS
  const addDebt = async (debt: Omit<Debt, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('debts').insert([debt]);
        if (!error) refreshData();
    }
  };

  const removeDebt = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('debts').delete().eq('id', id);
        if (!error) refreshData();
    }
  };

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('debts').update(updates).eq('id', id);
        if (!error) refreshData();
    }
  };


  // CARDS
  const addCreditCard = async (card: Omit<CreditCard, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('credit_cards').insert([card]);
        if (!error) refreshData();
    }
  };

  const removeCreditCard = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('credit_cards').delete().eq('id', id);
        if (!error) refreshData();
    }
  };

  // GOALS
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('goals').insert([goal]);
        if (!error) refreshData();
    }
  };

  const removeGoal = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (!error) refreshData();
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('goals').update(updates).eq('id', id);
        if (!error) refreshData();
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonthDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonthDate(newDate);
  };
  
  const validateMemberCode = async (code: string): Promise<boolean> => {
      if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.from('family_members').select('id').eq('accessCode', code).single();
          return !!data;
      }
      return false;
  };

  const filterByMember = (memberId: string | null) => {
      setCurrentMemberId(memberId);
  };

  const insights: Insight[] = [
    {
      id: '1',
      type: 'prediction',
      message: `Com base na renda fixa (R$ ${familyMembers.reduce((a, b) => a + b.salary, 0).toLocaleString('pt-BR')}), você tem R$ ${recurringBills.reduce((a, b) => a + b.amount, 0).toLocaleString('pt-BR')} de contas fixas previstas.`,
      highlight: 'Análise de Risco'
    }
  ];

  return (
    <FinanceContext.Provider value={{
      currentMonth,
      balance,
      income,
      expenses,
      transactions,
      budgets,
      goals,
      creditCards,
      familyMembers,
      recurringBills,
      debts,
      insights,
      notifications,
      isLoading,
      addTransaction,
      addFamilyMember,
      updateFamilyMember,
      removeFamilyMember,
      addRecurringBill,
      removeRecurringBill,
      addCreditCard,
      removeCreditCard,
      addGoal,
      removeGoal,
      updateGoal,
      addDebt,
      removeDebt,
      updateDebt,
      handleNotificationAction,
      changeMonth,
      refreshData,
      validateMemberCode,
      filterByMember, 
      currentMemberId
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
