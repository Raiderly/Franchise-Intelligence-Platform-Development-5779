import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useIndustryInsights = () => {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('industry_insights')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Industry insights fetch error:', error)
          throw error
        }

        setInsights(data || [])
      } catch (err) {
        console.error('Error fetching industry insights:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return { insights, loading, error }
}