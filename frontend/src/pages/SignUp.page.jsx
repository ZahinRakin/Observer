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
    account_type: 'client' // Default to regular client
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));
    
    // Check if passwords match when either password field changes
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
    console.log(`inside handleSubmit method of signup page ${JSON.stringify(formData)}`)  // debugging log
    const response = await axios.post('/api/v1/user/register', formData)
    console.log(response)     // debugging log
    console.log('Sign-up form submitted', formData);
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
          src="/signup_back_img.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center w-full p-4 py-8">
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl w-full">
          
          {/* Image Side */}
          <div className="w-full md:w-2/5 bg-blue-600 hidden md:block">
            <img 
              src="/signup_card_img.jpg" 
              alt="Sign Up" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Form Side */}
          <div className="w-full md:w-3/5 p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
              <p className="text-gray-500 mt-2">Join us today and get access to all features</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - Side by Side */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2 space-y-1">
                  <label htmlFor="fname" className="text-sm font-medium text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    id="fname" 
                    name="fname" 
                    value={formData.fname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                    required 
                  />
                </div>
                
                <div className="w-full sm:w-1/2 space-y-1">
                  <label htmlFor="lname" className="text-sm font-medium text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    id="lname" 
                    name="lname" 
                    value={formData.lname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>
              
              {/* Username Field */}
              <div className="space-y-1">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  required 
                />
              </div>
              
              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  required 
                />
              </div>
              
              {/* Password Fields */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  required 
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${!passwordsMatch ? 'border-red-500' : 'border-gray-300'}`} 
                  required 
                />
                {!passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
              
              {/* Account Type Selection */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Create account as:</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="storeowner" 
                      name="account_type" 
                      value="storeowner"
                      checked={formData.account_type === 'storeowner'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="store-owner" className="ml-2 block text-sm text-gray-700">
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="client" className="ml-2 block text-sm text-gray-700">
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Account
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;