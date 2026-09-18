/**
 * API Service Layer
 * Abstraction for all backend API calls
 * Currently returns mock data, ready to replace with real endpoints
 */

export interface Profile {
  purpose: string
  projectType: string
  requestedAmount: number
  annualIncome: number
  location: string
  rawInput: string
}

export interface Scheme {
  id: string
  name: string
  matchReasons: string[]
  loanRange: string
  interestRate: string
  repaymentPeriod: string
  moratorium: string
  source: string
  verified: string
}

export interface Partner {
  id: string
  name: string
  distance: string
  authorized: boolean
  compatible: boolean
  verified: boolean
  address: string
}

export interface FinanceCalculation {
  monthlyEMI: number
  totalInterest: number
  totalRepayment: number
  disclaimer: string
}

// API endpoints (will be replaced with real URLs)
// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

/**
 * Extract structured profile from raw text
 * POST /api/extract-profile
 */
export async function extractProfile(rawText: string): Promise<Profile> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/extract-profile`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: rawText })
    // })
    // return await response.json()

    // Mock implementation
    return {
      purpose: 'business',
      projectType: 'dairy business',
      requestedAmount: 300000,
      annualIncome: 200000,
      location: 'Maharashtra',
      rawInput: rawText,
    }
  } catch (error) {
    console.error('Profile extraction failed:', error)
    throw error
  }
}

/**
 * Check eligibility based on profile
 * POST /api/check-eligibility
 */
export async function checkEligibility(_profile: Profile): Promise<{ eligible: boolean; schemeCount: number; reasons: string[] }> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/check-eligibility`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile)
    // })
    // return await response.json()

    // Mock implementation
    return {
      eligible: true,
      schemeCount: 3,
      reasons: [
        'Beneficiary category matches scheme requirements',
        'Project type is supported under the scheme',
        'Requested amount is within scheme limits',
        'Income meets minimum requirements',
      ],
    }
  } catch (error) {
    console.error('Eligibility check failed:', error)
    throw error
  }
}

/**
 * Get schemes for given profile
 * POST /api/schemes
 */
export async function getSchemes(_profile: Profile): Promise<Scheme[]> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/schemes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile)
    // })
    // return await response.json()

    // Mock implementation
    return [
      {
        id: '1',
        name: 'Prime Minister Employment Generation Programme (PMEGP)',
        matchReasons: [
          'Your requested amount falls within the scheme limit',
          'Your project type is supported',
          'Your beneficiary category matches',
          'The repayment terms are compatible',
        ],
        loanRange: '₹10,000 - ₹50,00,000',
        interestRate: '4% - 6%',
        repaymentPeriod: 'Up to 15 years',
        moratorium: 'Up to 2 years',
        source: 'Ministry of MSME',
        verified: 'Sep 18, 2026',
      },
      {
        id: '2',
        name: 'Pradhan Mantri Mudra Yojana (PMMY)',
        matchReasons: ['Suitable for small business', 'Quick approval process', 'Flexible repayment terms'],
        loanRange: '₹50,000 - ₹10,00,000',
        interestRate: '6% - 8%',
        repaymentPeriod: 'Up to 5 years',
        moratorium: 'Up to 6 months',
        source: 'Ministry of Finance',
        verified: 'Sep 18, 2026',
      },
      {
        id: '3',
        name: 'Stand-Up India Scheme',
        matchReasons: ['SC/ST category preference', 'Entrepreneurship support', 'Competitive interest rates'],
        loanRange: '₹10,00,000 - ₹1,00,00,000',
        interestRate: '5% - 7%',
        repaymentPeriod: 'Up to 10 years',
        moratorium: 'Up to 18 months',
        source: 'Ministry of Finance',
        verified: 'Sep 18, 2026',
      },
    ]
  } catch (error) {
    console.error('Get schemes failed:', error)
    throw error
  }
}

/**
 * Calculate finance parameters
 * POST /api/calculate-finance
 */
export async function calculateFinance(
  loanAmount: number,
  interestRate: number,
  tenure: number
): Promise<FinanceCalculation> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/calculate-finance`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ loanAmount, interestRate, tenure })
    // })
    // return await response.json()

    // Mock implementation - EMI calculation formula
    const monthlyRate = interestRate / 12 / 100
    const numberOfPayments = tenure * 12
    const monthlyEMI = Math.round(
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
    const totalRepayment = monthlyEMI * numberOfPayments
    const totalInterest = totalRepayment - loanAmount

    return {
      monthlyEMI,
      totalInterest,
      totalRepayment,
      disclaimer: 'Calculated estimate based on scheme parameters shown above. Official repayment terms may differ.',
    }
  } catch (error) {
    console.error('Finance calculation failed:', error)
    throw error
  }
}

/**
 * Find suitable partners
 * POST /api/find-partners
 */
export async function findPartners(
  _location: string,
  _schemeId: string
): Promise<Partner[]> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/find-partners`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ location, schemeId })
    // })
    // return await response.json()

    // Mock implementation
    return [
      {
        id: '1',
        name: 'District Industries Centre (DIC)',
        distance: '4.2 km',
        authorized: true,
        compatible: true,
        verified: true,
        address: '123 Main Street, Pune',
      },
      {
        id: '2',
        name: 'SIDBI Branch',
        distance: '6.1 km',
        authorized: true,
        compatible: true,
        verified: true,
        address: '456 Business Park, Pune',
      },
      {
        id: '3',
        name: 'Local Cooperative Bank',
        distance: '2.3 km',
        authorized: false,
        compatible: false,
        verified: true,
        address: '789 Town Center, Pune',
      },
    ]
  } catch (error) {
    console.error('Find partners failed:', error)
    throw error
  }
}

/**
 * Health check - verify API is running
 * GET /api/health
 */
export async function healthCheck(): Promise<boolean> {
  try {
    // Placeholder for real API call
    // const response = await fetch(`${API_BASE}/health`)
    // return response.ok

    // Mock implementation
    return true
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}

export default {
  extractProfile,
  checkEligibility,
  getSchemes,
  calculateFinance,
  findPartners,
  healthCheck,
}
