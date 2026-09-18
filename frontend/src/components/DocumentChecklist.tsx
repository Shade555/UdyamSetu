import { useState } from 'react'
import type { DocumentRequirement } from '../types'
import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

interface DocumentChecklistProps {
  documents: DocumentRequirement[]
  onContinue: () => void
}

export function DocumentChecklist({ documents, onContinue }: DocumentChecklistProps) {
  const [checkedDocs, setCheckedDocs] = useState<string[]>(
    documents.filter((d) => d.status === 'available').map((d) => d.id)
  )

  const ready = checkedDocs.length
  const total = documents.length
  const missing = total - ready

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 py-12 px-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="section-title">Get your documents ready</h1>
          <p className="section-subtitle">Check what you have and what you'll need</p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-5xl font-bold text-accent-600 mb-2"
            key={ready}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {ready}/{total}
          </motion.div>
          <p className="text-neutral-600">documents ready</p>
          <div className="mt-4 w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-600"
              initial={{ width: '0%' }}
              animate={{ width: `${(ready / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Required documents */}
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="px-8 py-6 bg-neutral-50 border-b border-neutral-200"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <h3 className="font-bold text-lg mb-6">Required Documents</h3>
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {documents
                .filter((d) => d.required)
                .map((doc) => (
                  <motion.div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 cursor-pointer hover:border-accent-300 transition-all"
                    onClick={() => toggleDoc(doc.id)}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        checkedDocs.includes(doc.id)
                          ? 'bg-accent-600 border-accent-600'
                          : 'border-neutral-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {checkedDocs.includes(doc.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{doc.name}</p>
                      {doc.status === 'missing' && (
                        <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          Not yet ready
                        </p>
                      )}
                    </div>
                    {checkedDocs.includes(doc.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-600"
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>

          {/* Optional documents */}
          <motion.div
            className="px-8 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Optional Documents
            </h3>
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {documents
                .filter((d) => d.optional)
                .map((doc) => (
                  <motion.div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:border-accent-300 transition-all opacity-60"
                    onClick={() => toggleDoc(doc.id)}
                    variants={staggerItem}
                  >
                    <motion.div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        checkedDocs.includes(doc.id)
                          ? 'bg-accent-600 border-accent-600'
                          : 'border-neutral-300'
                      }`}
                    >
                      {checkedDocs.includes(doc.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                    <p className="font-semibold text-neutral-700">{doc.name}</p>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Missing documents summary */}
        {missing > 0 && (
          <motion.div
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              <strong>{missing} document{missing !== 1 ? 's' : ''} still needed</strong> – You can gather
              these before or after submitting your application.
            </p>
          </motion.div>
        )}

        {/* Continue button */}
        <motion.button
          className="btn-primary w-full"
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Continue to find partner
        </motion.button>
      </div>
    </motion.div>
  )
}
