import { useState } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingAnimation from '../components/Loading';
import { useNavigate } from 'react-router-dom';


export default function ErrorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  
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
      navigate('/')
    }, 150);
  };

  if (isLoading){
    return <LoadingAnimation/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Error Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Oops! Something went wrong
          </h1>
          
          {/* Error Message */}
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            We're sorry, but it seems there was an error loading this page. Please try refreshing or return to the homepage.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              onClick={handleGoHome}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Page
            </button>
          </div>

          {/* Additional Help */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-3">
              If this problem persists, please contact our support team.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              <span>•</span>
              <span>Support: support@observerplatform.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}