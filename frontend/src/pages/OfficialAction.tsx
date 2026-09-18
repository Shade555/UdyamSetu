import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink } from 'lucide-react'

interface OfficialActionProps {
  language: string
}

export default function OfficialAction(_props: OfficialActionProps) {

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Success Icon */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <motion.div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-3">
            You're ready for the next step
          </h1>
        </motion.div>

        {/* Summary */}
        <motion.div className="space-y-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="card">
            <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Selected Scheme</p>
            <p className="text-lg font-semibold text-neutral-900">Prime Minister Employment Generation Programme (PMEGP)</p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Estimated Monthly EMI</p>
            <p className="text-lg font-semibold text-neutral-900">₹5,234</p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Documents Ready</p>
            <p className="text-lg font-semibold text-neutral-900">5 of 6</p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Selected Partner</p>
            <p className="text-lg font-semibold text-neutral-900">District Industries Centre (DIC)</p>
          </div>
        </motion.div>

        {/* Official Action */}
        <motion.div
          className="card border-2 border-accent-500 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-semibold text-neutral-500 uppercase mb-3">Your next step</p>
          <p className="text-lg font-semibold text-neutral-900 mb-4">Apply through the official portal</p>
          <motion.button
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Open official application
            <ExternalLink size={18} />
          </motion.button>
        </motion.div>

        {/* Important Note */}
        <motion.div className="bg-accent-50 border-l-4 border-accent-500 p-4 rounded mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-sm text-neutral-800">
            <strong>Important:</strong> UdyamSetu helps you find the right path and prepares you for application. The final approval is decided by the official authorities.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div className="text-center text-xs text-neutral-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="mb-2">✓ Last verified: Sep 18, 2026</p>
          <p>✓ Information from official sources</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
