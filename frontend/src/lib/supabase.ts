import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
  return data
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('id')
    .eq('user_id', userId)
    .eq('is_confirmed', true)
    .limit(1)

  if (error) {
    console.error('Error checking onboarding:', error)
    return false
  }
  return data && data.length > 0
}

/**
 * Get user's most recent requirement
 */
export async function getUserRequirement(userId: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('user_id', userId)
    .eq('is_confirmed', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching requirement:', error)
    return null
  }
  return data || null
}

/**
 * Create a new requirement
 */
export async function createRequirement(userId: string, requirement: any) {
  const { data, error } = await supabase
    .from('requirements')
    .insert([
      {
        user_id: userId,
        ...requirement,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating requirement:', error)
    throw error
  }
  return data
}

/**
 * Get active schemes
 */
export async function getActiveSchemes() {
  const { data, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('status', 'active')
    .order('name')

  if (error) {
    console.error('Error fetching schemes:', error)
    return []
  }
  return data || []
}

/**
 * Get active partners
 */
export async function getActivePartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('authorization_status', true)
    .order('name')

  if (error) {
    console.error('Error fetching partners:', error)
    return []
  }
  return data || []
}
