import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

interface LanguageSelectorProps {
  onSelectLanguage: (lang: string) => void;
}

export default function LanguageSelector({
  onSelectLanguage,
}: LanguageSelectorProps) {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const languages = [
    { code: "en", label: "English", nativeName: "English" },
    { code: "hi", label: "हिन्दी", nativeName: "Hindi" },
    { code: "mr", label: "मराठी", nativeName: "Marathi" },
  ];

  const handleSelectLanguage = (code: string) => {
    setSelectedLang(code);
    onSelectLanguage(code);

    setTimeout(() => {
      navigate("/onboarding/need");
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-2">
            How would you like to continue?
          </h1>
          <p className="text-neutral-600">Choose your language</p>
        </motion.div>

        {/* Language Options */}
        <motion.div className="space-y-3" variants={containerVariants}>
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                selectedLang === lang.code
                  ? "bg-accent-600 text-white shadow-lg"
                  : "bg-white border-2 border-neutral-200 text-neutral-900 hover:border-accent-500"
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="flex items-center justify-between"
                initial={false}
              >
                <span>{lang.label}</span>
                {selectedLang === lang.code && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check size={20} />
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-center text-sm text-neutral-500 mt-8"
          variants={itemVariants}
        >
          You can change your language anytime
        </motion.p>
      </motion.div>
    </div>
  );
}
