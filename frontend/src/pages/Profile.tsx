import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../lib/supabase'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [language, setLanguage] = useState('en')
  const [beneficiaryCategory, setBeneficiaryCategory] = useState('')
  const [education, setEducation] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        const profile = await getUserProfile(user.id)
        if (profile) {
          setFullName(profile.full_name || '')
          setLanguage(profile.language || 'en')
          setBeneficiaryCategory(profile.beneficiary_category || '')
          setEducation(profile.education || '')
          setAnnualIncome(profile.annual_income?.toString() || '')
          setAge(profile.age?.toString() || '')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user?.id) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateUserProfile(user.id, {
        full_name: fullName,
        language,
        beneficiary_category: beneficiaryCategory,
        education,
        annual_income: annualIncome ? parseFloat(annualIncome) : null,
        age: age ? parseInt(age) : null,
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
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
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="flex items-center gap-4 mb-8" variants={itemVariants}>
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-4xl font-bold font-display text-neutral-900">Your Profile</h1>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6"
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-green-700">{success}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-base"
              placeholder="Your name"
            />
          </motion.div>

          {/* Language */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </motion.div>

          {/* Beneficiary Category */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Beneficiary Category
            </label>
            <input
              type="text"
              value={beneficiaryCategory}
              onChange={(e) => setBeneficiaryCategory(e.target.value)}
              className="input-base"
              placeholder="e.g., SC, ST, OBC"
            />
          </motion.div>

          {/* Education */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Education</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="input-base"
              placeholder="e.g., High School, Graduate"
            />
          </motion.div>

          {/* Annual Income */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Annual Income</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="input-base"
              placeholder="0"
            />
          </motion.div>

          {/* Age */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-base"
              placeholder="0"
            />
          </motion.div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
            variants={itemVariants}
            whileHover={!saving ? { scale: 1.02 } : {}}
            whileTap={!saving ? { scale: 0.98 } : {}}
          >
            {saving ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
