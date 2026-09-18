import { motion } from 'framer-motion'
import { Briefcase, BookOpen, MoreHorizontal } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

interface NeedSelectorProps {
  onSelectNeed: (need: 'business' | 'education' | 'other') => void
}

const NEEDS = [
  {
    id: 'business',
    label: 'Business / Entrepreneurship',
    icon: Briefcase,
    description: 'Start or expand your business',
  },
  {
    id: 'education',
    label: 'Education',
    icon: BookOpen,
    description: 'Pursue your educational goals',
  },
  {
    id: 'other',
    label: 'Other',
    icon: MoreHorizontal,
    description: 'Other financial needs',
  },
]

export function NeedSelector({ onSelectNeed }: NeedSelectorProps) {
  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="section-title mb-4">What do you need help with?</h1>
          <p className="section-subtitle">Choose the option that best matches your situation</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {NEEDS.map((need) => {
            const IconComponent = need.icon
            return (
              <motion.button
                key={need.id}
                className="card-interactive flex flex-col items-center text-center p-8 group"
                variants={staggerItem}
                onClick={() => onSelectNeed(need.id as 'business' | 'education' | 'other')}
                whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-xl bg-accent-50 flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <IconComponent className="w-8 h-8 text-accent-600" />
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{need.label}</h3>
                <p className="text-sm text-neutral-600">{need.description}</p>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
