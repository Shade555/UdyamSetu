import { motion } from 'framer-motion'

interface JourneyProgressProps {
  currentStep: number
  totalSteps: number
  stepLabel?: string
}

export default function JourneyProgress({ currentStep, totalSteps, stepLabel }: JourneyProgressProps) {
  const steps = ['NEED', 'UNDERSTAND', 'ELIGIBILITY', 'SCHEME', 'FINANCE', 'DOCUMENTS', 'PARTNER', 'ACTION']
  const displaySteps = steps.slice(0, totalSteps)

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-4 md:px-8 md:py-6"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Mobile view */}
        <div className="md:hidden text-center">
          <p className="text-sm font-semibold text-neutral-900 mb-2">
            {currentStep} / {totalSteps}
          </p>
          {stepLabel && <p className="text-xs text-neutral-600">{stepLabel}</p>}
          <motion.div
            className="h-1 bg-neutral-200 rounded-full mt-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-accent-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex items-center justify-between gap-2">
          {displaySteps.map((step, idx) => {
            const isCompleted = idx < currentStep - 1
            const isCurrent = idx === currentStep - 1

            return (
              <motion.div key={step} className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {idx > 0 && (
                  <motion.div
                    className="h-1 bg-neutral-200 flex-shrink-0"
                    style={{ width: '20px' }}
                    animate={{ backgroundColor: isCompleted ? '#0284c7' : '#ebe8e3' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                    isCompleted ? 'bg-accent-600 text-white' : isCurrent ? 'bg-accent-600 text-white ring-2 ring-accent-300' : 'bg-neutral-200 text-neutral-600'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </motion.div>
                <p className="text-xs font-semibold text-neutral-600 ml-2 hidden lg:block whitespace-nowrap">{step}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
