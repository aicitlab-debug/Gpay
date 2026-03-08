
import React, { useState } from 'react';
import { X, Smartphone, ChevronRight, Check, Lock } from 'lucide-react';
import { Transaction } from '../types';
import { speakMalayalamSuccess, playSuccessSound, playClickSound } from '../services/ttsService';

interface RechargeProps {
  onComplete: (tx: Transaction) => void;
  onCancel: () => void;
}

const OPERATORS = [
  { id: 'voda', name: 'Vodafone', color: 'bg-red-600', icon: '🔴' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500', icon: '⚪' },
  { id: 'jio', name: 'Jio', color: 'bg-blue-600', icon: '🔵' },
  { id: 'bsnl', name: 'BSNL', color: 'bg-orange-500', icon: '🟠' },
];

const PLANS = [
  { id: 'p1', name: 'Unlimited 1.5GB/Day', price: 299, validity: '28 Days' },
  { id: 'p2', name: 'Unlimited 2GB/Day', price: 349, validity: '28 Days' },
  { id: 'p3', name: 'Unlimited 3GB/Day', price: 499, validity: '28 Days' },
  { id: 'p4', name: 'Annual Plan 2GB/Day', price: 2999, validity: '365 Days' },
];

const Recharge: React.FC<RechargeProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'number' | 'operator' | 'plan' | 'pin' | 'success'>('number');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<typeof OPERATORS[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [pin, setPin] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handlePinSubmit = async (pinVal?: string) => {
    const finalPin = pinVal || pin;
    if (finalPin.length < 4) return;
    if (!selectedPlan || !selectedOperator) return;

    setIsTransferring(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'debit',
      amount: selectedPlan.price,
      merchant: `${selectedOperator.name} Recharge`,
      category: `Mobile Recharge (${phoneNumber})`,
      date: new Date().toISOString().split('T')[0],
      icon: '📱'
    };
    
    setIsTransferring(false);
    setStep('success');
    playSuccessSound();
    speakMalayalamSuccess();
    
    setTimeout(() => {
      onComplete(newTx);
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col h-full bg-blue-600 items-center justify-center animate-in fade-in duration-500 md:rounded-[40px]">
        <div className="flex flex-col items-center gap-8">
          <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center text-white animate-in zoom-in-50 duration-500 delay-200 shadow-2xl">
            <Check size={56} strokeWidth={3} />
          </div>
          <div className="text-center text-white animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-3xl font-bold">Recharge Successful</h2>
            <p className="text-lg opacity-80 mt-2 font-medium">Recharged ${selectedPlan?.price} for {phoneNumber}</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pin') {
    return (
      <div className="flex flex-col h-full bg-blue-600 p-6 md:p-12 animate-in slide-in-from-right duration-300 text-white md:rounded-[40px]">
        <div className="flex items-center justify-center mb-8">
          <span className="font-bold text-lg">Security Verification</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white shadow-xl backdrop-blur-md border border-white/20">
              <Lock size={40} />
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Enter Payment PIN</h3>
              <p className="text-white/70 font-medium">Confirming recharge of <span className="font-bold text-white">${selectedPlan?.price}</span> for {phoneNumber}</p>
            </div>

            <div className="w-full flex flex-col items-center gap-8">
              <div className="flex gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${pin.length > i ? 'bg-white border-white scale-125' : 'border-white/30'}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (isTransferring) return;
                      playClickSound();
                      if (num === 'del') {
                        setPin(prev => prev.slice(0, -1));
                      } else if (typeof num === 'number') {
                        const nextPin = pin.length < 4 ? pin + num : pin;
                        setPin(nextPin);
                        if (nextPin.length === 4) {
                          handlePinSubmit(nextPin);
                        }
                      }
                    }}
                    className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all active:scale-90 active:bg-white/10 ${num === '' ? 'pointer-events-none' : 'hover:bg-white/5'}`}
                  >
                    {num === 'del' ? '←' : num}
                  </button>
                ))}
              </div>

              {isTransferring && (
                <div className="mt-8 flex items-center gap-3 text-white/80 animate-pulse bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-bold">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 md:p-10 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <span className="font-bold text-lg">Mobile Recharge</span>
        <div className="w-10"></div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {step === 'number' && (
          <div className="flex flex-col gap-10 mt-4">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Enter Mobile Number</label>
              <div className="relative">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input 
                  autoFocus
                  type="tel"
                  placeholder="e.g. 9876543210"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[24px] py-5 pl-14 pr-6 text-2xl font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all shadow-sm"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>
            <button 
              disabled={phoneNumber.length < 10}
              onClick={() => setStep('operator')}
              className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'operator' && (
          <div className="flex flex-col gap-8 mt-4 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-gray-900">Select Operator</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {OPERATORS.map(op => (
                <button 
                  key={op.id}
                  onClick={() => {
                    setSelectedOperator(op);
                    setStep('plan');
                  }}
                  className="flex flex-col items-center gap-4 p-6 rounded-[32px] border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                  <div className={`w-16 h-16 rounded-2xl ${op.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {op.icon}
                  </div>
                  <span className="font-bold text-gray-800">{op.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'plan' && (
          <div className="flex flex-col gap-8 mt-4 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Select Plan</h3>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                <span className="text-sm font-bold text-blue-600">{selectedOperator?.name}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLANS.map(plan => (
                <button 
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setStep('pin');
                  }}
                  className="flex items-center justify-between p-6 rounded-[32px] border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all active:scale-95 group shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg text-gray-900">{plan.name}</span>
                    <span className="text-sm text-gray-500 font-medium">Validity: {plan.validity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-600">${plan.price}</span>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharge;
