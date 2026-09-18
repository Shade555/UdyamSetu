import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  // Journey nodes for the animated path
  const journeySteps = [
    { label: 'NEED', x: 10 },
    { label: 'UNDERSTAND', x: 25 },
    { label: 'ELIGIBILITY', x: 40 },
    { label: 'SCHEME', x: 55 },
    { label: 'FINANCE', x: 70 },
    { label: 'DOCUMENTS', x: 85 },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12 md:px-8">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Text */}
        <motion.div className="mb-12 text-center" variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl font-bold font-display text-neutral-900 mb-4">
            Find the right path
            <br />
            <span className="text-accent-600">for what you need.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
            Understand schemes, eligibility, repayment, documents and your next official step — in one place.
          </p>
        </motion.div>

        {/* Journey Visualization */}
        <motion.div
          className="relative h-24 mb-16 flex items-center justify-center"
          variants={itemVariants}
        >
          {/* Background connecting line */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ opacity: 0.1 }}
          >
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Journey nodes */}
          <div className="relative w-full flex justify-between items-center px-4">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={step.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-accent-600 border-4 border-white flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
                <p className="text-xs font-semibold text-neutral-600 mt-2 text-center hidden md:block">
                  {step.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
          <motion.button
            onClick={() => navigate('/language')}
            className="btn-primary flex items-center justify-center gap-2 px-8 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <ArrowRight size={18} />
          </motion.button>
          <motion.button
            onClick={() => navigate('/language')}
            className="btn-secondary flex items-center justify-center px-8 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            See how it works
          </motion.button>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          className="mt-12 pt-8 border-t border-neutral-200 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-neutral-500 mb-2">Built on official, verified data</p>
          <div className="flex justify-center gap-4 text-xs text-neutral-600">
            <span>✓ Rule-based matching</span>
            <span>✓ Transparent</span>
            <span>✓ Trustworthy</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
