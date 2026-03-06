
import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  isProcessing?: boolean;
}

const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children, isProcessing }) => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto my-8">
      {/* Outer Chassis - Natural Titanium look */}
      <div className="relative mx-auto w-[390px] h-[844px] bg-[#1c1c1e] rounded-[55px] border-[8px] border-[#3a3a3c] shadow-[0_0_0_2px_#2c2c2e,0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Screen Content Container */}
        <div className="relative w-full h-full bg-white overflow-hidden rounded-[47px] flex flex-col">
          
          {/* Status Bar */}
          <div className="h-12 w-full flex items-center justify-between px-8 z-50 pointer-events-none select-none">
            <div className="text-[15px] font-bold text-black w-20">{time}</div>
            
            {/* Dynamic Island */}
            <div className={`h-7 bg-black rounded-full transition-all duration-500 ease-in-out flex items-center justify-center gap-2 px-3 ${isProcessing ? 'w-40' : 'w-28'}`}>
              {isProcessing && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                </div>
              )}
              {!isProcessing && <div className="w-2 h-2 rounded-full bg-green-500/20 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>}
            </div>

            <div className="flex items-center gap-1.5 w-20 justify-end">
              <Signal size={14} strokeWidth={3} />
              <Wifi size={14} strokeWidth={3} />
              <div className="relative flex items-center">
                 <Battery size={20} strokeWidth={2.5} />
                 <div className="absolute left-[2px] top-1.5 h-1.5 w-2.5 bg-black rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Actual App Content */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
        </div>

        {/* Physical Buttons */}
        <div className="absolute left-[-10px] top-[120px] w-1.5 h-12 bg-[#3a3a3c] rounded-r-md"></div> {/* Action Button */}
        <div className="absolute left-[-10px] top-[180px] w-1.5 h-16 bg-[#3a3a3c] rounded-r-md"></div> {/* Vol Up */}
        <div className="absolute left-[-10px] top-[255px] w-1.5 h-16 bg-[#3a3a3c] rounded-r-md"></div> {/* Vol Down */}
        <div className="absolute right-[-10px] top-[200px] w-1.5 h-24 bg-[#3a3a3c] rounded-l-md"></div> {/* Side Button */}
      </div>
    </div>
  );
};

export default IPhoneFrame;
