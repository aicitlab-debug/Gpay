
import { Transaction, Contact } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'debit', amount: 45.50, merchant: 'Whole Foods', category: 'Groceries', date: '2023-10-25', icon: '🛒' },
  { id: '2', type: 'debit', amount: 12.00, merchant: 'Starbucks', category: 'Dining', date: '2023-10-24', icon: '☕' },
  { id: '3', type: 'credit', amount: 1500.00, merchant: 'Salary Deposit', category: 'Income', date: '2023-10-01', icon: '💰' },
  { id: '4', type: 'debit', amount: 89.99, merchant: 'Amazon', category: 'Shopping', date: '2023-10-23', icon: '📦' },
  { id: '5', type: 'debit', amount: 25.00, merchant: 'Shell Gas Station', category: 'Transport', date: '2023-10-22', icon: '⛽' },
  { id: '6', type: 'debit', amount: 15.00, merchant: 'Netflix', category: 'Entertainment', date: '2023-10-20', icon: '📺' },
  { id: '7', type: 'debit', amount: 120.00, merchant: 'Electric Bill', category: 'Utilities', date: '2023-10-18', icon: '⚡' },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Alex Rivera', phone: '+1 234 567 890', avatar: 'https://picsum.photos/200/200?random=1', initials: 'AR', color: 'bg-blue-500' },
  { id: 'c2', name: 'Jordan Smith', phone: '+1 345 678 901', avatar: 'https://picsum.photos/200/200?random=2', initials: 'JS', color: 'bg-green-500' },
  { id: 'c3', name: 'Casey Johnson', phone: '+1 456 789 012', avatar: 'https://picsum.photos/200/200?random=3', initials: 'CJ', color: 'bg-purple-500' },
  { id: 'c4', name: 'Taylor Wong', phone: '+1 567 890 123', avatar: 'https://picsum.photos/200/200?random=4', initials: 'TW', color: 'bg-yellow-500' },
  { id: 'c5', name: 'Morgan Lee', phone: '+1 678 901 234', avatar: 'https://picsum.photos/200/200?random=5', initials: 'ML', color: 'bg-red-500' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#FBBC04',
  Dining: '#EA4335',
  Income: '#34A853',
  Shopping: '#4285F4',
  Transport: '#9334E6',
  Entertainment: '#F25C05',
  Utilities: '#4285F4',
};
