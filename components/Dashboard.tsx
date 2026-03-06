
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, QrCode, CreditCard, ChevronRight } from 'lucide-react';
import { Transaction, ViewType } from '../types';
import TransactionItem from './TransactionItem';

interface DashboardProps {
  balance: number;
  transactions: Transaction[];
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, transactions, onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 p-5 animate-in fade-in duration-500">
      {/* Wallet Card - More iOS Premium Look */}
      <div className="bg-[#1c1c1e] rounded-[32px] p-6 text-white shadow-xl shadow-black/10 flex flex-col gap-5 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-400">Total Balance</span>
            <span className="text-3xl font-bold tracking-tight mt-1">
              <span className="text-xl mr-1 text-gray-500 font-medium">$</span>
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <CreditCard size={20} className="text-gray-300" />
          </div>
        </div>
        <div className="flex gap-3 z-10">
          <button className="flex-1 bg-white text-black py-2.5 rounded-2xl text-[13px] font-bold transition-all hover:bg-gray-100 active:scale-95 flex items-center justify-center gap-2">
            <ArrowDownLeft size={14} strokeWidth={3} /> Add
          </button>
          <button className="flex-1 bg-white/10 backdrop-blur-md text-white py-2.5 rounded-2xl text-[13px] font-bold transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2">
            <ArrowUpRight size={14} strokeWidth={3} /> Send
          </button>
        </div>
      </div>

      {/* Quick Actions - Compact Grid */}
      <div className="grid grid-cols-4 gap-2">
        <ActionButton icon={<QrCode size={22} className="text-blue-600" />} label="QR Scan" onClick={() => {}} />
        <ActionButton icon={<ArrowUpRight size={22} className="text-green-600" />} label="Send" onClick={() => onNavigate('pay')} />
        <ActionButton icon={<ArrowDownLeft size={22} className="text-orange-600" />} label="Request" onClick={() => {}} />
        <ActionButton icon={<CreditCard size={22} className="text-purple-600" />} label="Bills" onClick={() => {}} />
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Activity</h2>
          <button 
            onClick={() => onNavigate('activity')}
            className="text-blue-600 text-[13px] font-bold flex items-center gap-0.5 hover:underline"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-gray-50/50 rounded-3xl p-2 border border-gray-100 flex flex-col gap-1">
          {transactions.slice(0, 4).map(tx => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>

      {/* Reward Banner */}
      <div className="bg-gradient-to-br from-[#FF9500] to-[#FF2D55] rounded-[28px] p-5 text-white flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-lg shadow-red-500/20">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-lg">Cashback ready!</span>
          <span className="text-[12px] font-medium opacity-80">Tap to scratch and claim</span>
        </div>
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
          ✨
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 transition-all hover:opacity-70 active:scale-90"
  >
    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group">
      {icon}
    </div>
    <span className="text-[11px] font-bold text-gray-500">{label}</span>
  </button>
);

export default Dashboard;
