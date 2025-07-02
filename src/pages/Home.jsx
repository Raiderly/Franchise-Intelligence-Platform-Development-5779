import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFranchises } from '../hooks/useFranchises'
import FranchiseCard from '../components/ui/FranchiseCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ConnectionTest from '../components/ui/ConnectionTest'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiTrendingUp, FiUsers, FiDatabase, FiArrowRight } = FiIcons

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { franchises, loading } = useFranchises('', '', 'name')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const featuredFranchises = franchises.slice(0, 6)

  const stats = [
    { icon: FiDatabase, label: 'Franchise Brands', value: '500+' },
    { icon: FiTrendingUp, label: 'Industry Sectors', value: '15+' },
    { icon: FiUsers, label: 'Active Users', value: '10K+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Development Connection Test - Remove in production */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConnectionTest />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-spartan">
              Intelligent Franchise <br />
              <span className="text-accent-teal">Discovery</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Compare franchises, analyze opportunities, and make informed decisions with AI-powered insights and comprehensive data.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for franchises (e.g., McDonald's, fitness, food service...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-accent-teal/20 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <SafeIcon icon={stat.icon} className="w-8 h-8 text-accent-teal mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-200 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Franchises */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-spartan">
              Featured Franchises
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore top-performing franchise opportunities across various industries
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {featuredFranchises.map((franchise) => (
                <FranchiseCard
                  key={franchise.id}
                  franchise={franchise}
                  showAddButton={false}
                />
              ))}
            </motion.div>
          )}

          <div className="text-center">
            <Link
              to="/browse"
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              <span>View All Franchises</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-spartan">
              Why Choose FranchiseIntel.ai?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiDatabase} className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Data</h3>
              <p className="text-gray-600">
                Access detailed information on hundreds of franchise opportunities with up-to-date financial and operational data.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6"
            >
              <div className="bg-accent-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-accent-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Comparisons</h3>
              <p className="text-gray-600">
                Compare multiple franchises side-by-side with intelligent highlighting of key differences and advantages.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6"
            >
              <div className="bg-accent-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUsers} className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and industry insights powered by advanced AI technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home