import { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw, Home, Mail, MessageCircle, Zap, Shield, Wifi, WifiOff } from 'lucide-react';
import LoadingAnimation from '../components/Loading';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState('404');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  
  // Generate a random error code for demo purposes
  useEffect(() => {
    const errorCodes = ['404', '500', '503', '403', '502'];
    setErrorCode(errorCodes[Math.floor(Math.random() * errorCodes.length)]);
    
    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  const handleGoHome = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 150);
  };

  const handleContactSupport = () => {
    window.open('mailto:support@observerplatform.com?subject=Error Report', '_blank');
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-red-500/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Error Code Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-600 bg-clip-text text-transparent opacity-20 animate-pulse">
                {errorCode}
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <AlertTriangle className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Error Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-300 text-xl md:text-2xl mb-6 leading-relaxed max-w-2xl mx-auto">
                We're sorry, but it seems there was an error loading this page. 
                Don't worry, we're here to help you get back on track.
              </p>

              {/* Status Indicators */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isOnline ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={handleGoHome}
                disabled={isLoading}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-600 rounded-xl text-gray-200 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105"
              >
                <Home className="h-5 w-5 group-hover:animate-pulse" />
                <span className="font-semibold">Back to Home</span>
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg transform hover:scale-105"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : 'group-hover:animate-spin'}`} />
                <span className="font-semibold">Refresh Page</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={handleContactSupport}
                className="group flex items-center justify-center gap-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
              >
                <Mail className="h-5 w-5 group-hover:animate-bounce" />
                <span className="font-medium">Contact Support</span>
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="group flex items-center justify-center gap-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
              >
                <Zap className="h-5 w-5 group-hover:animate-pulse" />
                <span className="font-medium">Error Details</span>
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="group flex items-center justify-center gap-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 group-hover:animate-pulse" />
                <span className="font-medium">Go Back</span>
              </button>
            </div>

            {/* Error Details (Collapsible) */}
            {showDetails && (
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Error Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Error Code:</p>
                    <p className="text-gray-200 font-mono bg-gray-800/50 px-3 py-1 rounded">{errorCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Error ID:</p>
                    <p className="text-gray-200 font-mono bg-gray-800/50 px-3 py-1 rounded">
                      {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Timestamp:</p>
                    <p className="text-gray-200 font-mono bg-gray-800/50 px-3 py-1 rounded">
                      {new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">User Agent:</p>
                    <p className="text-gray-200 font-mono bg-gray-800/50 px-3 py-1 rounded text-xs">
                      {navigator.userAgent.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Need Additional Help?</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Our support team is available 24/7 to help you resolve any issues. 
                Don't hesitate to reach out if you need assistance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@observerplatform.com
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Response time: &lt; 2 hours</span>
                <span className="hidden sm:inline">•</span>
                <span>Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}