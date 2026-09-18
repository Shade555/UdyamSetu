import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'

interface DocumentsProps {
  language: string
}

export default function Documents(_props: DocumentsProps) {
  const navigate = useNavigate()
  const [documents] = useState([
    { id: 1, name: 'Aadhaar Card', required: true, status: 'ready' },
    { id: 2, name: 'Income Certificate', required: true, status: 'ready' },
    { id: 3, name: 'Project Proposal', required: true, status: 'missing' },
    { id: 4, name: 'Bank Statement', required: true, status: 'missing' },
    { id: 5, name: 'Caste Certificate', required: true, status: 'ready' },
    { id: 6, name: 'Business License', required: false, status: 'ready' },
  ])

  const readyCount = documents.filter((d) => d.status === 'ready').length
  const totalRequired = documents.filter((d) => d.required).length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
            Get your documents ready
          </h1>
          <motion.div
            className="text-3xl font-bold text-accent-600 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {readyCount} / {totalRequired} ready
          </motion.div>
        </motion.div>

        {/* Progress Ring */}
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f5f5f2" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#0284c7"
              strokeWidth="8"
              strokeDasharray={`${(readyCount / totalRequired) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
              animate={{ strokeDasharray: [`0 ${2 * Math.PI * 50}`, `${(readyCount / totalRequired) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`] }}
              transition={{ duration: 1 }}
            />
          </svg>
        </motion.div>

        {/* Documents List */}
        <motion.div className="space-y-2 mb-8" variants={containerVariants}>
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              className={`card flex items-center gap-3 ${
                doc.status === 'ready' ? 'bg-accent-50 border-accent-200' : ''
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              {doc.status === 'ready' ? (
                <motion.div
                  className="w-6 h-6 text-green-500 flex-shrink-0"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <CheckCircle2 size={20} />
                </motion.div>
              ) : (
                <div className="w-6 h-6 text-neutral-400 flex-shrink-0">
                  <Circle size={20} />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{doc.name}</p>
                {!doc.required && <p className="text-xs text-neutral-500">Optional</p>}
              </div>
              {doc.status === 'ready' && <span className="text-xs font-semibold text-green-600">Ready</span>}
            </motion.div>
          ))}
        </motion.div>

        {/* Missing Info */}
        <motion.p className="text-sm text-neutral-600 text-center mb-8" variants={itemVariants}>
          {totalRequired - readyCount} documents still needed
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/partner')}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Find a partner
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}
