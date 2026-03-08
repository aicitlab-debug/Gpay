
import React, { useState } from 'react';
import { X, Search, ChevronRight, User, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Contact, Transaction } from '../types';
import { MOCK_CONTACTS } from '../constants';
import { speakMalayalamSuccess, playSuccessSound, playClickSound } from '../services/ttsService';

interface PayProps {
  onComplete: (tx: Transaction) => void;
  onCancel: () => void;
  initialContact?: Contact | null;
}

const Pay: React.FC<PayProps> = ({ onComplete, onCancel, initialContact }) => {
  const [step, setStep] = useState<'contacts' | 'amount' | 'manual' | 'pin' | 'cash-sent-number' | 'success'>('contacts');
  const [manualType, setManualType] = useState<'name' | 'phone'>('name');
  const [manualValue, setManualValue] = useState('');
  const [cashSentNumber, setCashSentNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(initialContact || null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [collectionPin, setCollectionPin] = useState('');
  const [isMasked, setIsMasked] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualValue) return;

    const tempContact: Contact = {
      id: 'manual-' + Math.random().toString(36).substr(2, 5),
      name: manualType === 'name' ? manualValue : 'User ' + manualValue.slice(-4),
      phone: manualType === 'phone' ? manualValue : 'Manual Entry',
      avatar: '',
      initials: manualValue.substring(0, 2).toUpperCase(),
      color: manualType === 'name' ? 'bg-blue-600' : 'bg-green-600'
    };

    setSelectedContact(tempContact);
    setStep('amount');
  };

  const handlePinSubmit = async (pinVal?: string) => {
    const finalPin = pinVal || pin;
    if (finalPin.length < 4) return;
    
    if (!selectedContact || !amount) return;

    setIsTransferring(true);
    
    // Simulate network delay for "transferring"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'debit',
      amount: parseFloat(amount),
      merchant: selectedContact.name,
      category: cashSentNumber ? `Cash Sent to ${cashSentNumber}` : (manualValue ? `Sent via ${manualType === 'name' ? 'Name' : 'Number'}` : 'Transfer'),
      date: new Date().toISOString().split('T')[0],
      icon: '👤'
    };
    
    setIsTransferring(false);
    setStep('success');
    playSuccessSound();
    speakMalayalamSuccess();
    
    // Show success screen for 2 seconds before completing
    setTimeout(() => {
      onComplete(newTx);
    }, 2000);
  };

  const handlePay = () => {
    if (!selectedContact || !amount) return;
    setStep('pin');
  };

  if (step === 'cash-sent-number') {
    return (
      <div className="flex flex-col h-full bg-white p-6 md:p-12 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
          <button onClick={() => setStep('contacts')} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <span className="font-bold text-lg">Cash Sent</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
              <Phone size={40} />
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Recipient Number</h3>
              <p className="text-sm text-gray-500 font-medium">Enter the 10-digit mobile number</p>
            </div>

            <div className="w-full flex flex-col items-center gap-8">
              <div className="flex gap-2 min-h-[40px] items-center">
                {cashSentNumber.split('').map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-green-600 animate-in zoom-in duration-200" />
                ))}
                {cashSentNumber.length === 0 && <span className="text-gray-300 text-sm font-medium">Enter 10-digit number</span>}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (num === 'del') {
                        setCashSentNumber(prev => prev.slice(0, -1));
                      } else if (typeof num === 'number') {
                        setCashSentNumber(prev => (prev.length < 10 ? prev + num : prev));
                      }
                    }}
                    className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all active:scale-90 active:bg-gray-100 ${num === '' ? 'pointer-events-none' : 'hover:bg-gray-50 text-gray-800'}`}
                  >
                    {num === 'del' ? '←' : num}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const tempContact: Contact = {
                    id: 'cash-sent-' + Math.random().toString(36).substr(2, 5),
                    name: 'User ' + cashSentNumber.slice(-4),
                    phone: cashSentNumber,
                    avatar: '',
                    initials: 'CS',
                    color: 'bg-green-600'
                  };
                  setSelectedContact(tempContact);
                  setStep('amount');
                }}
                disabled={cashSentNumber.length < 10}
                className="w-full bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/20 transition-all active:scale-95 mt-4"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col h-full bg-blue-600 items-center justify-center animate-in fade-in duration-500 md:rounded-[40px]">
        <div className="flex flex-col items-center gap-8">
          <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center text-white animate-in zoom-in-50 duration-500 delay-200 shadow-2xl">
            <Check size={56} strokeWidth={3} />
          </div>
          <div className="text-center text-white animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-3xl font-bold">Payment Successful</h2>
            <p className="text-lg opacity-80 mt-2 font-medium">Sent ${amount} to {selectedContact?.name}</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pin' && selectedContact) {
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
              <p className="text-white/70 font-medium">Confirming payment of <span className="font-bold text-white">${amount}</span> to {selectedContact.name}</p>
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

              <input 
                autoFocus
                type="password"
                maxLength={4}
                pattern="\d*"
                inputMode="numeric"
                className="opacity-0 absolute h-0 w-0"
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPin(val);
                  if (val.length === 4) {
                    handlePinSubmit(val);
                  }
                }}
              />

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
                <div className="mt-8 flex items-center gap-3 text-white/90 animate-pulse bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-bold">Transferring...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'manual') {
    return (
      <div className="flex flex-col h-full bg-white p-6 md:p-12 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
          <button onClick={() => setStep('contacts')} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <span className="font-bold text-lg">Pay by {manualType === 'name' ? 'Name' : 'Phone Number'}</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Enter {manualType === 'name' ? 'Full Name' : 'Phone Number'}
              </label>
              <div className="relative">
                <input 
                  autoFocus
                  type={manualType === 'name' ? 'text' : (isMasked ? 'password' : 'tel')}
                  placeholder={manualType === 'name' ? 'e.g. John Doe' : 'e.g. +1 234 567 890'}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[24px] py-5 px-6 text-xl font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all pr-14 shadow-sm"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                />
                {manualType === 'phone' && (
                  <button 
                    type="button"
                    onClick={() => setIsMasked(!isMasked)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                  >
                    {isMasked ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                )}
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={!manualValue}
              className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'amount' && selectedContact) {
    return (
      <div className="flex flex-col h-full bg-white p-6 md:p-12 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
          <button onClick={() => setStep('contacts')} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <span className="font-bold text-lg">Paying {selectedContact.name}</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="flex flex-col items-center gap-8 w-full">
            <div className={`w-24 h-24 rounded-[32px] ${selectedContact.color} flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden border-4 border-white`}>
              {selectedContact.avatar ? (
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
              ) : selectedContact.initials}
            </div>
            
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center text-6xl md:text-7xl font-bold text-gray-900">
                <span className="text-4xl mt-2 mr-1 text-gray-400">$</span>
                <input 
                  autoFocus
                  type="number" 
                  placeholder="0"
                  className="w-full bg-transparent border-none focus:ring-0 text-center placeholder-gray-100 outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full max-w-xs">
              <input 
                type="text" 
                placeholder="What's this for? (Optional)"
                className="w-full text-center py-3 border-b-2 border-gray-100 focus:border-blue-500 transition-colors outline-none text-gray-600 font-medium text-lg"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button 
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={handlePay}
              className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all mt-8"
            >
              Pay now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 md:p-10 h-full animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Pay anyone</h2>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 md:hidden">
          <X size={24} />
        </button>
      </div>

      <div className="relative mb-10 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input 
          type="text" 
          placeholder="Name, phone number or ID"
          className="w-full bg-gray-100 border-none rounded-[20px] py-4 pl-12 pr-6 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl">
        <button 
          onClick={() => {
            setManualType('name');
            setManualValue('');
            setStep('manual');
          }}
          className="flex items-center gap-5 p-6 bg-blue-50 rounded-[32px] border border-blue-100 hover:bg-blue-100 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-active:scale-90 transition-transform">
            <User size={28} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-blue-900">Pay by Name</span>
            <span className="text-xs text-blue-700 font-medium opacity-70">Enter name manually</span>
          </div>
        </button>
        <button 
          onClick={() => {
            setCashSentNumber('');
            setStep('cash-sent-number');
          }}
          className="flex items-center gap-5 p-6 bg-green-50 rounded-[32px] border border-green-100 hover:bg-green-100 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200 group-active:scale-90 transition-transform">
            <Phone size={28} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-green-900">Cash Sent</span>
            <span className="text-xs text-green-700 font-medium opacity-70">Send to mobile number</span>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">Recent Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_CONTACTS.map(contact => (
              <button 
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  setStep('amount');
                }}
                className="flex items-center justify-between p-4 rounded-[24px] bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${contact.color} flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-sm border-2 border-white`}>
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.initials}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{contact.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{contact.phone}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
