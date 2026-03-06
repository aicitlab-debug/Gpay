
export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  merchant: string;
  category: string;
  date: string;
  icon?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  initials: string;
  color: string;
}

export interface SpendingInsight {
  summary: string;
  tips: string[];
  totalSpent: number;
  topCategory: string;
}

export type ViewType = 'home' | 'activity' | 'pay' | 'insights' | 'profile';
