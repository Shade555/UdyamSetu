import { useState } from 'react'
import type { UserProfile } from '../types'
import { motion } from 'framer-motion'
import { Mic, Send } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

interface RequirementInputProps {
  onConfirm: (profile: Partial<UserProfile>) => void
}

export function RequirementInput({ onConfirm }: RequirementInputProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsProcessing(true)

    // Simulate AI extraction
    setTimeout(() => {
      const extractedProfile: Partial<UserProfile> = {
        projectType: 'Dairy business',
        requestedAmount: 300000,
        annualIncome: 200000,
        location: 'Rural, Maharashtra',
      }

      onConfirm(extractedProfile)
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="section-title mb-4">Tell us what you need</h1>
          <p className="section-subtitle">You can write or speak. Be as detailed as you like.</p>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Example chips */}
          <motion.div variants={staggerItem} className="space-y-3">
            <p className="text-sm font-semibold text-neutral-700">Example requests:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Start a dairy business',
                'Buy equipment',
                'Expand my shop',
                'Education loan',
              ].map((chip) => (
                <motion.button
                  key={chip}
                  className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm text-neutral-700 hover:border-accent-300 hover:bg-accent-50 transition-all"
                  onClick={() => setInput(chip)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Input area */}
          <motion.div variants={staggerItem} className="space-y-3">
            <label className="text-sm font-semibold text-neutral-700">Your requirement:</label>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: I need ₹3 lakh for a dairy business. My annual income is around ₹2 lakh..."
                className="input-base resize-none"
                rows={4}
              />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={staggerItem}
            className="flex gap-4 justify-center"
          >
            <motion.button
              className="flex items-center gap-2 btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5" />
              Speak
            </motion.button>
            <motion.button
              className="flex items-center gap-2 btn-primary"
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Continue
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
