import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click the "Sign Up" button on the homepage. Fill in your details including username, email, and password. Choose your account type (Customer, Store Owner, or Admin) and follow the verification process.'
        },
        {
          question: 'What are the different account types?',
          answer: 'We offer three account types: Customer (browse and purchase products), Store Owner (manage stores and products), and Admin (system administration and oversight). Each type has different permissions and features.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'If you forgot your password, click "Forgot Password" on the sign-in page. Enter your email address and follow the instructions sent to your email to reset your password securely.'
        }
      ]
    },
    {
      category: 'Store Management',
      questions: [
        {
          question: 'How do I create a store?',
          answer: 'As a Store Owner, navigate to the Store Management section in your dashboard. Click "Create New Store" and fill in the required information including store name, description, location, and contact details.'
        },
        {
          question: 'How do I add products to my store?',
          answer: 'In your store dashboard, go to the Products section and click "Add Product". Fill in the product details including name, description, category, tags, and upload product images. You can also set pricing and inventory levels.'
        },
        {
          question: 'How do I manage my store settings?',
          answer: 'Access your store settings through the Store Management dashboard. You can update store information, manage business hours, set up payment methods, and configure notification preferences.'
        }
      ]
    },
    {
      category: 'Shopping & Orders',
      questions: [
        {
          question: 'How do I browse and search for products?',
          answer: 'Use the search bar on the homepage or browse by categories. You can filter products by price, location, store, and other criteria. Use tags to find specific product types.'
        },
        {
          question: 'How do I place an order?',
          answer: 'Select products you want to purchase, add them to your cart, and proceed to checkout. Review your order, enter shipping and payment information, and confirm your purchase.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit cards, debit cards, and digital payment methods. Payment processing is secure and encrypted. Store owners can configure their preferred payment methods.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your profile page from the dashboard. Click "Edit Profile" to update your personal information, contact details, and preferences. Changes are saved automatically.'
        },
        {
          question: 'How secure is my account?',
          answer: 'We use industry-standard encryption and security measures to protect your data. Passwords are hashed, and we offer two-factor authentication for additional security.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, contact our support team. Please note that account deletion is permanent and will remove all your data, including stores and products if you are a store owner.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'The website is not loading properly',
          answer: 'Try refreshing the page or clearing your browser cache. Ensure you have a stable internet connection. If the problem persists, try using a different browser or contact support.'
        },
        {
          question: 'I can\'t upload images',
          answer: 'Ensure your images are in supported formats (JPG, PNG, GIF) and under 5MB. Check your internet connection and try again. If issues persist, contact our technical support.'
        },
        {
          question: 'I\'m experiencing slow performance',
          answer: 'Slow performance can be due to internet connection, browser issues, or high server load. Try refreshing the page, clearing cache, or accessing the site during off-peak hours.'
        }
      ]
    }
  ];

  const contactInfo = {
    email: 'support@observerplatform.com',
    phone: '+1 (555) 123-4567',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
    address: '123 Business Street, Tech City, TC 12345'
  };

  const quickLinks = [
    { title: 'Privacy Policy', url: '/privacy' },
    { title: 'Terms of Service', url: '/terms' },
    { title: 'Return Policy', url: '/returns' },
    { title: 'Shipping Information', url: '/shipping' }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleFaqToggle = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Help & Support Center
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Find answers to your questions, get help with your account, and learn how to make the most of our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              />
              <div className="absolute left-4 top-3.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'contact', label: 'Contact Us', icon: '📞' },
            { id: 'guides', label: 'User Guides', icon: '📚' },
            { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              
              {searchTerm && (
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    Showing results for: <span className="font-semibold">"{searchTerm}"</span>
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border border-gray-600/30 rounded-lg overflow-hidden">
                    <div className="bg-gray-700/30 px-6 py-4">
                      <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                    </div>
                    <div className="divide-y divide-gray-600/30">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = `${categoryIndex}-${faqIndex}`;
                        const isExpanded = expandedFaq === globalIndex;
                        
                        return (
                          <div key={faqIndex} className="bg-gray-800/30">
                            <button
                              onClick={() => handleFaqToggle(globalIndex)}
                              className="w-full px-6 py-4 text-left hover:bg-gray-700/30 transition-colors duration-200 flex items-center justify-between"
                            >
                              <span className="text-gray-200 font-medium">{faq.question}</span>
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {isExpanded && (
                              <div className="px-6 pb-4">
                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No results found</h3>
                  <p className="text-gray-400">Try searching with different keywords or browse our categories above.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email Support</h3>
                      <p className="text-gray-300">{contactInfo.email}</p>
                      <p className="text-gray-400 text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Phone Support</h3>
                      <p className="text-gray-300">{contactInfo.phone}</p>
                      <p className="text-gray-400 text-sm">{contactInfo.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Office Address</h3>
                      <p className="text-gray-300">{contactInfo.address}</p>
                      <p className="text-gray-400 text-sm">For in-person support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <select className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white">
                      <option value="">Select a topic</option>
                      <option value="account">Account Issues</option>
                      <option value="technical">Technical Problems</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Describe your issue or question..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* User Guides Section */}
          {activeTab === 'guides' && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">User Guides</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Customer Guide */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Customer Guide</h3>
                  <p className="text-gray-300 text-sm mb-4">Learn how to browse products, place orders, and manage your account.</p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Creating and managing your account</li>
                    <li>• Browsing and searching products</li>
                    <li>• Placing orders and payments</li>
                    <li>• Tracking your orders</li>
                  </ul>
                </div>

                {/* Store Owner Guide */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Store Owner Guide</h3>
                  <p className="text-gray-300 text-sm mb-4">Everything you need to know about managing your store and products.</p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Setting up your store</li>
                    <li>• Adding and managing products</li>
                    <li>• Processing orders</li>
                    <li>• Analytics and reporting</li>
                  </ul>
                </div>

                {/* Admin Guide */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Admin Guide</h3>
                  <p className="text-gray-300 text-sm mb-4">Administrative tools and system management features.</p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• User management</li>
                    <li>• System settings</li>
                    <li>• Analytics and reports</li>
                    <li>• Security and monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          {activeTab === 'troubleshooting' && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Troubleshooting</h2>
              
              <div className="space-y-6">
                {/* Common Issues */}
                <div className="border border-gray-600/30 rounded-lg overflow-hidden">
                  <div className="bg-gray-700/30 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Common Issues & Solutions</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="text-white font-medium mb-2">Can't log in to your account?</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Check if Caps Lock is on</li>
                        <li>• Verify your email address is correct</li>
                        <li>• Try the "Forgot Password" option</li>
                        <li>• Clear your browser cache and cookies</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="text-white font-medium mb-2">Website not loading properly?</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Check your internet connection</li>
                        <li>• Try refreshing the page</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Try a different browser</li>
                        <li>• Disable browser extensions temporarily</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-white font-medium mb-2">Payment issues?</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Verify your payment information</li>
                        <li>• Check if your card is not expired</li>
                        <li>• Ensure sufficient funds are available</li>
                        <li>• Contact your bank if the issue persists</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Browser Compatibility */}
                <div className="border border-gray-600/30 rounded-lg overflow-hidden">
                  <div className="bg-gray-700/30 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Browser Compatibility</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 mb-4">Our platform works best with the following browsers:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Chrome', version: '90+', icon: '🌐' },
                        { name: 'Firefox', version: '88+', icon: '🦊' },
                        { name: 'Safari', version: '14+', icon: '🍎' },
                        { name: 'Edge', version: '90+', icon: '🌐' }
                      ].map((browser, index) => (
                        <div key={index} className="text-center p-3 bg-gray-700/30 rounded-lg">
                          <div className="text-2xl mb-2">{browser.icon}</div>
                          <div className="text-white font-medium">{browser.name}</div>
                          <div className="text-gray-400 text-sm">{browser.version}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="p-3 bg-gray-700/30 rounded-lg text-center hover:bg-gray-700/50 transition-colors duration-200"
              >
                <span className="text-gray-300 hover:text-white">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 