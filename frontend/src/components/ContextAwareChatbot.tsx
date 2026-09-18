import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  Volume2,
  X,
  MessageCircle,
  ChevronDown,
  Globe,
} from 'lucide-react'
import { useChatbot, startSpeechRecognition } from '../context/ChatbotContext'

export default function ContextAwareChatbot() {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem("udyamsetu-theme") !== "light" ? 'dark' : 'light'
  )

  useEffect(() => {
    const handleStorage = () => {
      setTheme(localStorage.getItem("udyamsetu-theme") !== "light" ? 'dark' : 'light')
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 100)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])
  const {
    messages,
    isOpen,
    isLoading,
    isSpeaking,
    language,
    sendMessage,
    clearMessages,
    setIsOpen,
    setLanguage,
    toggleVoiceMode,
  } = useChatbot()

  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      await sendMessage(input)
      setInput('')
    }
  }

  const handleVoiceInput = async () => {
    setIsListening(true)
    try {
      const transcript = await startSpeechRecognition(language)
      if (transcript) {
        setInput(transcript)
      }
    } catch (error) {
      console.error('Voice input error:', error)
    } finally {
      setIsListening(false)
    }
  }

  const handleLanguageChange = (newLang: 'en' | 'hi' | 'mr') => {
    setLanguage(newLang)
    setShowLanguageMenu(false)
  }

  const languageLabels = {
    en: 'English',
    hi: 'हिन्दी',
    mr: 'मराठी',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-body">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border-2 rounded-2xl shadow-2xl flex flex-col h-96 w-96 mb-4`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className={`${theme === 'dark' ? 'bg-neutral-800 text-neutral-50' : 'bg-neutral-100 text-neutral-900'} px-6 py-4 rounded-t-lg flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <div>
                  <h3 className="font-bold text-sm">UdyamSetu Guide</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'opacity-90' : 'opacity-70'}`}>Always here to help</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className={`${theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'} p-1 rounded-lg transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
              {messages.length === 0 ? (
                <motion.div
                  className="text-center text-neutral-500 text-sm py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Hello! I'm here to guide you through every step.</p>
                  <p className="text-xs mt-2 opacity-70">
                    Ask me anything about schemes, eligibility, or documents.
                  </p>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-neutral-700 text-neutral-50 rounded-br-none'
                          : 'bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user'
                            ? 'opacity-75'
                            : 'text-neutral-500'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex gap-2">
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="border-t border-neutral-700 bg-neutral-900 p-3 space-y-2 rounded-b-lg">
              {/* Language & Voice Controls */}
              <div className="flex gap-2 mb-2">
                {/* Language Selector */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe size={14} />
                    {languageLabels[language]}
                    <ChevronDown size={12} />
                  </motion.button>

                  <AnimatePresence>
                    {showLanguageMenu && (
                      <motion.div
                        className="absolute bottom-full left-0 mb-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-max"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {(
                          ['en', 'hi', 'mr'] as const
                        ).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                              language === lang
                                ? 'bg-neutral-700 text-neutral-100 font-semibold'
                                : 'text-neutral-300'
                            }`}
                          >
                            {languageLabels[lang]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Voice Mode Toggle */}
                <motion.button
                  onClick={toggleVoiceMode}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSpeaking
                      ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isSpeaking ? 'Voice mode ON' : 'Voice mode OFF'}
                >
                  <Volume2 size={14} />
                  {isSpeaking ? 'Voice ON' : 'Voice OFF'}
                </motion.button>

                {/* Clear Chat */}
                <motion.button
                  onClick={clearMessages}
                  className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-300 transition-colors ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isLoading || isListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Voice input"
                >
                  <Mic size={16} />
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${theme === 'dark' ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'} rounded-full shadow-lg flex items-center justify-center transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ visibility: isOpen ? 'hidden' : 'visible' }}
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  )
}
