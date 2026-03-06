
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Transaction } from '../types';
import TransactionItem from './TransactionItem';

interface ActivityProps {
  transactions: Transaction[];
}

const Activity: React.FC<ActivityProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for merchants or bills"
          className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Search size={48} className="mb-2" />
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
