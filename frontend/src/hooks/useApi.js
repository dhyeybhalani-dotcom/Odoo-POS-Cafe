import { useState, useCallback } from 'react'
import { useToast } from '../context/ToastContext'

export function useApi(apiFunction, defaultData = null) {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiFunction(...args)
      const successData = response?.data?.data || response?.data || response
      setData(successData)
      return successData
    } catch (err) {
      console.error('useApi execute error:', err)
      const errMsg = err?.message || err?.response?.data?.message || 'An unexpected error occurred.'
      setError(errMsg)
      addToast(errMsg, 'error')
      throw err // So components can catch things specifically if needed
    } finally {
      setLoading(false)
    }
  }, [apiFunction, addToast])

  return { execute, data, loading, error, setData }
}
