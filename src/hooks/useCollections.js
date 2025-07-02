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
      const { data, error } = await supabase
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

      if (error) throw error
      setCollections(data || [])
    } catch (err) {
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
      const { data, error } = await supabase
        .from('collections')
        .insert([
          {
            name,
            description,
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error
      await fetchCollections()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateCollection = async (id, name, description) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .update({ name, description })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      await fetchCollections()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteCollection = async (id) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchCollections()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  const addToCollection = async (collectionId, brandId) => {
    try {
      const { data, error } = await supabase
        .from('collection_items')
        .insert([
          {
            collection_id: collectionId,
            brand_id: brandId
          }
        ])
        .select()
        .single()

      if (error) throw error
      await fetchCollections()
      return { data, error: null }
    } catch (err) {
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

      if (error) throw error
      await fetchCollections()
      return { error: null }
    } catch (err) {
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