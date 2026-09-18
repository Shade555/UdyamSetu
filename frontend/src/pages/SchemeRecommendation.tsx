import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'

interface SchemeRecommendationProps {
  language: string
  profile: any
}

export default function SchemeRecommendation(_props: SchemeRecommendationProps) {
  const navigate = useNavigate()
  const [selectedScheme, setSelectedScheme] = useState(0)

  const schemes = [
    {
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      matchReasons: [
        'Your project type matches',
        'Requested amount is within scheme limit',
        'Your profile meets all conditions',
      ],
      loanRange: '₹10,000 - ₹50,00,000',
      interestRate: '4% - 6%',
      repaymentPeriod: 'Up to 15 years',
      moratorium: 'Up to 2 years',
      source: 'Ministry of MSME',
      verified: 'Sep 18, 2026',
    },
    {
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

  const currentScheme = schemes[selectedScheme]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-3">
            Suitable schemes
          </h1>
          <p className="text-neutral-600">Based on your profile and requirements</p>
        </motion.div>

        {/* Main Scheme */}
        <motion.div
          className="card mb-8 border-2 border-accent-500"
          variants={itemVariants}
          key={selectedScheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold font-display text-neutral-900 mb-4">
            {currentScheme.name}
          </h2>

          {/* Why This Scheme */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Why this scheme?</h3>
            <div className="space-y-2">
              {currentScheme.matchReasons.map((reason, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div
                    className="mt-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                  <p className="text-neutral-600">{reason}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheme Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-neutral-200">
            <div>
              <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Loan Range</p>
              <p className="text-lg font-semibold text-neutral-900">{currentScheme.loanRange}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Interest Rate</p>
              <p className="text-lg font-semibold text-neutral-900">{currentScheme.interestRate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Repayment</p>
              <p className="text-lg font-semibold text-neutral-900">{currentScheme.repaymentPeriod}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Moratorium</p>
              <p className="text-lg font-semibold text-neutral-900">{currentScheme.moratorium}</p>
            </div>
          </div>

          {/* Source & Verification */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-neutral-600">Official source: </span>
              <span className="font-semibold text-neutral-900">{currentScheme.source}</span>
            </div>
            <div className="text-neutral-500">
              ✓ Verified {currentScheme.verified}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div className="flex gap-3 mb-8" variants={containerVariants}>
          {schemes.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedScheme(idx)}
              className={`h-2 rounded-full transition-all ${
                selectedScheme === idx
                  ? 'bg-accent-600 w-8'
                  : 'bg-neutral-300 w-2 hover:bg-neutral-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/finance')}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View finance details
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}
