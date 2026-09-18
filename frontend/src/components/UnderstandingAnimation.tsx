import { motion } from 'framer-motion'
import type { UserProfile } from '../types'
import { staggerContainer, staggerItem } from '../lib/animations'
import { formatCurrency } from '../lib/utils'

interface UnderstandingAnimationProps {
  profile: Partial<UserProfile>
  onConfirm: () => void
  onEdit: () => void
}

export function UnderstandingAnimation({
  profile,
  onConfirm,
  onEdit,
}: UnderstandingAnimationProps) {
  const fields = [
    { label: 'Purpose', value: profile.purpose || 'Business' },
    { label: 'Project', value: profile.projectType || 'Dairy business' },
    { label: 'Requested Amount', value: formatCurrency(profile.requestedAmount || 300000) },
    { label: 'Annual Income', value: formatCurrency(profile.annualIncome || 200000) },
    { label: 'Location', value: profile.location || 'Rural, Maharashtra' },
  ]

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title mb-4">Here's what we understood</h1>
          <p className="section-subtitle">Please review and correct if needed</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-neutral-200 p-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {fields.map((field, idx) => (
            <motion.div
              key={field.label}
              className="mb-6 pb-6 border-b border-neutral-100 last:mb-0 last:pb-0 last:border-b-0"
              variants={staggerItem}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-xs uppercase font-semibold text-neutral-500 mb-2">{field.label}</p>
              <motion.p
                className="text-2xl font-bold text-neutral-900"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
              >
                {field.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-4 mt-8 justify-center flex-col sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="btn-secondary"
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
          <motion.button
            className="btn-primary"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Looks right, continue
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
