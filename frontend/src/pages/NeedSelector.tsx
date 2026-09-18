import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface NeedSelectorProps {
  language: string
}

export default function NeedSelector({ language }: NeedSelectorProps) {
  const navigate = useNavigate()
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null)

  const needs = [
    {
      id: 'business',
      icon: Briefcase,
      title: language === 'en' ? 'Business & Entrepreneurship' : language === 'hi' ? 'व्यवसाय और उद्यमिता' : 'व्यावसाय आणि उद्यमिता',
      description: language === 'en' ? 'Start or expand a business' : language === 'hi' ? 'एक व्यवसाय शुरू या विस्तार करें' : 'व्यावसाय सुरू किंवा विस्तृत करा',
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: language === 'en' ? 'Education & Skill Development' : language === 'hi' ? 'शिक्षा और कौशल विकास' : 'शिक्षा आणि कौशल विकास',
      description: language === 'en' ? 'Pursue higher education or skill training' : language === 'hi' ? 'उच्च शिक्षा या कौशल प्रशिक्षण प्राप्त करें' : 'उच्च शिक्षा किंवा कौशल प्रशिक्षण प्राप्त करा',
    },
    {
      id: 'other',
      icon: HelpCircle,
      title: language === 'en' ? 'Other' : language === 'hi' ? 'अन्य' : 'इतर',
      description: language === 'en' ? 'Something else' : language === 'hi' ? 'कुछ और' : 'काहीतरी अन्य',
    },
  ]

  const handleSelectNeed = (needId: string) => {
    setSelectedNeed(needId)
    setTimeout(() => {
      navigate('/requirement')
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
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
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-4">
            What do you need help with?
          </h1>
          <p className="text-neutral-600">Choose the area that best fits your requirement</p>
        </motion.div>

        {/* Need Cards */}
        <motion.div className="grid md:grid-cols-3 gap-4" variants={containerVariants}>
          {needs.map((need) => {
            const Icon = need.icon
            const isSelected = selectedNeed === need.id

            return (
              <motion.button
                key={need.id}
                onClick={() => handleSelectNeed(need.id)}
                className={`p-6 rounded-xl transition-all duration-300 text-left group overflow-hidden relative ${
                  isSelected
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-white border-2 border-neutral-200 text-neutral-900 hover:border-accent-500'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full"
                  animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className={`mb-3 p-3 rounded-lg w-fit ${
                      isSelected ? 'bg-white bg-opacity-20' : 'bg-accent-50'
                    }`}
                    animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <Icon
                      size={24}
                      className={isSelected ? 'text-white' : 'text-accent-600'}
                    />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-1">{need.title}</h3>
                  <p
                    className={`text-sm ${
                      isSelected ? 'text-white text-opacity-90' : 'text-neutral-600'
                    }`}
                  >
                    {need.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
