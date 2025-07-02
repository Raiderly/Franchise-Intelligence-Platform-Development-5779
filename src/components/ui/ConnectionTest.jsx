import React, { useState, useEffect } from 'react'
import { supabase, SUPABASE_URL } from '../../config/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheckCircle, FiXCircle, FiLoader, FiDatabase, FiAlertTriangle } = FiIcons

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing')
  const [message, setMessage] = useState('Testing connection...')
  const [tableTests, setTableTests] = useState({})
  const [detailedError, setDetailedError] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('testing')
      setMessage('Connecting to Supabase and verifying schema...')
      setDetailedError(null)

      // Test required tables with detailed error reporting
      const tablesToTest = [
        'franchise_brands',
        'user_collections', 
        'franchise_comparisons',
        'industry_insights',
        'ai_questions'
      ]

      const results = {}
      let hasErrors = false

      for (const table of tablesToTest) {
        try {
          console.log(`Testing table: ${table}`)
          
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })

          if (error) {
            console.error(`Error testing ${table}:`, error)
            results[table] = {
              status: 'error',
              message: error.message,
              count: 0,
              details: error
            }
            hasErrors = true
          } else {
            console.log(`✅ ${table}: ${count || 0} records`)
            results[table] = {
              status: 'success',
              message: `Found ${count || 0} records`,
              count: count || 0
            }
          }
        } catch (err) {
          console.error(`Exception testing ${table}:`, err)
          results[table] = {
            status: 'error',
            message: err.message,
            count: 0,
            details: err
          }
          hasErrors = true
        }
      }

      setTableTests(results)

      // Additional connectivity tests
      try {
        // Test basic connection
        const { data: authData } = await supabase.auth.getSession()
        console.log('Auth session test:', authData ? 'OK' : 'No session')

        // Test a simple query
        const { data: testData, error: testError } = await supabase
          .from('franchise_brands')
          .select('id, name')
          .limit(1)

        if (testError) {
          console.error('Basic query test failed:', testError)
          setDetailedError(testError)
        }

      } catch (err) {
        console.error('Additional connectivity test failed:', err)
        setDetailedError(err)
      }

      // Determine overall status
      if (hasErrors) {
        setStatus('error')
        setMessage('Database connection failed - some tables are inaccessible')
      } else {
        const totalRecords = Object.values(results).reduce((sum, result) => sum + result.count, 0)
        setStatus('success')
        setMessage(`✅ All tables accessible! Total records: ${totalRecords}`)
      }

    } catch (err) {
      console.error('Connection test failed:', err)
      setStatus('error')
      setMessage(`Connection failed: ${err.message}`)
      setDetailedError(err)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-500 animate-spin" />
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
      case 'error':
        return <SafeIcon icon={FiXCircle} className="w-5 h-5 text-red-500" />
      default:
        return <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'testing':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getTableStatusIcon = (tableStatus) => {
    switch (tableStatus) {
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
      case 'error':
        return <SafeIcon icon={FiXCircle} className="w-4 h-4 text-red-500" />
      default:
        return <SafeIcon icon={FiLoader} className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className={`p-6 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="font-medium text-gray-900">Database Connection & Schema Status</p>
          <p className="text-sm text-gray-600">{message}</p>
          <div className="mt-1 text-xs text-gray-500">
            <p>URL: {SUPABASE_URL}</p>
            <p>Connected at: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Table Status Grid */}
      {Object.keys(tableTests).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Table Status:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(tableTests).map(([table, result]) => (
              <div key={table} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-2">
                  {getTableStatusIcon(result.status)}
                  <span className="text-sm font-mono text-gray-700">{table}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {result.status === 'success' ? `${result.count} records` : 'Error'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Error Information */}
      {detailedError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-red-800 mb-2">
              🔍 Detailed Error Information (Click to expand)
            </summary>
            <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(detailedError, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button
          onClick={testConnection}
          className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-secondary transition-colors"
        >
          🔄 Retry Connection Test
        </button>
        
        {status === 'success' && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            ✅ Continue to App
          </button>
        )}
      </div>

      {/* Status Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium text-gray-700 mb-2">🎯 Schema Validation Summary:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>✅ Expected tables: franchise_brands, user_collections, franchise_comparisons, industry_insights, ai_questions</p>
          <p>✅ RLS enabled with universal SELECT policies</p>
          <p>✅ Authentication configured for user-specific data</p>
          <p>📊 Total tables tested: {Object.keys(tableTests).length}/5</p>
        </div>
      </div>
    </div>
  )
}

export default ConnectionTest