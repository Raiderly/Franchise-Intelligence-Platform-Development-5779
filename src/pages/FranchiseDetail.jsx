import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFranchise } from '../hooks/useFranchises'
import { useCollections } from '../hooks/useCollections'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiExternalLink, FiDollarSign, FiTrendingUp, FiMapPin, FiUsers, FiCalendar, FiPlus, FiArrowLeft } = FiIcons

const FranchiseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { franchise, loading, error } = useFranchise(id)
  const { collections, addToCollection } = useCollections()
  const [showCollectionModal, setShowCollectionModal] = React.useState(false)

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

  const handleAddToCollection = (collectionId) => {
    if (!franchise) return

    addToCollection(collectionId, franchise.id).then(({ error }) => {
      if (error) {
        toast.error('Failed to add franchise to collection')
      } else {
        toast.success('Franchise added to collection!')
      }
      setShowCollectionModal(false)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !franchise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Franchise Not Found</h2>
          <p className="text-gray-600 mb-4">The franchise you're looking for doesn't exist.</p>
          <Link
            to="/browse"
            className="text-primary hover:text-secondary font-medium"
          >
            Browse All Franchises
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/browse"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {franchise.logo_url && (
                    <img
                      src={franchise.logo_url}
                      alt={`${franchise.name} logo`}
                      className="w-16 h-16 rounded-xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-spartan">
                      {franchise.name}
                    </h1>
                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mt-2">
                      {franchise.sector}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {user && (
                    <button
                      onClick={() => setShowCollectionModal(true)}
                      className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  )}
                  
                  {franchise.website && (
                    <a
                      href={franchise.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>Visit Website</span>
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {franchise.description}
              </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-spartan">
                Key Financial Metrics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-accent-gold/10 p-3 rounded-lg">
                    <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-accent-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Initial Investment Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatStartupCostRange(franchise.startup_cost_min, franchise.startup_cost_max)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-accent-teal/10 p-3 rounded-lg">
                    <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-accent-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Profit Margin</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPercentage(franchise.net_profit_margin)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-spartan">
                About This Franchise
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p>
                  {franchise.name} operates in the {franchise.sector.toLowerCase()} sector, 
                  offering franchise opportunities with an initial investment of{' '}
                  {formatStartupCostRange(franchise.startup_cost_min, franchise.startup_cost_max)}.
                </p>
                
                {franchise.net_profit_margin && (
                  <p>
                    With a reported net profit margin of {formatPercentage(franchise.net_profit_margin)}, 
                    this franchise presents a potentially attractive investment opportunity for qualified candidates.
                  </p>
                )}
                
                <p>
                  For detailed franchise information, financial performance data, and territory availability, 
                  we recommend contacting the franchisor directly through their official website.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {user ? (
                  <button
                    onClick={() => setShowCollectionModal(true)}
                    className="w-full flex items-center space-x-2 text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 text-primary" />
                    <span>Add to Collection</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center space-x-2 text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-primary" />
                    <span>Sign In to Save</span>
                  </Link>
                )}
                
                {franchise.website && (
                  <a
                    href={franchise.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-2 text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-primary" />
                    <span>Visit Official Website</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Franchise Summary */}
            {franchise.summary_pdf_url && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Franchise Documents
                </h3>
                
                <a
                  href={franchise.summary_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
                >
                  <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  <span>View Franchise Summary</span>
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">
              Add "{franchise.name}" to Collection
            </h3>
            
            <div className="space-y-2 mb-6">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleAddToCollection(collection.id)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="font-medium">{collection.name}</div>
                  <div className="text-sm text-gray-600">{collection.description}</div>
                </button>
              ))}
            </div>

            {collections.length === 0 && (
              <p className="text-gray-600 text-center mb-6">
                No collections found. Create a collection first to save franchises.
              </p>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FranchiseDetail