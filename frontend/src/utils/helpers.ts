/**
 * Utility helper functions
 */

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number with Indian numbering system
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Get difference in days between two dates
 */
export function getDaysDifference(date1: Date, date2: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor(Math.abs(date2.getTime() - date1.getTime()) / msPerDay)
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Indian format)
 */
export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate PAN (Permanent Account Number)
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.toUpperCase())
}

/**
 * Validate Aadhaar (12-digit)
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^\d{12}$/
  return aadhaarRegex.test(aadhaar.replace(/\D/g, ''))
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length - 3) + '...'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if two objects are equal (shallow comparison)
 */
export function shallowEqual<T extends Record<string, any>>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  return keys1.every((key) => obj1[key] === obj2[key])
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get URL parameters
 */
export function getQueryParam(param: string): string | null {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(param)
}

/**
 * Set URL parameters
 */
export function setQueryParam(param: string, value: string): void {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(param, value)
  window.history.replaceState({}, '', `?${searchParams.toString()}`)
}

/**
 * Local storage with type safety
 */
export const storage = {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get<T>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue ?? null
    try {
      return JSON.parse(item) as T
    } catch {
      return defaultValue ?? null
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  },
}

/**
 * Session storage with type safety
 */
export const sessionStorage = {
  set<T>(key: string, value: T): void {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },
  get<T>(key: string, defaultValue?: T): T | null {
    const item = window.sessionStorage.getItem(key)
    if (item === null) return defaultValue ?? null
    try {
      return JSON.parse(item) as T
    } catch {
      return defaultValue ?? null
    }
  },
  remove(key: string): void {
    window.sessionStorage.removeItem(key)
  },
  clear(): void {
    window.sessionStorage.clear()
  },
}
