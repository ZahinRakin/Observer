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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but it seems there was an error loading this page. Please try refreshing or return to the homepage.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoHome}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Page
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
      </p>
    </div>
  );
}