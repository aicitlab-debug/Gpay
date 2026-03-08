
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
import { ViewType, Transaction, Contact } from './types';
import { MOCK_CONTACTS, MOCK_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import Activity from './components/Activity';
import Pay from './components/Pay';
import Insights from './components/Insights';
import Profile from './components/Profile';
import QRScanner from './components/QRScanner';
import Recharge from './components/Recharge';
import SignIn from './components/SignIn';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [balance, setBalance] = useState(5420.75);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [scannedContact, setScannedContact] = useState<Contact | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleScan = (data: string) => {
    // Try to find a contact by name or ID from the scanned data
    const foundContact = MOCK_CONTACTS.find(c => 
      c.id === data || c.name.toLowerCase() === data.toLowerCase()
    );

    if (foundContact) {
      setScannedContact(foundContact);
    } else {
      // Create a temporary contact if not found
      setScannedContact({
        id: 'temp-' + Math.random().toString(36).substr(2, 5),
        name: data,
        phone: 'Scanned via QR',
        avatar: '',
        initials: data.substring(0, 2).toUpperCase(),
        color: 'bg-blue-600'
      });
    }
    setActiveView('pay');
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Dashboard balance={balance} transactions={transactions} onNavigate={setActiveView} />;
      case 'activity':
        return <Activity transactions={transactions} />;
      case 'pay':
        return (
          <Pay 
            initialContact={scannedContact} 
            onComplete={(tx) => {
              handleTransaction(tx);
              setScannedContact(null);
            }} 
            onCancel={() => {
              setActiveView('home');
              setScannedContact(null);
            }} 
          />
        );
      case 'scan':
        return <QRScanner onScan={handleScan} onClose={() => setActiveView('home')} />;
      case 'insights':
        return <Insights transactions={transactions} />;
      case 'profile':
        return <Profile onLogout={() => setIsAuthenticated(false)} />;
      case 'recharge':
        return (
          <Recharge 
            onComplete={handleTransaction}
            onCancel={() => setActiveView('home')}
          />
        );
      default:
        return <Dashboard balance={balance} transactions={transactions} onNavigate={setActiveView} />;
    }
  };

  if (!isAuthenticated) {
    return <SignIn onSignIn={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col md:flex-row overflow-hidden relative">
      {/* AI Processing Overlay */}
      {isAiProcessing && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 animate-spin flex items-center justify-center p-1 shadow-xl">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 animate-pulse"></div>
            </div>
          </div>
          <span className="mt-6 font-bold text-gray-800 tracking-tight animate-pulse">Gemini is thinking...</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 z-30">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
            GP
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Pay</span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <SidebarButton 
            active={activeView === 'home'} 
            icon={<Home size={20} />} 
            label="Dashboard" 
            onClick={() => setActiveView('home')} 
          />
          <SidebarButton 
            active={activeView === 'activity'} 
            icon={<History size={20} />} 
            label="Activity" 
            onClick={() => setActiveView('activity')} 
          />
          <SidebarButton 
            active={activeView === 'insights'} 
            icon={<BarChart2 size={20} />} 
            label="Insights" 
            onClick={() => setActiveView('insights')} 
          />
          <SidebarButton 
            active={activeView === 'profile'} 
            icon={<User size={20} />} 
            label="Profile" 
            onClick={() => setActiveView('profile')} 
          />
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={() => setActiveView('pay')}
            className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={20} /> New Payment
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full bg-white md:bg-gray-50 overflow-hidden">
        {/* Header - Mobile Only or Desktop Top Bar */}
        <header className="px-6 pt-4 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100 md:bg-white md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-[10px]">
              GP
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-800">Pay</span>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeView === 'home' ? 'Dashboard' : activeView}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-800 transition-colors p-2 hover:bg-gray-50 rounded-xl">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              <span className="hidden md:block text-sm font-bold text-gray-700">Alex Johnson</span>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img src="https://picsum.photos/100/100?random=10" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full md:p-6">
            <div className="md:bg-white md:rounded-[40px] md:shadow-sm md:min-h-full">
              {renderView()}
            </div>
          </div>
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center pt-2 pb-8 px-4 z-20 md:hidden">
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
            className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center -mt-10 shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-90 transition-all"
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
    </div>
  );
};

interface SidebarButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
    }`}
  >
    <div className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    {label}
  </button>
);

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
