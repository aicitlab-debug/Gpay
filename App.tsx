
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  History, 
  CreditCard, 
  BarChart2, 
  User, 
  Plus, 
  Bell
} from 'lucide-react';
import { ViewType, Transaction } from './types';
import { MOCK_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import Activity from './components/Activity';
import Pay from './components/Pay';
import Insights from './components/Insights';
import Profile from './components/Profile';
import IPhoneFrame from './components/IPhoneFrame';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [balance, setBalance] = useState(5420.75);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Monitor when insights are loading
  useEffect(() => {
    if (activeView === 'insights') {
      setIsAiProcessing(true);
      const timer = setTimeout(() => setIsAiProcessing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

  const handleTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    if (newTx.type === 'debit') {
      setBalance(prev => prev - newTx.amount);
    } else {
      setBalance(prev => prev + newTx.amount);
    }
    setActiveView('home');
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Dashboard balance={balance} transactions={transactions} onNavigate={setActiveView} />;
      case 'activity':
        return <Activity transactions={transactions} />;
      case 'pay':
        return <Pay onComplete={handleTransaction} onCancel={() => setActiveView('home')} />;
      case 'insights':
        return <Insights transactions={transactions} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard balance={balance} transactions={transactions} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-4">
      <IPhoneFrame isProcessing={isAiProcessing}>
        <div className="flex-1 flex flex-col bg-white overflow-hidden pb-10">
          {/* Header */}
          <header className="px-6 pt-2 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-[10px]">
                GP
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-800">Pay</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-800 transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={() => setActiveView('profile')}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-200"
              >
                <img src="https://picsum.photos/100/100?random=10" alt="Profile" className="w-full h-full object-cover" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {renderView()}
          </main>

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center pt-2 pb-6 px-4 z-20">
            <NavButton 
              active={activeView === 'home'} 
              icon={<Home size={22} />} 
              label="Home" 
              onClick={() => setActiveView('home')} 
            />
            <NavButton 
              active={activeView === 'activity'} 
              icon={<History size={22} />} 
              label="Activity" 
              onClick={() => setActiveView('activity')} 
            />
            <button 
              onClick={() => setActiveView('pay')}
              className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center -mt-8 shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-90 transition-all"
            >
              <Plus size={28} />
            </button>
            <NavButton 
              active={activeView === 'insights'} 
              icon={<BarChart2 size={22} />} 
              label="Insights" 
              onClick={() => setActiveView('insights')} 
            />
            <NavButton 
              active={activeView === 'profile'} 
              icon={<User size={22} />} 
              label="Profile" 
              onClick={() => setActiveView('profile')} 
            />
          </nav>
        </div>
      </IPhoneFrame>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 transition-all ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

export default App;
