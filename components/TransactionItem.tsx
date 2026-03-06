
import React from 'react';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isDebit = transaction.type === 'debit';
  
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-sm border border-gray-50 group-hover:scale-105 transition-transform">
          {transaction.icon || '💸'}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{transaction.merchant}</span>
          <span className="text-xs text-gray-500">{transaction.date} • {transaction.category}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-bold ${isDebit ? 'text-gray-900' : 'text-green-600'}`}>
          {isDebit ? '-' : '+'}${transaction.amount.toFixed(2)}
        </span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Completed</span>
      </div>
    </div>
  );
};

export default TransactionItem;
