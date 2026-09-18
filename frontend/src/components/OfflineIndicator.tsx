import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-0 left-0 right-0 bg-amber-100 border-b border-amber-300 px-4 py-3 flex items-center gap-2 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-sm font-semibold text-amber-900">
            Limited connectivity. Using cached data.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
