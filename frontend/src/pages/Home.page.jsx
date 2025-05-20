import { useState } from 'react';
import { Bell, Store, ShoppingBag, ArrowRight, Mail, MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom'

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-600">Observer</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
              <Link to='/signin' className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Sign In
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-blue-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">How It Works</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Pricing</a>
              <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Connect with</span>
                <span className="block text-yellow-300">your customers</span>
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Keep your customers informed about your latest offers and products with Observer's powerful notification system.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium shadow-md hover:bg-gray-100 transition-colors">
                  For Store Owners
                </button>
                <button className="bg-yellow-300 text-blue-900 px-6 py-3 rounded-md font-medium shadow-md hover:bg-yellow-400 transition-colors">
                  For Customers
                </button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <img 
                src="/goats.jpg" 
                alt="Observer platform preview" 
                className="rounded-lg shadow-xl w-[400px] h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Observer?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Store Owners</h3>
              <p className="text-gray-600">
                Easily create and send targeted notifications about new products, special offers, and store updates to your customer base.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Customers</h3>
              <p className="text-gray-600">
                Stay informed about products you care about. Receive timely updates from your favorite stores without email clutter.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Notifications</h3>
              <p className="text-gray-600">
                Our AI-powered system ensures that notifications are relevant, timely, and personalized to each customer's preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-lg shadow flex-1 relative">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Store</h3>
              <p className="text-gray-600 text-sm">
                Create a Virtual Instance of Your Real Store.
              </p>
              <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-5 rounded-lg shadow flex-1 relative">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Product</h3>
              <p className="text-gray-600 text-sm">
                Create Products That Your Customers Might Be Interested In.
              </p>
              <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-5 rounded-lg shadow flex-1 relative">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Updates</h3>
              <p className="text-gray-600 text-sm">
                Design Targeted Notifications About Products, Offers, Or News.
              </p>
              <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white p-5 rounded-lg shadow flex-1">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Reach Customers</h3>
              <p className="text-gray-600 text-sm">
                News About Products Will Reach Interested Customers Automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform how you connect with customers?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Observer to boost engagement and sales.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to='/signup' className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium shadow-md hover:bg-gray-100 transition-colors">
              Sign Up Now
            </Link>
            <button className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium shadow-md hover:bg-blue-700 transition-colors">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bell className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">Observer</span>
              </div>
              <p className="text-gray-400">
                Connecting stores with customers through smart, targeted notifications.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 mr-2 text-blue-400" />
                <a href="mailto:hello@observer.com" className="hover:text-white transition-colors">hello@observer.com</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Observer. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}