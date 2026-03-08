
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, QrCode, CreditCard, ChevronRight, Smartphone, BarChart2, Plus, History } from 'lucide-react';
import { Transaction, ViewType } from '../types';
import TransactionItem from './TransactionItem';

interface DashboardProps {
  balance: number;
  transactions: Transaction[];
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, transactions, onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Wallet Card - More iOS Premium Look */}
        <div className="flex-1 bg-[#1c1c1e] rounded-[32px] p-6 text-white shadow-xl shadow-black/10 flex flex-col gap-5 relative overflow-hidden group min-h-[200px] justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-gray-400">Total Balance</span>
              <span className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
                <span className="text-xl mr-1 text-gray-500 font-medium">$</span>
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <CreditCard size={20} className="text-gray-300" />
            </div>
          </div>
          <div className="flex gap-3 z-10">
            <button className="flex-1 bg-white text-black py-3 rounded-2xl text-[13px] font-bold transition-all hover:bg-gray-100 active:scale-95 flex items-center justify-center gap-2">
              <ArrowDownLeft size={14} strokeWidth={3} /> Add Money
            </button>
            <button className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 rounded-2xl text-[13px] font-bold transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2">
              <ArrowUpRight size={14} strokeWidth={3} /> Send Money
            </button>
          </div>
        </div>

        {/* Reward Banner - Desktop Side */}
        <div className="lg:w-1/3 bg-gradient-to-br from-[#FF9500] to-[#FF2D55] rounded-[32px] p-6 text-white flex flex-col justify-between cursor-pointer active:scale-95 transition-all shadow-lg shadow-red-500/20 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex flex-col gap-1 z-10">
            <span className="font-bold text-xl">Cashback ready!</span>
            <span className="text-[13px] font-medium opacity-90">You have earned $12.50 this week</span>
          </div>
          <div className="mt-4 flex items-center justify-between z-10">
            <span className="text-[12px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">Claim Now</span>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-4">
          <ActionButton icon={<QrCode size={22} className="text-blue-600" />} label="QR Scan" onClick={() => onNavigate('scan')} />
          <ActionButton icon={<ArrowUpRight size={22} className="text-green-600" />} label="Send" onClick={() => onNavigate('pay')} />
          <ActionButton icon={<Smartphone size={22} className="text-pink-600" />} label="Recharge" onClick={() => onNavigate('recharge')} />
          <ActionButton icon={<ArrowDownLeft size={22} className="text-orange-600" />} label="Request" onClick={() => {}} />
          <ActionButton icon={<CreditCard size={22} className="text-purple-600" />} label="Bills" onClick={() => {}} />
          <ActionButton icon={<History size={22} className="text-indigo-600" />} label="History" onClick={() => onNavigate('activity')} />
          <ActionButton icon={<BarChart2 size={22} className="text-teal-600" />} label="Insights" onClick={() => onNavigate('insights')} />
          <ActionButton icon={<Plus size={22} className="text-red-600" />} label="More" onClick={() => {}} />
        </div>
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
        <div className="bg-gray-50/50 rounded-[32px] p-4 border border-gray-100 flex flex-col gap-1">
          {transactions.slice(0, 5).map(tx => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 transition-all group"
  >
    <div className="w-full aspect-square max-w-[64px] rounded-2xl bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-blue-100 group-active:scale-90 transition-all">
      {icon}
    </div>
    <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{label}</span>
  </button>
);

export default Dashboard;
