import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Simple spinner */}
      <div className="relative w-20 h-20">
        {/* Spinner ring */}
        <div className="absolute w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin" />
        
        {/* Secondary spinner ring */}
        <div className="absolute w-16 h-16 top-2 left-2 rounded-full border-4 border-t-transparent border-r-teal-400 border-b-transparent border-l-indigo-400 animate-spin" style={{ animationDuration: '0.2s', animationDirection: 'reverse' }} />
        
        {/* Inner circle with pulsing effect */}
        <div className="absolute w-8 h-8 top-6 left-6 bg-white/50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}