import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-spartan mb-4">
              FranchiseIntel.ai.
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your intelligent franchise comparison platform. Make informed decisions 
              with comprehensive data and AI-powered insights.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse Franchises</Link></li>
              <li><Link to="/collections" className="hover:text-white transition-colors">My Collections</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Compare Tool</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 FranchiseIntel.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer