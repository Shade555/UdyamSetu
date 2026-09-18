import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { staggerContainer, staggerItem } from '../lib/animations'

interface LanguageSelectorProps {
  currentLanguage: 'en' | 'hi' | 'mr'
  onSelectLanguage: (lang: 'en' | 'hi' | 'mr') => void
  onContinue: () => void
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
]

export function LanguageSelector({
  currentLanguage,
  onSelectLanguage,
  onContinue,
}: LanguageSelectorProps) {
  return (
    <motion.div
      className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">UdyamSetu</h1>
          <p className="text-lg text-neutral-600">How would you like to continue?</p>
        </motion.div>

        <motion.div
          className="space-y-4 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.code}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all border-2 ${
                currentLanguage === lang.code
                  ? 'bg-accent-600 text-white border-accent-600 shadow-lg'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-accent-300'
              }`}
              onClick={() => onSelectLanguage(lang.code as 'en' | 'hi' | 'mr')}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-neutral-500">{lang.name}</p>
                  <p className="text-2xl">{lang.nativeName}</p>
                </div>
                {currentLanguage === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          className="btn-primary w-full"
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}
