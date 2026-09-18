import { motion } from 'framer-motion'
import type { SchemeData } from '../types'
import { CheckCircle, Info } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { formatCurrency } from '../lib/utils'

interface SchemeRecommendationProps {
  scheme: SchemeData
  onSelect: () => void
  onViewAlternatives: () => void
}

export function SchemeRecommendation({
  scheme,
  onSelect,
  onViewAlternatives,
}: SchemeRecommendationProps) {
  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="section-title">Primary recommendation</h1>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-accent-50 to-transparent">
            <motion.h2
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {scheme.name}
            </motion.h2>
            <motion.p
              className="text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {scheme.description}
            </motion.p>
          </div>

          {/* Why this scheme */}
          <div className="px-8 py-6 border-t border-neutral-200">
            <motion.h3 className="font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Why this scheme?
            </motion.h3>
            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {(scheme.eligibilityReasons || []).map((reason: string, _idx: number) => (
                <motion.div
                  key={_idx}
                  className="flex gap-3 items-start"
                  variants={staggerItem}
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-700">{reason}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Financial details */}
          <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200">
            <motion.h3 className="font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Financial parameters
            </motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Loan Range', value: `${formatCurrency(scheme.minAmount)} - ${formatCurrency(scheme.maxAmount)}` },
                { label: 'Interest Rate', value: `${scheme.interestRate}% p.a.` },
                { label: 'Repayment', value: `${scheme.repaymentPeriod} months` },
                { label: 'Moratorium', value: `${scheme.moratorium} months` },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-neutral-900">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Source and verification */}
          <div className="px-8 py-4 flex items-center gap-2 text-sm text-neutral-600 border-t border-neutral-200">
            <Info className="w-4 h-4" />
            <span>
              Official source: <strong>{scheme.source}</strong> • Last verified: 12 Sep 2026
            </span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="mt-8 flex gap-4 justify-center flex-col sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="btn-secondary"
            onClick={onViewAlternatives}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View other schemes
          </motion.button>
          <motion.button
            className="btn-primary"
            onClick={onSelect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Select this scheme
          </motion.button>
        </motion.div>

        {/* Additional info */}
        <motion.button
          className="mt-6 w-full py-3 border border-neutral-200 rounded-lg text-neutral-700 font-semibold hover:bg-neutral-100 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <Info className="w-4 h-4 inline mr-2" />
          View detailed eligibility criteria
        </motion.button>
      </div>
    </motion.div>
  )
}
