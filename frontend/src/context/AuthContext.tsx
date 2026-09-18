import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthSession } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        setSession(data?.session || null)
        setUser(data?.session?.user || null)
      } catch (err: any) {
        console.error('Error initializing auth:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null)
      setLoading(true)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Sign up failed')

      // The user_profiles table is created automatically via a database trigger
      // when a user signs up in Supabase Auth
    } catch (err: any) {
      const message = err.message || 'Sign up failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.session) throw new Error('Sign in failed')

      setSession(data.session)
      setUser(data.session.user)
    } catch (err: any) {
      const message = err.message || 'Sign in failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setSession(null)
      setUser(null)
    } catch (err: any) {
      const message = err.message || 'Sign out failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
