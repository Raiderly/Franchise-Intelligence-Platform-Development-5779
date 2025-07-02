import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiExternalLink, FiDollarSign, FiTrendingUp, FiPlus } = FiIcons

const FranchiseCard = ({ franchise, onAddToCollection, showAddButton = true }) => {
  const formatCurrency = (amount) => {
    if (!amount) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatStartupCostRange = (min, max) => {
    const formattedMin = formatCurrency(min)
    const formattedMax = formatCurrency(max)
    
    if (!formattedMin && !formattedMax) {
      return 'N/A'
    }
    
    if (!formattedMin) {
      return `Up to ${formattedMax}`
    }
    
    if (!formattedMax) {
      return `From ${formattedMin}`
    }
    
    return `${formattedMin} - ${formattedMax}`
  }

  const formatPercentage = (value) => {
    if (!value) return 'N/A'
    return `${value}%`
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-neutral-light hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {franchise.logo_url && (
              <img
                src={franchise.logo_url}
                alt={`${franchise.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-spartan">
                {franchise.name}
              </h3>
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                {franchise.sector}
              </span>
            </div>
          </div>
          
          {showAddButton && onAddToCollection && (
            <button
              onClick={() => onAddToCollection(franchise)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="Add to collection"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {franchise.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-accent-gold" />
            <div>
              <p className="text-xs text-gray-500">Startup Cost</p>
              <p className="text-sm font-medium">
                {formatStartupCostRange(franchise.startup_cost_min, franchise.startup_cost_max)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-accent-teal" />
            <div>
              <p className="text-xs text-gray-500">Profit Margin</p>
              <p className="text-sm font-medium">
                {formatPercentage(franchise.net_profit_margin)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/franchise/${franchise.id}`}
            className="text-primary hover:text-secondary font-medium text-sm transition-colors"
          >
            View Details
          </Link>
          
          {franchise.website && (
            <a
              href={franchise.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-500 hover:text-primary text-sm transition-colors"
            >
              <span>Website</span>
              <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FranchiseCard