export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateEMI(
  principal: number,
  ratePerMonth: number,
  months: number
): number {
  if (ratePerMonth === 0) {
    return Math.round(principal / months)
  }
  const emi =
    (principal * ratePerMonth * (1 + ratePerMonth) ** months) /
    ((1 + ratePerMonth) ** months - 1)
  return Math.round(emi)
}

export function calculateFinance(
  loanAmount: number,
  interestRate: number,
  tenure: number,
  moratorium: number = 0
) {
  const ratePerMonth = interestRate / 12 / 100
  const repaymentMonths = tenure - moratorium

  const monthlyEMI = calculateEMI(loanAmount, ratePerMonth, repaymentMonths)
  const totalRepayment = monthlyEMI * repaymentMonths + loanAmount * (moratorium / 12) * (interestRate / 100)
  const totalInterest = totalRepayment - loanAmount

  return {
    monthlyEMI,
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment),
  }
}

export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round((R * c) * 10) / 10
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function translateKey(key: string, language: 'en' | 'hi' | 'mr'): string {
  const translations: Record<string, Record<string, string>> = {
    'Get Started': {
      en: 'Get Started',
      hi: 'शुरुआत करें',
      mr: 'सुरुवात करा',
    },
    'Find the right path': {
      en: 'Find the right path for what you need.',
      hi: 'अपनी आवश्यकता के लिए सही पथ खोजें।',
      mr: 'आपल्या गरजेसाठी योग्य मार्ग शोधा।',
    },
    'Continue': {
      en: 'Continue',
      hi: 'जारी रखें',
      mr: 'सुरू ठेवा',
    },
  }

  return translations[key]?.[language] || key
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export class StorageManager {
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}
