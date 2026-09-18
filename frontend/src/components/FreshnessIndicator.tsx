import { motion } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface FreshnessIndicatorProps {
  verifiedDate: string
  status?: 'verified' | 'stale' | 'unknown'
  showIcon?: boolean
}

export default function FreshnessIndicator({ verifiedDate, status = 'verified', showIcon = true }: FreshnessIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'text-green-600'
      case 'stale':
        return 'text-amber-600'
      case 'unknown':
        return 'text-neutral-500'
      default:
        return 'text-neutral-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 size={14} />
      case 'stale':
        return <AlertCircle size={14} />
      case 'unknown':
        return <Clock size={14} />
      default:
        return <Clock size={14} />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Live data'
      case 'stale':
        return 'Cached data'
      case 'unknown':
        return 'Not verified'
      default:
        return 'Unknown'
    }
  }

  return (
    <motion.div
      className="flex items-center gap-1.5 text-xs text-neutral-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {showIcon && <div className={`${getStatusColor()}`}>{getStatusIcon()}</div>}
      <span>
        {getStatusText()} • {verifiedDate}
      </span>
    </motion.div>
  )
}
