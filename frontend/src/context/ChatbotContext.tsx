import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { detectFormFields, fillFormField as setFormField, type FormField } from '../services/formFieldDetector'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatbotContextType {
  messages: Message[]
  isOpen: boolean
  isLoading: boolean
  isSpeaking: boolean
  language: 'en' | 'hi' | 'mr'
  currentScreenContext: string
  setIsOpen: (open: boolean) => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void
  setCurrentScreenContext: (context: string) => void
  toggleVoiceMode: () => Promise<void>
  fillFormField: (fieldName: string, value: string) => Promise<boolean>
  listFormFields: () => string[]
  undoLastFieldFill: () => Promise<boolean>
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en')
  const [currentScreenContext, setCurrentScreenContext] = useState('')
  const lastFill = useRef<{ field: FormField; previousValue: string } | null>(null)

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: 'assistant', content, timestamp: Date.now() }])
  }, [])

  const listFormFields = useCallback(() => detectFormFields().map((field) => field.label || field.name), [])

  const fillFormField = useCallback(async (fieldName: string, value: string) => {
    const fields = detectFormFields()
    const query = fieldName.trim().toLowerCase()
    const field = fields.find((candidate) => [candidate.name, candidate.label, candidate.id]
      .some((name) => name.toLowerCase() === query || name.toLowerCase().includes(query) || query.includes(name.toLowerCase())))
    if (!field) {
      addAssistantMessage(`I couldn't find “${fieldName}”. Available fields: ${fields.map((item) => item.label || item.name).join(', ') || 'none on this page'}.`)
      return false
    }
    const previousValue = field.value
    if (!setFormField(field, value)) {
      addAssistantMessage(`I couldn't use that value for ${field.label || field.name}. Please check the format and try again.`)
      return false
    }
    lastFill.current = { field, previousValue }
    addAssistantMessage(`✓ I've filled ${field.label || field.name} with “${value}”. Say “undo that” to restore it.`)
    return true
  }, [addAssistantMessage])

  const undoLastFieldFill = useCallback(async () => {
    const change = lastFill.current
    if (!change || !setFormField(change.field, change.previousValue)) {
      addAssistantMessage('There is no recent field change I can undo.')
      return false
    }
    addAssistantMessage(`✓ Restored ${change.field.label || change.field.name}.`)
    lastFill.current = null
    return true
  }, [addAssistantMessage])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        if (/^(undo|undo that|change that)$/i.test(content.trim())) {
          await undoLastFieldFill()
          return
        }
        const fields = detectFormFields()
        const actionResponse = await fetch('http://localhost:8000/api/chatbot/action', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, context: currentScreenContext, language, fields }),
        })
        if (actionResponse.ok) {
          const action = await actionResponse.json()
          if (action.type === 'action' && action.action === 'fill_field') {
            const success = await fillFormField(action.field, action.value)
            if (success && isSpeaking) await speakText(action.response, language)
            return
          }
        }
        const response = await fetch('http://localhost:8000/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            context: currentScreenContext,
            language,
            history: messages,
          }),
        })

        if (!response.ok) throw new Error('Failed to get response')

        const data = await response.json()
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`, role: 'assistant', content: data.response, timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Auto-speak if voice mode is enabled
        if (isSpeaking) {
          await speakText(data.response, language)
        }
      } catch (error) {
        console.error('Chatbot error:', error)
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [currentScreenContext, language, messages, isSpeaking, fillFormField, undoLastFieldFill]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const toggleVoiceMode = useCallback(async () => {
    setIsSpeaking((prev) => !prev)
  }, [])

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        isSpeaking,
        language,
        currentScreenContext,
        setIsOpen,
        sendMessage,
        clearMessages,
        setLanguage,
        setCurrentScreenContext,
        toggleVoiceMode,
        fillFormField,
        listFormFields,
        undoLastFieldFill,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider')
  }
  return context
}

// Helper function for text-to-speech
export async function speakText(text: string, language: string) {
  if (!('speechSynthesis' in window)) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN'
  utterance.rate = 0.9
  utterance.pitch = 1

  window.speechSynthesis.speak(utterance)
}

// Helper function for speech-to-text
export async function startSpeechRecognition(language: string): Promise<string> {
  return new Promise((resolve) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      resolve('')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
      resolve(transcript)
    }

    recognition.onerror = () => {
      resolve('')
    }

    recognition.start()
  })
}
