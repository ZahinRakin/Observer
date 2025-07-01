import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import LoadingAnimation from '../components/Loading';
import { UserContext } from '../contexts/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false); // Add this line
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignIn = async (event) => {
    setIsLoading(true)
    event.preventDefault();
    try {
      const response = await axios.post('/api/v1/user/login', formData)
      const user = response?.data?.user;
      const accountType = user?.account_type;
      setUser(user); // Set user info in context
      if (accountType === 'admin') {
        navigate('/admin-dashboard');
      } else if (accountType === 'client') {
        navigate('/customer-dashboard');
      } else if (accountType === 'storeowner') {
        navigate('/store-owner-dashboard');
      } else {
        alert('Unknown account type');
      }
    } catch (error) {
      alert('Login failed');
    }
    setIsLoading(false)
  };


  if(isLoading){
    return <LoadingAnimation/>
  }
  
  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/signin_back_img.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center w-full p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 bg-blue-600 hidden md:block">
            <img 
              src="/signin_card_img.jpg" 
              alt="Sign In" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Form Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Please sign in to your account</p>
            </div>
            
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="rememberMe" 
                    name="rememberMe" 
                    type="checkbox" 
                    value={true}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to='/signup' className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage
