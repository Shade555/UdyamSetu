import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Edit2 } from 'lucide-react'

interface ProfileConfirmationProps {
  language: string
  profile: any
}

export default function ProfileConfirmation({ profile }: ProfileConfirmationProps) {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/eligibility')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
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
            Here's what we understood
          </h1>
          <p className="text-neutral-600">Please verify the information below</p>
        </motion.div>

        {/* Profile Fields */}
        <motion.div className="space-y-3 mb-8" variants={containerVariants}>
          {profile && (
            <>
              <motion.div className="card" variants={itemVariants}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase">Purpose</p>
                    <p className="text-lg font-semibold text-neutral-900 mt-1 capitalize">
                      {profile.purpose}
                    </p>
                  </div>
                  <Edit2 size={18} className="text-neutral-400 cursor-pointer hover:text-accent-600" />
                </div>
              </motion.div>

              <motion.div className="card" variants={itemVariants}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase">Project</p>
                    <p className="text-lg font-semibold text-neutral-900 mt-1 capitalize">
                      {profile.projectType}
                    </p>
                  </div>
                  <Edit2 size={18} className="text-neutral-400 cursor-pointer hover:text-accent-600" />
                </div>
              </motion.div>

              <motion.div className="card" variants={itemVariants}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase">Requested Amount</p>
                    <p className="text-lg font-semibold text-neutral-900 mt-1">
                      ₹{(profile.requestedAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Edit2 size={18} className="text-neutral-400 cursor-pointer hover:text-accent-600" />
                </div>
              </motion.div>

              <motion.div className="card" variants={itemVariants}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase">Annual Income</p>
                    <p className="text-lg font-semibold text-neutral-900 mt-1">
                      ₹{(profile.annualIncome || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Edit2 size={18} className="text-neutral-400 cursor-pointer hover:text-accent-600" />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div className="space-y-3" variants={containerVariants}>
          <motion.button
            variants={itemVariants}
            onClick={handleContinue}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Check my eligibility
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            variants={itemVariants}
            className="btn-secondary w-full py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Edit information
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
