import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useFranchiseComparisons = () => {
  const { user } = useAuth()
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComparisons = async () => {
    if (!user) {
      setComparisons([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('franchise_comparisons')
        .select(`
          *,
          franchise_brands!franchise_comparisons_franchise_a_id_fkey (*),
          franchise_brands!franchise_comparisons_franchise_b_id_fkey (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Franchise comparisons fetch error:', error)
        throw error
      }

      setComparisons(data || [])
    } catch (err) {
      console.error('Error fetching franchise comparisons:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComparisons()
  }, [user])

  const createComparison = async (franchiseAId, franchiseBId, notes = '') => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('franchise_comparisons')
        .insert([
          { 
            user_id: user.id,
            franchise_a_id: franchiseAId,
            franchise_b_id: franchiseBId,
            notes
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Create comparison error:', error)
        throw error
      }

      await fetchComparisons()
      return { data, error: null }
    } catch (err) {
      console.error('Error creating comparison:', err)
      return { data: null, error: err.message }
    }
  }

  const deleteComparison = async (id) => {
    try {
      const { error } = await supabase
        .from('franchise_comparisons')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Delete comparison error:', error)
        throw error
      }

      await fetchComparisons()
      return { error: null }
    } catch (err) {
      console.error('Error deleting comparison:', err)
      return { error: err.message }
    }
  }

  return {
    comparisons,
    loading,
    error,
    createComparison,
    deleteComparison,
    refetch: fetchComparisons
  }
}