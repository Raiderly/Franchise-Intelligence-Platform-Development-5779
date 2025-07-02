import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFranchises } from '../hooks/useFranchises'
import { useCollections } from '../hooks/useCollections'
import { useAuth } from '../contexts/AuthContext'
import FranchiseCard from '../components/ui/FranchiseCard'
import SearchFilters from '../components/ui/SearchFilters'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Browse = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sector, setSector] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState(null)

  const { franchises, loading, error } = useFranchises(searchTerm, sector, sortBy)
  const { collections, addToCollection } = useCollections()

  const handleAddToCollection = (franchise) => {
    if (!user) {
      toast.error('Please sign in to save franchises to collections')
      return
    }
    setSelectedFranchise(franchise)
    setShowCollectionModal(true)
  }

  const handleConfirmAddToCollection = async (collectionId) => {
    if (!selectedFranchise) return

    const { error } = await addToCollection(collectionId, selectedFranchise.id)
    if (error) {
      toast.error('Failed to add franchise to collection')
    } else {
      toast.success('Franchise added to collection!')
    }
    setShowCollectionModal(false)
    setSelectedFranchise(null)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Franchises</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-spartan">
            Browse Franchises
          </h1>
          <p className="text-gray-600">
            Discover and compare franchise opportunities across all industries
          </p>
        </motion.div>

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sector={sector}
          setSector={setSector}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 text-sm text-gray-600">
              Showing {franchises.length} franchise{franchises.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {franchises.map((franchise) => (
                <FranchiseCard
                  key={franchise.id}
                  franchise={franchise}
                  onAddToCollection={handleAddToCollection}
                />
              ))}
            </div>

            {franchises.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No franchises found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </motion.div>
        )}
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
              Add "{selectedFranchise?.name}" to Collection
            </h3>
            
            <div className="space-y-2 mb-6">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleConfirmAddToCollection(collection.id)}
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

export default Browse