import React, { useState } from 'react';
import axios from 'axios'
import LoadingAnimation from '../components/Loading';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fname: 'zahin abdullah',
    lname: 'rakin',
    username: 'rakin',
    email: 'zahinabdullahrakin@gmail.com',
    password: 'Rakin123*',
    confirmPassword: 'Rakin123*',
    account_type: 'client'
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));
    
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.confirmPassword);
      } else {
        setPasswordsMatch(formData.password === value);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setIsLoading(true)
    console.log(`inside handleSubmit method of signup page ${JSON.stringify(formData)}`)
    const response = await axios.post('/api/v1/user/register', formData)
    console.log(response)
    console.log('Sign-up form submitted', formData);
    setIsLoading(false)
  };

  if(isLoading){
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

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          
          {/* Left Side - Branding */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Join Our Platform
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Create your account and start exploring our amazing features
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Free account creation</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Multiple account types</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Instant access to features</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="w-full lg:w-3/5 p-6 lg:p-8 bg-gray-800/30">
            <div className="max-w-lg mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Create Account
                </h2>
                <p className="text-gray-400">Fill in your details to get started</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields - Side by Side */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2 space-y-1">
                    <label htmlFor="fname" className="text-sm font-medium text-gray-300">First Name</label>
                    <input 
                      type="text" 
                      id="fname" 
                      name="fname" 
                      value={formData.fname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400" 
                      placeholder="Enter first name"
                      required 
                    />
                  </div>
                  
                  <div className="w-full sm:w-1/2 space-y-1">
                    <label htmlFor="lname" className="text-sm font-medium text-gray-300">Last Name</label>
                    <input 
                      type="text" 
                      id="lname" 
                      name="lname" 
                      value={formData.lname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400" 
                      placeholder="Enter last name"
                      required 
                    />
                  </div>
                </div>
                
                {/* Username Field */}
                <div className="space-y-1">
                  <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400" 
                    placeholder="Choose a username"
                    required 
                  />
                </div>
                
                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400" 
                    placeholder="Enter your email"
                    required 
                  />
                </div>
                
                {/* Password Fields */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400" 
                    placeholder="Create a password"
                    required 
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400 ${!passwordsMatch ? 'border-red-500' : 'border-gray-600'}`} 
                    placeholder="Confirm your password"
                    required 
                  />
                  {!passwordsMatch && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
                
                {/* Account Type Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Create account as:</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="storeowner" 
                        name="account_type" 
                        value="storeowner"
                        checked={formData.account_type === 'storeowner'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700" 
                      />
                      <label htmlFor="storeowner" className="ml-2 block text-sm text-gray-300">
                        Store Owner
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="client" 
                        name="account_type" 
                        value="client"
                        checked={formData.account_type === 'client'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700" 
                      />
                      <label htmlFor="client" className="ml-2 block text-sm text-gray-300">
                        Regular Client
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-400">
                      I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms and Conditions</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg"
                >
                  Create Account
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/signin" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;