import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface RequirementInputProps {
  language: string;
  setUserProfile: (profile: any) => void;
}

export default function RequirementInput({
  language,
  setUserProfile,
}: RequirementInputProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;

    setIsProcessing(true);

    // Simulate AI extraction
    const mockProfile = {
      purpose: "business",
      projectType: "dairy business",
      requestedAmount: 300000,
      annualIncome: 200000,
      location: "Maharashtra",
      rawInput: input,
    };

    setTimeout(() => {
      setUserProfile(mockProfile);
      navigate("/onboarding/profile");
    }, 1000);
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
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-3">
            Tell us what you need
          </h1>
          <p className="text-neutral-600">
            Be as detailed as you'd like. We'll understand.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.textarea
            variants={itemVariants}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "en"
                ? "e.g., 'I need ₹3 lakh to start a dairy business. My annual income is around ₹2 lakh.'"
                : language === "hi"
                  ? "उदाहरण: 'मुझे एक डेयरी व्यवसाय शुरू करने के लिए ₹3 लाख की जरूरत है'"
                  : "उदाहरण: 'मला डेयरी व्यवसाय सुरू करण्यासाठी ₹3 लाख आवश्यक आहे'"
            }
            className="input-base min-h-32 resize-none"
            disabled={isProcessing}
          />

          <motion.button
            variants={itemVariants}
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Understanding...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Examples */}
        <motion.div
          className="mt-8 pt-8 border-t border-neutral-200"
          variants={itemVariants}
        >
          <p className="text-sm font-semibold text-neutral-700 mb-3">
            Example inputs:
          </p>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>
              • I want to start a small shop with ₹2 lakh loan, my annual income
              is ₹1.5 lakh
            </p>
            <p>
              • Need help with education loan for college, family income ₹3 lakh
              annually
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
