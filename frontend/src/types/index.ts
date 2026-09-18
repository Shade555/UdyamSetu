/**
 * Shared TypeScript types and interfaces
 */

// Type-only imports from React and other libraries
import type { ReactNode } from 'react'
import type { User, AuthSession } from '@supabase/supabase-js'

export type { User, AuthSession, ReactNode }

export interface UserProfile {
  id?: string
  purpose: 'business' | 'education' | 'other'
  projectType: string
  projectCost?: number
  requestedAmount: number
  annualIncome: number
  education?: string
  location: string
  category?: 'SC' | 'ST' | 'OBC' | 'General'
  age?: number
  language: 'en' | 'hi' | 'mr'
  createdAt?: Date
  updatedAt?: Date
}

export interface SchemeData {
  id: string
  name: string
  description?: string
  beneficiaryCategory: string[]
  purpose: string[]
  minAmount: number
  maxAmount: number
  interestRate: number
  moratorium: number
  repaymentPeriod: number
  repaymentFrequency: string
  minIncome?: number
  maxIncome?: number
  incomeCondition?: string
  ageMin?: number
  ageMax?: number
  educationRequired?: string
  eligibilityReasons?: string[]
  requiredDocuments: string[]
  partnerTypes: string[]
  source: string
  officialLink?: string
  effectiveDate: string
  lastVerifiedDate: string
  version: string
  status: 'active' | 'inactive' | 'deprecated'
}

export interface PartnerData {
  id: string
  name: string
  type: 'bank' | 'ngo' | 'government' | 'cooperative'
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  contactEmail?: string
  contactPhone?: string
  supportedSchemes: string[]
  supportedCategories: string[]
  authorizationStatus: 'authorized' | 'unauthorized' | 'pending'
  operationalStatus: 'active' | 'inactive' | 'unknown'
  npaStatus?: 'clear' | 'npa' | 'unknown'
  verificationStatus: 'verified' | 'unverified'
  verificationDate?: string
  source: string
  version: string
}

export interface EligibilityResult {
  eligible: boolean
  schemeId: string
  schemeName: string
  reasons: EligibilityReason[]
  failedConditions: FailedCondition[]
  confidence: number // 0-100
}

export interface EligibilityReason {
  id: string
  field: string
  condition: string
  explanation: string
  status: 'pass' | 'fail' | 'unknown'
}

export interface FailedCondition {
  id: string
  field: string
  required: string
  actual: string
  explanation: string
}

export interface FinanceData {
  monthlyEMI?: number
  totalInterest: number
  totalRepayment: number
  repaymentFrequency: string
  moratoriumMonths: number
  principalAmount: number
  interestRate: number
  tenure: number
  disclaimer: string
  calculatedAt: Date
}

export interface DocumentRequirement {
  id: string
  name: string
  category: 'identity' | 'income' | 'project' | 'financial' | 'business' | 'education' | 'other'
  required: boolean
  optional: boolean
  description?: string
  examples?: string[]
  status: 'available' | 'missing' | 'pending'
  uploadedAt?: Date
  verificationStatus?: 'not_verified' | 'verified' | 'rejected'
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
  timestamp: Date
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// State management types

export interface JourneyState {
  currentStep: JourneyStep
  language: 'en' | 'hi' | 'mr'
  userProfile: UserProfile | null
  selectedScheme: SchemeData | null
  selectedPartner: PartnerData | null
  eligibilityResults: EligibilityResult[] | null
  financeData: FinanceData | null
  documents: DocumentRequirement[] | null
  progress: Record<string, boolean>
}

export type JourneyStep =
  | 'home'
  | 'language'
  | 'need'
  | 'requirement'
  | 'profile'
  | 'eligibility'
  | 'scheme'
  | 'finance'
  | 'documents'
  | 'partner'
  | 'action'

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export interface NotificationConfig {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number // milliseconds
  action?: {
    label: string
    onClick: () => void
  }
}

// Offline support types

export interface CachedData {
  key: string
  value: any
  timestamp: number
  expiresAt: number
}

export interface SyncQueue {
  id: string
  action: string
  payload: any
  timestamp: number
  retries: number
  lastRetryAt?: number
}

export interface OfflineState {
  isOnline: boolean
  syncInProgress: boolean
  queuedActions: SyncQueue[]
  lastSyncAt?: Date
}

// Type aliases for backward compatibility with existing code
export type Scheme = SchemeData
export type Partner = PartnerData
export type Document = DocumentRequirement
