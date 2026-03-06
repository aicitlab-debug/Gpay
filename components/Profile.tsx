
import React from 'react';
import { Settings, Shield, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col p-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
          <img src="https://picsum.photos/200/200?random=10" alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <User className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Johnathan Doe</h2>
          <p className="text-gray-500 font-medium">john.doe@gmail.com</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ProfileOption icon={<Settings className="text-gray-500" />} label="Settings" />
        <ProfileOption icon={<Shield className="text-blue-500" />} label="Security & Privacy" />
        <ProfileOption icon={<HelpCircle className="text-green-500" />} label="Help & Feedback" />
        
        <div className="h-px bg-gray-100 my-4"></div>
        
        <button className="flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors w-full font-bold">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="mt-10 bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 border border-gray-100">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">G-Pay Version</h4>
        <p className="text-sm font-medium text-gray-600">v3.42.0-stable</p>
        <p className="text-[10px] text-gray-400">© 2024 Built with Gemini AI</p>
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
