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
        await sendMessage(transcript)
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
            drag
            dragConstraints={{ left: -800, right: 0, top: -800, bottom: 0 }}
            dragElastic={0.1}
            className="bg-white border-neutral-200 border-2 rounded-2xl shadow-2xl flex flex-col w-[calc(100vw-2rem)] sm:w-96 min-h-[300px] h-auto max-h-[calc(100vh-8rem)] sm:max-h-[600px] mb-4 origin-bottom-right"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-neutral-100 text-neutral-900 px-6 py-4 rounded-t-lg flex justify-between items-center cursor-move active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <div>
                  <h3 className="font-bold text-sm">UdyamSetu Guide</h3>
                  <p className="text-xs opacity-70">Always here to help</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="hover:bg-neutral-200 p-1 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.length === 0 ? (
                <motion.div
                  className="text-center text-neutral-500 text-sm py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Hello! I'm here to guide you through every step.</p>
                  <p className="text-xs mt-2 opacity-70">
                    Ask about schemes, or say “my email is…” to fill a visible form field.
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
                          ? 'bg-accent-600 text-white rounded-br-none'
                          : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
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
                  <div className="bg-white border border-neutral-200 rounded-lg rounded-bl-none px-4 py-2">
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
            <div className="border-t border-neutral-200 bg-white p-3 space-y-2 rounded-b-lg">
              {/* Language & Voice Controls */}
              <div className="flex gap-2 mb-2">
                {/* Language Selector */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 transition-colors"
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
                        className="absolute bottom-full left-0 mb-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 min-w-max"
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
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                              language === lang
                                ? 'bg-neutral-100 text-neutral-900 font-semibold'
                                : 'text-neutral-600'
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
                      ? 'bg-accent-50 text-accent-700 hover:bg-accent-100'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                  className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 transition-colors ml-auto"
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
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isLoading || isListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                  className="p-2 bg-accent-600 text-white hover:bg-accent-700 rounded-lg transition-colors disabled:opacity-50 disabled:bg-neutral-200 disabled:text-neutral-400"
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
        className="w-14 h-14 bg-accent-600 text-white hover:bg-accent-700 rounded-full shadow-lg flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ visibility: isOpen ? 'hidden' : 'visible' }}
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  )
}
