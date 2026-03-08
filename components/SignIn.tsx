
import React, { useState } from 'react';
import { Fingerprint, ShieldCheck } from 'lucide-react';

interface SignInProps {
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onSignIn();
      }, 1000);
    }
  };

  const handleFingerprintClick = () => {
    setIsScanning(true);
    // Simulate biometric scan
    setTimeout(() => {
      setIsScanning(false);
      onSignIn();
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center animate-in fade-in duration-700 relative overflow-hidden">
      {/* Background Decorative Elements - Desktop Only */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Biometric Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center">
              <Fingerprint size={48} className="text-blue-600 animate-pulse" />
            </div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="mt-8 text-xl font-bold text-gray-800">Scanning Fingerprint</h3>
          <p className="text-gray-500 mt-2">Hold your finger on the sensor</p>
        </div>
      )}

      <div className="w-full h-full md:h-auto md:max-w-md md:bg-white md:rounded-[48px] md:shadow-2xl md:shadow-black/5 p-8 md:p-12 flex flex-col relative z-10">
        <div className="flex-1 flex flex-col justify-center gap-10 w-full">
          {/* Logo/Branding */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-blue-500/20">
              GP
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-gray-500 mt-2 font-medium">Unlock your secure wallet</p>
            </div>
          </div>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-6">
              <p className="text-gray-500 font-medium">Enter your 4-digit PIN</p>
              <div className="flex gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      pin.length > i ? 'bg-blue-600 border-blue-600 scale-125' : 'bg-transparent border-gray-300'
                    }`}
                  />
                ))}
              </div>
              <input 
                type="tel"
                maxLength={4}
                autoFocus
                className="opacity-0 absolute"
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 4) setPin(val);
                  if (val.length === 4) {
                    // Auto submit
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      onSignIn();
                    }, 1000);
                  }
                }}
              />
              
              {/* Custom Number Pad */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((num, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (num === 'back') {
                        setPin(prev => prev.slice(0, -1));
                      } else if (typeof num === 'number') {
                        if (pin.length < 4) setPin(prev => prev + num);
                      }
                    }}
                    className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-90 ${
                      num === '' ? 'pointer-events-none' : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    {num === 'back' ? '←' : num}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Biometric Option */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] flex-1 bg-gray-100"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Or use biometric
              </span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            
            <button 
              onClick={handleFingerprintClick}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 border border-gray-100 hover:bg-white hover:shadow-lg transition-all active:scale-90">
                <Fingerprint size={32} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Touch ID</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <ShieldCheck size={16} className="text-green-500" />
            <span>Secure 256-bit SSL encryption</span>
          </div>
          <p className="text-gray-500 text-sm">
            Don't have an account? <button className="font-bold text-blue-600 hover:underline">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
