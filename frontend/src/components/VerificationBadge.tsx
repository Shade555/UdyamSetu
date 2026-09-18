import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'

interface VerificationBadgeProps {
  status: 'verified' | 'unverified' | 'unavailable'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function VerificationBadge({ status, label, size = 'md' }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: <CheckCircle2 size={iconSize[size]} />,
          defaultLabel: 'Verified',
        }
      case 'unverified':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertCircle size={iconSize[size]} />,
          defaultLabel: 'Not verified',
        }
      case 'unavailable':
        return {
          bg: 'bg-neutral-100',
          border: 'border-neutral-300',
          text: 'text-neutral-600',
          icon: <HelpCircle size={iconSize[size]} />,
          defaultLabel: 'Not available',
        }
      default:
        return {
          bg: 'bg-neutral-100',
          border: 'border-neutral-300',
          text: 'text-neutral-600',
          icon: <HelpCircle size={iconSize[size]} />,
          defaultLabel: 'Unknown',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 border rounded-full font-semibold ${sizeClasses[size]} ${config.bg} ${config.border} ${config.text}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {config.icon}
      <span>{label || config.defaultLabel}</span>
    </motion.div>
  )
}
