import { QRCode } from 'react-qrcode-logo';
import { useState } from 'react';

export default function QrCode({ url }: { url: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <span>Show QR Code</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-1">
          <QRCode
            value={url} 
            size={200}
            bgColor="white"
            fgColor="black"
            logoImage="/images/logo.png"
            logoWidth={50}
            logoHeight={50}
          />
        </div>
      )}
    </div>
  );
}