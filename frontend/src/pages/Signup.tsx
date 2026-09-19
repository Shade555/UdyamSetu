import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, loading, error: authError } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await signUp(email, password, fullName)
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
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

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-50 mb-3">
            Get started
          </h1>
          <p className="text-neutral-400">Create your account to begin</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-4" variants={containerVariants}>
          {/* Error Message */}
          {(error || authError) && (
            <motion.div
              className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-start gap-3"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error || authError}</p>
            </motion.div>
          )}

          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                id="full-name"
                name="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-neutral-800 border-2 border-neutral-700 rounded-lg text-neutral-50 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700 transition-all pl-10"
                disabled={loading}
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-neutral-800 border-2 border-neutral-700 rounded-lg text-neutral-50 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700 transition-all pl-10"
                disabled={loading}
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-800 border-2 border-neutral-700 rounded-lg text-neutral-50 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700 transition-all pl-10"
                disabled={loading}
              />
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                id="confirm-password"
                name="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-800 border-2 border-neutral-700 rounded-lg text-neutral-50 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700 transition-all pl-10"
                disabled={loading}
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 mt-6 bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
            variants={itemVariants}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Sign in link */}
        <motion.div className="text-center mt-6" variants={itemVariants}>
          <p className="text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neutral-200 font-semibold hover:text-neutral-100">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
