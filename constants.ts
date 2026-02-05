import { Transaction, Budget, Goal, CreditCard, FamilyMember, RecurringBill, Debt } from './types';

export const COLORS = {
  bg: '#F9FAFB', 
  bgSecondary: '#FFFFFF',
  textPrimary: '#064E3B', // Dark Green
  textSecondary: '#64748B',
  action: '#10B981', // Emerald
  success: '#10B981',
  warning: '#F59E0B',
  alert: '#EF4444',
  border: '#E2E8F0',
};

export const FAMILY_MEMBERS_MOCK: FamilyMember[] = [
    { id: '1', name: 'Ricardo', role: 'Pai', color: '#10B981', salary: 8500, payDay: 5, email: 'ricardo@email.com' },
    { id: '2', name: 'Ana', role: 'Mãe', color: '#34D399', salary: 6500, payDay: 5, email: 'ana@email.com' },
    { id: '3', name: 'Lucas', role: 'Filho', color: '#6EE7B7', salary: 0, payDay: 0 },
];

export const RECURRING_BILLS_MOCK: RecurringBill[] = [
    { id: '1', description: 'Aluguel Apartamento', amount: 3200.00, dueDay: 10, category: 'Moradia', isAutoPaid: false, familyMemberId: '1' },
    { id: '2', description: 'Escola Lucas', amount: 1500.00, dueDay: 7, category: 'Educação', isAutoPaid: true, familyMemberId: '1' },
];

export const INITIAL_DEBTS: Debt[] = [
  { id: '1', name: 'Empréstimo Carro', creditor: 'Santander', totalValue: 45000, currentValue: 22000, dueDate: '2025-10-10', status: 'active', interestRate: 1.2 },
  { id: '2', name: 'Cartão Antigo', creditor: 'Nubank', totalValue: 2500, currentValue: 2500, dueDate: '2024-05-15', status: 'late', interestRate: 8.5 },
];

export const ANNUAL_DATA = [
  { name: 'Jan', income: 12000, expense: 9000 },
  { name: 'Fev', income: 12500, expense: 8500 },
  { name: 'Mar', income: 11000, expense: 9800 },
  { name: 'Abr', income: 13000, expense: 8000 },
  { name: 'Mai', income: 12000, expense: 10000 },
  { name: 'Jun', income: 14000, expense: 11000 },
  { name: 'Jul', income: 12000, expense: 9500 },
  { name: 'Ago', income: 12500, expense: 8900 },
  { name: 'Set', income: 13500, expense: 9200 },
  { name: 'Out', income: 15000, expense: 10500 }, 
  { name: 'Nov', income: 0, expense: 0 },
  { name: 'Dez', income: 0, expense: 0 },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
      id: '1', 
      description: 'Salário Ricardo', 
      amount: 8500.00, 
      type: 'INCOME', 
      expenseCategory: 'FIXED',
      category: 'Salário', 
      date: '2023-10-01', 
      paymentMethod: 'Conta Corrente', 
      familyMemberId: '1' 
  },
  { 
      id: '2', 
      description: 'Salário Ana', 
      amount: 6500.00, 
      type: 'INCOME', 
      expenseCategory: 'FIXED',
      category: 'Salário', 
      date: '2023-10-02', 
      paymentMethod: 'Conta Corrente', 
      familyMemberId: '2' 
  },
  { 
      id: '4', 
      description: 'Mercado Semanal', 
      amount: 850.45, 
      type: 'EXPENSE', 
      expenseCategory: 'VARIABLE',
      category: 'Alimentação', 
      date: '2023-10-10', 
      paymentMethod: 'Crédito', 
      creditCardId: '1',
      familyMemberId: '2',
      details: 'Carne, Arroz, Feijão, Produtos de Limpeza'
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: '1', category: 'Alimentação', limit: 2500, spent: 1450.90 },
  { id: '2', category: 'Educação', limit: 2000, spent: 1850.00 }, 
];

export const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'Viagem Disney', targetAmount: 40000, currentAmount: 12000, deadline: '2025-12-01', color: '#10B981' },
];

export const INITIAL_CARDS: CreditCard[] = [
  { id: '1', name: 'Visa Infinite (Pai)', limit: 30000, used: 8420.50, dueDate: '10', lastDigits: '4921', ownerId: '1' },
];

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Alimentação': ['mercado', 'comida', 'lanche', 'restaurante', 'ifood', 'pizza', 'padaria'],
  'Transporte': ['uber', '99', 'taxi', 'gasolina', 'posto', 'onibus', 'metro'],
  'Lazer': ['netflix', 'cinema', 'jogo', 'spotify', 'steam', 'viagem'],
  'Moradia': ['aluguel', 'condominio', 'luz', 'agua', 'internet', 'iptu'],
  'Educação': ['escola', 'curso', 'faculdade', 'livro'],
  'Saúde': ['farmacia', 'medico', 'dentista', 'remedio', 'plano'],
  'Salário': ['salario', 'pagamento', 'prolabore'],
};

export const PAYMENT_KEYWORDS: Record<string, string[]> = {
  'Crédito': ['credito', 'cartao', 'visa', 'master'],
  'Débito': ['debito'],
  'Pix': ['pix', 'transferencia'],
  'Boleto': ['boleto', 'conta'],
};