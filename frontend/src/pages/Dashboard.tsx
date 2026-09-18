import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { hasCompletedOnboarding, getUserRequirement } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [currentRequirement, setCurrentRequirement] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.id) return

      const completed = await hasCompletedOnboarding(user.id)
      setHasOnboarded(completed)

      if (completed) {
        const requirement = await getUserRequirement(user.id)
        setCurrentRequirement(requirement)
      }

      setLoading(false)
    }

    checkOnboarding()
  }, [user])

  const handleStartOnboarding = () => {
    navigate('/onboarding/language')
  }

  const handleContinueJourney = () => {
    navigate('/eligibility')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="flex justify-between items-start mb-8" variants={itemVariants}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-neutral-600">Continue your journey to find the right scheme</p>
          </div>
          <motion.button
            onClick={handleSignOut}
            className="btn-secondary flex items-center gap-2 px-4 py-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            Sign out
          </motion.button>
        </motion.div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Card */}
          <motion.div
            className="card border-2 border-accent-500"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User size={24} className="text-accent-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  {hasOnboarded ? 'Journey Started' : 'Get Started'}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {hasOnboarded
                    ? 'You have completed the initial setup. Continue exploring schemes.'
                    : 'Tell us about your need to find the right scheme for you.'}
                </p>
                <motion.button
                  onClick={
                    hasOnboarded ? handleContinueJourney : handleStartOnboarding
                  }
                  className="btn-primary flex items-center gap-2 py-2 px-4 text-sm w-fit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {hasOnboarded ? 'Continue Journey' : 'Start Onboarding'}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            className="card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500 uppercase font-semibold mb-1">Email</p>
                <p className="text-neutral-900 font-medium">{user?.email}</p>
              </div>
              <motion.button
                onClick={() => navigate('/profile')}
                className="btn-ghost w-full py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Current Requirement Card */}
        {currentRequirement && (
          <motion.div
            className="card mt-6 border-l-4 border-l-accent-600"
            variants={itemVariants}
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Current Requirement</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-neutral-500 uppercase font-semibold mb-1">Type</p>
                <p className="text-neutral-900 font-medium capitalize">
                  {currentRequirement.need_type}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 uppercase font-semibold mb-1">Purpose</p>
                <p className="text-neutral-900 font-medium">{currentRequirement.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 uppercase font-semibold mb-1">Amount</p>
                <p className="text-neutral-900 font-medium">
                  ₹{currentRequirement.desired_amount?.toLocaleString('en-IN') || 'N/A'}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleContinueJourney}
              className="btn-primary py-2 px-4 flex items-center gap-2 w-fit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Recommendations
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* Quick Start Card */}
        {!hasOnboarded && (
          <motion.div
            className="card mt-6 bg-accent-50 border border-accent-200"
            variants={itemVariants}
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Quick Start Guide</h3>
            <ol className="space-y-2 text-sm text-neutral-700">
              <li>
                <span className="font-semibold">1. Select Language</span> - Choose your preferred language
              </li>
              <li>
                <span className="font-semibold">2. Choose Category</span> - Tell us what you're looking for
              </li>
              <li>
                <span className="font-semibold">3. Enter Requirements</span> - Share your details and needs
              </li>
              <li>
                <span className="font-semibold">4. Confirm Profile</span> - Review and confirm extracted information
              </li>
              <li>
                <span className="font-semibold">5. Get Recommendations</span> - View suitable schemes
              </li>
            </ol>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
