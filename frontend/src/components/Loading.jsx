import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-slate-800 backdrop-blur-lg">
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
}