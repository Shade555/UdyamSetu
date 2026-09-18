import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface EligibilityCheckProps {
  language: string
  profile: any
}

export default function EligibilityCheck(_props: EligibilityCheckProps) {
  const navigate = useNavigate()
  const [checks, setChecks] = useState<Array<{ label: string; passed: boolean }>>([])
  const [isComplete, setIsComplete] = useState(false)
  const [schemeCount, setSchemeCount] = useState(0)

  useEffect(() => {
    const simulateChecks = async () => {
      const checkItems = [
        { label: 'Beneficiary criteria', passed: true },
        { label: 'Project eligibility', passed: true },
        { label: 'Amount limit', passed: true },
        { label: 'Income requirements', passed: true },
      ]

      for (let i = 0; i < checkItems.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        setChecks((prev) => [...prev, checkItems[i]])
      }

      await new Promise((resolve) => setTimeout(resolve, 400))

      // Animate scheme count
      for (let i = 0; i <= 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150))
        setSchemeCount(i)
      }

      setIsComplete(true)
    }

    simulateChecks()
  }, [])

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
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-2">
            Checking your eligibility
          </h1>
        </motion.div>

        {/* Checks */}
        <motion.div className="space-y-3 mb-12" variants={containerVariants}>
          {checks.map((check, idx) => (
            <motion.div
              key={idx}
              className="card flex items-center gap-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check size={16} className="text-white" />
              </motion.div>
              <span className="text-neutral-900 font-medium">{check.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Result */}
        {isComplete && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-5xl md:text-6xl font-bold font-display text-accent-600 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {schemeCount}
            </motion.div>
            <p className="text-xl text-neutral-600 mb-6">suitable schemes found</p>

            <motion.button
              onClick={() => navigate('/scheme')}
              className="btn-primary px-8 py-4 mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View recommendations
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
