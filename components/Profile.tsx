
import React from 'react';
import { Settings, Shield, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col p-6 md:p-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
          <img src="https://picsum.photos/200/200?random=10" alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <User className="text-white" />
          </div>
        </div>
        <div className="text-center md:text-left md:pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Johnathan Doe</h2>
          <p className="text-gray-500 font-medium text-lg">john.doe@gmail.com</p>
          <div className="mt-4 flex gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">Premium User</span>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wider">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileOption icon={<Settings className="text-gray-500" />} label="Settings" />
        <ProfileOption icon={<Shield className="text-blue-500" />} label="Security & Privacy" />
        <ProfileOption icon={<HelpCircle className="text-green-500" />} label="Help & Feedback" />
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors w-full font-bold border border-transparent hover:border-red-100"
        >
          <div className="p-2 rounded-xl bg-red-50">
            <LogOut size={20} />
          </div>
          <span>Logout</span>
        </button>
      </div>

      <div className="mt-12 bg-gray-50 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">G-Pay Version</h4>
          <p className="text-sm font-medium text-gray-600">v3.42.0-stable</p>
        </div>
        <p className="text-[11px] text-gray-400 md:text-right">© 2024 Built with Gemini AI. All rights reserved.</p>
      </div>
    </div>
  );
};

const ProfileOption: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-xl bg-gray-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
        {icon}
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
  </button>
);

export default Profile;
