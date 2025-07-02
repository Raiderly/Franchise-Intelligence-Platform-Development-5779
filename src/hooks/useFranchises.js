import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useFranchises = (searchTerm = '', sector = '', sortBy = 'name') => {
  const [franchises, setFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('franchise_brands')
          .select('*')

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        }

        if (sector) {
          query = query.eq('sector', sector)
        }

        if (sortBy === 'cost_low') {
          query = query.order('startup_cost_min', { ascending: true })
        } else if (sortBy === 'cost_high') {
          query = query.order('startup_cost_max', { ascending: false })
        } else if (sortBy === 'profit') {
          query = query.order('net_profit_margin', { ascending: false })
        } else {
          query = query.order('name', { ascending: true })
        }

        const { data, error } = await query

        if (error) throw error
        setFranchises(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFranchises()
  }, [searchTerm, sector, sortBy])

  return { franchises, loading, error }
}

export const useFranchise = (id) => {
  const [franchise, setFranchise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('franchise_brands')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setFranchise(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFranchise()
    }
  }, [id])

  return { franchise, loading, error }
}