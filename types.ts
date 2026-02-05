
export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER';
export type ExpenseCategoryType = 'FIXED' | 'VARIABLE'; // Aluguel/Luz vs Mercado/Lazer

export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Pai, Mãe, Filho, etc.
  color: string;
  avatarUrl?: string;
  salary: number;      // Monthly Salary
  payDay: number;      // Day of month (1-31)
  email?: string;
  phone?: string;
  accessCode?: string; // Code for member login
  isAccessActive?: boolean;
}

export interface RecurringBill {
  id: string;
  description: string;
  amount: number;
  category: string;
  dueDay: number;      // Day of month (1-31)
  isAutoPaid: boolean;
  familyMemberId?: string; // Who pays this?
}

export interface Debt {
  id: string;
  name: string;
  totalValue: number;
  currentValue: number; // Quanto falta pagar ou valor atual
  interestRate?: number; // Juros %
  dueDate: string; // YYYY-MM-DD (Used to extract day for monthly payment)
  creditor: string; // Banco X, Fulano...
  status: 'active' | 'paid' | 'late';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  expenseCategory?: ExpenseCategoryType; // Fixed or Variable
  category: string; // Tag: Alimentação, Moradia...
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  creditCardId?: string;
  familyMemberId?: string; // Who made this transaction
  details?: string; // "Pão, leite, água"
  isRecurring?: boolean;
  relatedEntityId?: string; // ID of the Bill, Debt or Member (Salary) to avoid duplicate prompts
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  used: number;
  dueDate: string;
  lastDigits: string;
  ownerId?: string; // Card belongs to whom
  color?: string; // Visual theme
}

export interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'neutral' | 'prediction';
  message: string;
  highlight?: string;
}

export interface Notification {
    id: string;
    type: 'BILL_DUE' | 'SALARY_DUE' | 'DEBT_DUE' | 'GOAL_REMINDER';
    title: string;
    message: string;
    amount?: number;
    relatedId: string; // ID of the entity
    date: string;
}

export interface MonthContextType {
  currentMonth: string;
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  creditCards: CreditCard[];
  familyMembers: FamilyMember[];
  recurringBills: RecurringBill[];
  debts: Debt[];
  insights: Insight[];
  notifications: Notification[];
  isLoading: boolean;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  
  // Member Actions
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  
  // Bill Actions
  addRecurringBill: (bill: Omit<RecurringBill, 'id'>) => Promise<void>;
  removeRecurringBill: (id: string) => Promise<void>;

  // Card Actions
  addCreditCard: (card: Omit<CreditCard, 'id'>) => Promise<void>;
  removeCreditCard: (id: string) => Promise<void>;

  // Debt Actions
  addDebt: (debt: Omit<Debt, 'id'>) => Promise<void>;
  removeDebt: (id: string) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;

  // Notification Actions
  handleNotificationAction: (notification: Notification, action: 'CONFIRM' | 'DISMISS') => Promise<void>;

  changeMonth: (direction: 'prev' | 'next') => void;
  refreshData: () => void;
  validateMemberCode: (code: string) => Promise<boolean>;

  // Filter Actions
  filterByMember: (memberId: string | null) => void;
  currentMemberId: string | null;
}

export interface ParsedInput {
  amount: number | null;
  description: string;
  category: string | null;
  paymentMethod: string | null;
  type: TransactionType;
  confidence: number;
}
