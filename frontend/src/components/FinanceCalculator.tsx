import { useState, useEffect } from 'react'
import type { SchemeData } from '../types'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { formatCurrency, calculateFinance } from '../lib/utils'

interface FinanceCalculatorProps {
  scheme: SchemeData
  onContinue: () => void
}

export function FinanceCalculator({ scheme, onContinue }: FinanceCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<number>(scheme.minAmount)
  const [tenure, setTenure] = useState<number>(scheme.repaymentPeriod)
  const [finance, setFinance] = useState(() =>
    calculateFinance(loanAmount, scheme.interestRate, tenure, scheme.moratorium)
  )

  useEffect(() => {
    setFinance(
      calculateFinance(loanAmount, scheme.interestRate, tenure, scheme.moratorium)
    )
  }, [loanAmount, tenure, scheme])

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="section-title">What could repayment look like?</h1>
          <p className="section-subtitle">Adjust the loan amount and tenure to see estimates</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-neutral-200 p-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Large EMI display */}
          <motion.div
            className="text-center mb-12 p-8 bg-gradient-to-br from-accent-50 to-transparent rounded-lg"
            variants={staggerItem}
          >
            <p className="text-neutral-600 mb-2">Estimated monthly payment</p>
            <motion.div
              className="text-6xl font-bold text-accent-600"
              key={finance.monthlyEMI}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {formatCurrency(finance.monthlyEMI)}
            </motion.div>
            <p className="text-sm text-neutral-500 mt-2">/ month</p>
          </motion.div>

          {/* Sliders */}
          <motion.div className="space-y-8" variants={staggerContainer} initial="initial" animate="animate">
            {/* Loan amount slider */}
            <motion.div variants={staggerItem}>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-neutral-700">Loan Amount</label>
                <span className="text-lg font-bold text-accent-600">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={scheme.minAmount}
                max={scheme.maxAmount}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-2">
                <span>{formatCurrency(scheme.minAmount)}</span>
                <span>{formatCurrency(scheme.maxAmount)}</span>
              </div>
            </motion.div>

            {/* Tenure slider */}
            <motion.div variants={staggerItem}>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-neutral-700">Repayment Tenure</label>
                <span className="text-lg font-bold text-accent-600">{tenure} months</span>
              </div>
              <input
                type="range"
                min={12}
                max={scheme.repaymentPeriod}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-2">
                <span>12 months</span>
                <span>{scheme.repaymentPeriod} months</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Finance summary */}
          <motion.div className="mt-12 pt-8 border-t border-neutral-200 space-y-4" variants={staggerContainer} initial="initial" animate="animate">
            {[
              { label: 'Interest Rate', value: `${scheme.interestRate}% p.a.` },
              { label: 'Total Interest (Est.)', value: formatCurrency(finance.totalInterest) },
              { label: 'Total Repayment (Est.)', value: formatCurrency(finance.totalRepayment) },
            ].map((item, idx) => (
              <motion.div key={idx} className="flex justify-between" variants={staggerItem}>
                <span className="text-neutral-600">{item.label}</span>
                <motion.span
                  className="font-semibold text-neutral-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            className="mt-8 text-xs text-neutral-500 bg-neutral-50 p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Calculated estimate based on the scheme parameters shown. Official repayment terms may differ based on your final application.
          </motion.p>
        </motion.div>

        {/* Continue button */}
        <motion.button
          className="btn-primary w-full mt-8"
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Continue to next step
        </motion.button>
      </div>
    </motion.div>
  )
}
