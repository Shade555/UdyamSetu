import { useState, useCallback } from 'react'
import * as api from '../services/api'

interface UseAPIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useExtractProfile(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const extract = useCallback(
    async (text: string) => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.extractProfile(text)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Extraction failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { extract, loading, error }
}

export function useCheckEligibility(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const check = useCallback(
    async (profile: api.Profile) => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.checkEligibility(profile)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Eligibility check failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { check, loading, error }
}

export function useGetSchemes(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getSchemes = useCallback(
    async (profile: api.Profile) => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.getSchemes(profile)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Get schemes failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { getSchemes, loading, error }
}

export function useCalculateFinance(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const calculate = useCallback(
    async (loanAmount: number, interestRate: number, tenure: number) => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.calculateFinance(loanAmount, interestRate, tenure)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Finance calculation failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { calculate, loading, error }
}

export function useFindPartners(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const findPartners = useCallback(
    async (location: string, schemeId: string) => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.findPartners(location, schemeId)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Find partners failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { findPartners, loading, error }
}

export function useHealthCheck(options?: UseAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const check = useCallback(
    async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.healthCheck()
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Health check failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  return { check, loading, error }
}
