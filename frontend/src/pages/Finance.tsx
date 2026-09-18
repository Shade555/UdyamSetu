import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface FinanceProps {
  language: string
}

export default function Finance(_props: FinanceProps) {
  const navigate = useNavigate()
  const [loanAmount, setLoanAmount] = useState(300000)
  const [tenure, setTenure] = useState(5)

  const interestRate = 6
  const monthlyEMI = Math.round((loanAmount * (interestRate / 12 / 100) * Math.pow(1 + interestRate / 12 / 100, tenure * 12)) / (Math.pow(1 + interestRate / 12 / 100, tenure * 12) - 1))
  const totalRepayment = monthlyEMI * tenure * 12
  const totalInterest = totalRepayment - loanAmount

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-3">
            What could repayment look like?
          </h1>
        </motion.div>

        {/* Main Number */}
        <motion.div
          className="card mb-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-sm font-semibold text-neutral-500 uppercase mb-2">Estimated Monthly EMI</p>
          <motion.div
            className="text-5xl md:text-6xl font-bold font-display text-accent-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            ₹{monthlyEMI.toLocaleString('en-IN')}
          </motion.div>
          <p className="text-neutral-600 mt-2">per month for {tenure} years</p>
        </motion.div>

        {/* Sliders */}
        <motion.div className="space-y-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-neutral-900">Loan Amount</label>
              <span className="text-accent-600 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-neutral-900">Tenure</label>
              <span className="text-accent-600 font-bold">{tenure} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div className="space-y-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="card flex justify-between">
            <span className="text-neutral-600">Interest Rate</span>
            <span className="font-semibold text-neutral-900">{interestRate}% per annum</span>
          </div>
          <div className="card flex justify-between">
            <span className="text-neutral-600">Total Interest</span>
            <span className="font-semibold text-neutral-900">₹{totalInterest.toLocaleString('en-IN')}</span>
          </div>
          <div className="card flex justify-between">
            <span className="text-neutral-600">Total Repayment</span>
            <span className="font-bold text-accent-600">₹{totalRepayment.toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-xs text-neutral-500 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Calculated estimate based on scheme parameters. Official terms may vary.
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/documents')}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next: Documents
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}
