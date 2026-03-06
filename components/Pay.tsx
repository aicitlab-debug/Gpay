
import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { Contact, Transaction } from '../types';
import { MOCK_CONTACTS } from '../constants';

interface PayProps {
  onComplete: (tx: Transaction) => void;
  onCancel: () => void;
}

const Pay: React.FC<PayProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'contacts' | 'amount'>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handlePay = () => {
    if (!selectedContact || !amount) return;
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'debit',
      amount: parseFloat(amount),
      merchant: selectedContact.name,
      category: 'Transfer',
      date: new Date().toISOString().split('T')[0],
      icon: '👤'
    };
    
    onComplete(newTx);
  };

  if (step === 'amount' && selectedContact) {
    return (
      <div className="flex flex-col h-full bg-white p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setStep('contacts')} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <span className="font-medium">Paying {selectedContact.name}</span>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-10">
          <div className={`w-20 h-20 rounded-full ${selectedContact.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden`}>
            {selectedContact.avatar ? (
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
            ) : selectedContact.initials}
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-5xl font-bold text-gray-900">
              <span className="text-3xl mt-1">$</span>
              <input 
                autoFocus
                type="number" 
                placeholder="0"
                className="w-40 bg-transparent border-none focus:ring-0 text-center placeholder-gray-200 outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full">
            <input 
              type="text" 
              placeholder="What's this for? (Optional)"
              className="w-full text-center py-2 border-b border-gray-100 focus:border-blue-500 transition-colors outline-none text-gray-600"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-auto pt-10">
          <button 
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={handlePay}
            className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold text-lg google-shadow hover:bg-blue-700 active:scale-95 transition-all mb-4"
          >
            Pay now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 h-full animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pay anyone</h2>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Name, phone number or ID"
          className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Contacts</h3>
          <div className="flex flex-col gap-2">
            {MOCK_CONTACTS.map(contact => (
              <button 
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  setStep('amount');
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${contact.color} flex items-center justify-center text-white font-bold overflow-hidden shadow-sm`}>
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.initials}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{contact.name}</span>
                    <span className="text-xs text-gray-500">{contact.phone}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
