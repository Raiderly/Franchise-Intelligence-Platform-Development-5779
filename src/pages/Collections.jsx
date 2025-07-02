import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCollections } from '../hooks/useCollections'
import { useAuth } from '../contexts/AuthContext'
import FranchiseCard from '../components/ui/FranchiseCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiPlus, FiEdit2, FiTrash2, FiFolder } = FiIcons

const Collections = () => {
  const { user } = useAuth()
  const { 
    collections, 
    loading, 
    createCollection, 
    updateCollection, 
    deleteCollection,
    removeFromCollection 
  } = useCollections()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your collections</p>
        </div>
      </div>
    )
  }

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return

    const { error } = await createCollection(newCollectionName, newCollectionDescription)
    if (error) {
      toast.error('Failed to create collection')
    } else {
      toast.success('Collection created!')
      setShowCreateModal(false)
      setNewCollectionName('')
      setNewCollectionDescription('')
    }
  }

  const handleEditCollection = async () => {
    if (!editingCollection || !newCollectionName.trim()) return

    const { error } = await updateCollection(
      editingCollection.id, 
      newCollectionName, 
      newCollectionDescription
    )
    if (error) {
      toast.error('Failed to update collection')
    } else {
      toast.success('Collection updated!')
      setShowEditModal(false)
      setEditingCollection(null)
      setNewCollectionName('')
      setNewCollectionDescription('')
    }
  }

  const handleDeleteCollection = async (collection) => {
    if (!confirm(`Are you sure you want to delete "${collection.name}"?`)) return

    const { error } = await deleteCollection(collection.id)
    if (error) {
      toast.error('Failed to delete collection')
    } else {
      toast.success('Collection deleted!')
    }
  }

  const handleRemoveFromCollection = async (collectionId, brandId) => {
    const { error } = await removeFromCollection(collectionId, brandId)
    if (error) {
      toast.error('Failed to remove franchise from collection')
    } else {
      toast.success('Franchise removed from collection!')
    }
  }

  const openEditModal = (collection) => {
    setEditingCollection(collection)
    setNewCollectionName(collection.name)
    setNewCollectionDescription(collection.description || '')
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-spartan">
              My Collections
            </h1>
            <p className="text-gray-600 mt-2">
              Organize and compare your saved franchises
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiFolder} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No collections yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first collection to start organizing franchises
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Create Collection
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-light p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {collection.name}
                    </h2>
                    {collection.description && (
                      <p className="text-gray-600 mt-1">{collection.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {collection.collection_items?.length || 0} franchise{(collection.collection_items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(collection)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {collection.collection_items && collection.collection_items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collection.collection_items.map((item) => (
                      <div key={item.id} className="relative">
                        <FranchiseCard
                          franchise={item.franchise_brands}
                          showAddButton={false}
                        />
                        <button
                          onClick={() => handleRemoveFromCollection(collection.id, item.franchise_brands.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from collection"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No franchises in this collection yet</p>
                    <p className="text-sm mt-1">Browse franchises to add them here</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Collection</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., Food Franchises"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Brief description of this collection"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {showEditModal && editingCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Collection</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Collections