import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useCollections = () => {
  const { user } = useAuth()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCollections = async () => {
    if (!user) {
      setCollections([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Try user_collections first, fallback to collections
      let query = supabase
        .from('user_collections')
        .select(`
          *,
          collection_items (
            id,
            franchise_brands (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      let { data, error } = await query

      // If user_collections doesn't exist, try collections table
      if (error && error.message.includes('relation "user_collections" does not exist')) {
        query = supabase
          .from('collections')
          .select(`
            *,
            collection_items (
              id,
              franchise_brands (*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const result = await query
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Collections fetch error:', error)
        throw error
      }

      setCollections(data || [])
    } catch (err) {
      console.error('Error fetching collections:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [user])

  const createCollection = async (name, description) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      // Try user_collections first, fallback to collections
      let { data, error } = await supabase
        .from('user_collections')
        .insert([
          { name, description, user_id: user.id }
        ])
        .select()
        .single()

      // If user_collections doesn't exist, try collections table
      if (error && error.message.includes('relation "user_collections" does not exist')) {
        const result = await supabase
          .from('collections')
          .insert([
            { name, description, user_id: user.id }
          ])
          .select()
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Create collection error:', error)
        throw error
      }

      await fetchCollections()
      return { data, error: null }
    } catch (err) {
      console.error('Error creating collection:', err)
      return { data: null, error: err.message }
    }
  }

  const updateCollection = async (id, name, description) => {
    try {
      // Try user_collections first, fallback to collections
      let { data, error } = await supabase
        .from('user_collections')
        .update({ name, description })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      // If user_collections doesn't exist, try collections table
      if (error && error.message.includes('relation "user_collections" does not exist')) {
        const result = await supabase
          .from('collections')
          .update({ name, description })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Update collection error:', error)
        throw error
      }

      await fetchCollections()
      return { data, error: null }
    } catch (err) {
      console.error('Error updating collection:', err)
      return { data: null, error: err.message }
    }
  }

  const deleteCollection = async (id) => {
    try {
      // Try user_collections first, fallback to collections
      let { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      // If user_collections doesn't exist, try collections table
      if (error && error.message.includes('relation "user_collections" does not exist')) {
        const result = await supabase
          .from('collections')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)
        
        error = result.error
      }

      if (error) {
        console.error('Delete collection error:', error)
        throw error
      }

      await fetchCollections()
      return { error: null }
    } catch (err) {
      console.error('Error deleting collection:', err)
      return { error: err.message }
    }
  }

  const addToCollection = async (collectionId, brandId) => {
    try {
      const { data, error } = await supabase
        .from('collection_items')
        .insert([
          { collection_id: collectionId, brand_id: brandId }
        ])
        .select()
        .single()

      if (error) {
        console.error('Add to collection error:', error)
        throw error
      }

      await fetchCollections()
      return { data, error: null }
    } catch (err) {
      console.error('Error adding to collection:', err)
      return { data: null, error: err.message }
    }
  }

  const removeFromCollection = async (collectionId, brandId) => {
    try {
      const { error } = await supabase
        .from('collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('brand_id', brandId)

      if (error) {
        console.error('Remove from collection error:', error)
        throw error
      }

      await fetchCollections()
      return { error: null }
    } catch (err) {
      console.error('Error removing from collection:', err)
      return { error: err.message }
    }
  }

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    refetch: fetchCollections
  }
}