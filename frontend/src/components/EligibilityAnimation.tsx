import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import { staggerContainer, staggerItem } from '../lib/animations'

interface EligibilityAnimationProps {
  onComplete: () => void
}

const CHECKS = [
  { label: 'Beneficiary criteria', status: 'pass' },
  { label: 'Project eligibility', status: 'pass' },
  { label: 'Amount limit', status: 'pass' },
  { label: 'Income requirement', status: 'pass' },
]

export function EligibilityAnimation({ onComplete }: EligibilityAnimationProps) {
  const [completedChecks, setCompletedChecks] = useState<string[]>([])

  useEffect(() => {
    let delay = 300
    const timers: ReturnType<typeof setTimeout>[] = []

    CHECKS.forEach((check) => {
      const timer = setTimeout(() => {
        setCompletedChecks((prev) => [...prev, check.label])
      }, delay)
      timers.push(timer)
      delay += 400
    })

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  useEffect(() => {
    if (completedChecks.length === CHECKS.length) {
      const timer = setTimeout(onComplete, 1000)
      return () => clearTimeout(timer)
    }
  }, [completedChecks, onComplete])

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title mb-4">Checking your eligibility</h1>
          <p className="section-subtitle">This usually takes a moment...</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-neutral-200 p-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {CHECKS.map((check) => (
            <motion.div
              key={check.label}
              className="mb-6 flex items-start gap-4 last:mb-0"
              variants={staggerItem}
            >
              <motion.div
                className="mt-1"
                initial={{ scale: 0 }}
                animate={completedChecks.includes(check.label) ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {check.status === 'pass' ? (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </motion.div>
              <motion.p
                className={`text-lg font-medium ${
                  completedChecks.includes(check.label) ? 'text-neutral-900' : 'text-neutral-400'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={
                  completedChecks.includes(check.label)
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0.5, x: -10 }
                }
              >
                {check.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {completedChecks.length === CHECKS.length && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="text-5xl font-bold text-accent-600 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                3
              </motion.span>
            </motion.div>
            <motion.p
              className="text-lg text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              suitable schemes found
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
