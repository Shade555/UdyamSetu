import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface PartnerProps {
  language: string
}

export default function Partner(_props: PartnerProps) {
  const navigate = useNavigate()

  const partners = [
    {
      name: 'District Industries Centre (DIC)',
      distance: '4.2 km',
      authorized: true,
      compatible: true,
      verified: true,
      address: '123 Main Street, Pune',
    },
    {
      name: 'SIDBI Branch',
      distance: '6.1 km',
      authorized: true,
      compatible: true,
      verified: true,
      address: '456 Business Park, Pune',
    },
    {
      name: 'Local Cooperative Bank',
      distance: '2.3 km',
      authorized: false,
      compatible: false,
      verified: true,
      address: '789 Town Center, Pune',
    },
  ]

  const suitablePartners = partners.filter((p) => p.authorized && p.compatible)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-3">
            Find a suitable partner
          </h1>
          <p className="text-neutral-600">Authorized and compatible with your scheme</p>
        </motion.div>

        {/* Partners */}
        <motion.div className="space-y-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {suitablePartners.map((partner, idx) => (
            <motion.div
              key={idx}
              className="card border-2 border-accent-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-neutral-900">{partner.name}</h3>
                <div className="flex gap-2">
                  {partner.authorized && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      Authorized ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin size={16} />
                  <span>{partner.address}</span>
                </div>
                <p className="text-sm text-neutral-600">{partner.distance} away</p>
              </div>

              <motion.button
                onClick={() => navigate('/action')}
                className="btn-primary w-full py-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Select this partner
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Excluded Partners */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-sm font-semibold text-neutral-700 mb-2">Other nearby partners</p>
          <div className="space-y-2">
            {partners
              .filter((p) => !p.authorized || !p.compatible)
              .map((partner, idx) => (
                <motion.div
                  key={idx}
                  className="card opacity-60 border-neutral-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-neutral-900 font-semibold">{partner.name}</h3>
                      <p className="text-sm text-neutral-600">{partner.distance} away</p>
                    </div>
                    {!partner.compatible && (
                      <span className="text-xs font-semibold text-neutral-500 bg-neutral-200 px-2 py-1 rounded">
                        Not compatible
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
