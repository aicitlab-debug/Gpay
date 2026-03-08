
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          onScan(decodedText);
        }).catch(err => {
          console.error("Failed to clear scanner", err);
          onScan(decodedText);
        });
      },
      (errorMessage) => {
        // Silently ignore scan errors (they happen every frame if no QR is found)
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner on unmount", err));
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col h-full bg-black text-white animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
        <span className="font-bold text-lg">Scan QR Code</span>
        <div className="w-10"></div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6">
        <div className="w-full max-w-[300px] aspect-square relative">
          <div id="qr-reader" className="w-full h-full overflow-hidden rounded-3xl border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)]"></div>
          
          {/* Scanning Animation Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
            
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/50 animate-scan-line shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
        </div>
        
        <p className="mt-8 text-gray-400 text-center text-sm px-10">
          Align the QR code within the frame to scan and pay instantly
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            {error}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-10 flex justify-center gap-8">
        <button className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Camera size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Flash</span>
        </button>
        <button className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <RefreshCw size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Gallery</span>
        </button>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        #qr-reader {
          border: none !important;
        }
        #qr-reader__dashboard {
          display: none !important;
        }
        #qr-reader__status_span {
          display: none !important;
        }
        video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
