# UdyamSetu Context-Aware Chatbot Implementation Guide

## 🎯 Current Implementation

### What's Been Built
✅ **Screen-Context-Aware Chatbot** with multilingual support  
✅ **Voice Input/Output** (Web Speech API)  
✅ **Message History** with timestamps  
✅ **Language Selection** (English, Hindi, Marathi)  
✅ **Responsive UI** matching dashboard design  
✅ **Groq API Integration** ready (backend-connected)  

### Architecture

```
ContextAwareChatbot (Component)
    ↓
    ├── ChatbotContext (State Management)
    ├── useChatbotContext (Screen Detection Hook)
    └── Groq API (Backend Integration)
         ↓
         FastAPI Backend
         ↓
         /api/chatbot endpoint
```

---

## 🚀 Phase 2: Making It Agentic (Field Auto-Population)

### What is an "Agentic" Chatbot?

An agentic chatbot can:
- **Listen** to user voice commands
- **Identify** form fields on the page
- **Extract** relevant data from speech
- **Fill** form fields automatically
- **Validate** and confirm entries
- **Trigger** next steps

### Implementation Steps

#### Step 1: Add Form Field Detection

```typescript
// src/services/formFieldDetector.ts
export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select'
  label: string
  value: string | null
  placeholder?: string
  required: boolean
  pattern?: RegExp
}

export function detectFormFields(): FormField[] {
  const fields: FormField[] = []
  
  // Detect all input fields on the page
  document.querySelectorAll('input, select, textarea').forEach((element) => {
    const field: FormField = {
      id: element.id || element.name || `field-${Math.random()}`,
      name: element.getAttribute('name') || element.id || '',
      type: (element.getAttribute('type') as FormField['type']) || 'text',
      label: document.querySelector(`label[for="${element.id}"]`)?.textContent || '',
      value: (element as HTMLInputElement).value || null,
      placeholder: element.getAttribute('placeholder') || undefined,
      required: element.hasAttribute('required'),
    }
    fields.push(field)
  })
  
  return fields
}

export function fillFormField(fieldId: string, value: any): boolean {
  const element = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null
  
  if (!element) return false
  
  element.value = value
  
  // Trigger change events for React/Vue state updates
  element.dispatchEvent(new Event('change', { bubbles: true }))
  element.dispatchEvent(new Event('input', { bubbles: true }))
  
  return true
}
```

#### Step 2: Enhance ChatbotContext for Field Actions

```typescript
// Update ChatbotContext.tsx - Add this action handler

export interface ChatbotContextType {
  // ... existing properties
  
  // New agentic methods
  fillFormField: (fieldName: string, value: string) => Promise<boolean>
  listFormFields: () => string[]
  confirmFieldFill: (fieldName: string, value: string) => Promise<void>
}

// Inside ChatbotProvider:
const fillFormField = useCallback(
  async (fieldName: string, value: string) => {
    const fields = detectFormFields()
    const field = fields.find(
      f => f.name.toLowerCase() === fieldName.toLowerCase() ||
           f.label.toLowerCase().includes(fieldName.toLowerCase())
    )
    
    if (!field) {
      // Ask user to clarify
      const userMessage: Message = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: `I couldn't find a field called "${fieldName}". Available fields are: ${fields.map(f => f.label || f.name).join(', ')}`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])
      return false
    }
    
    const success = fillFormField(field.id, value)
    
    if (success) {
      const confirmMessage: Message = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: `✅ I've filled in "${field.label || field.name}" with: ${value}. Say "next" to continue or "change that" to edit.`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, confirmMessage])
    }
    
    return success
  },
  []
)
```

#### Step 3: Update Backend to Handle Form Filling Commands

```python
# backend/app/services/agentic_handler.py

from enum import Enum
from typing import Optional

class IntentType(str, Enum):
    CHAT = "chat"
    FILL_FIELD = "fill_field"
    CONFIRM = "confirm"
    NEXT_STEP = "next_step"
    UNDO = "undo"

class AgenticRequest:
    intent: IntentType
    field_name: Optional[str] = None
    field_value: Optional[str] = None
    context: str
    language: str

async def process_agentic_request(request: AgenticRequest) -> dict:
    """
    Process user message and determine if it's a command (fill field, navigate)
    or a regular chat message
    """
    
    # Use Groq to understand intent
    intent = await detect_intent(request.message, request.language)
    
    if intent == IntentType.FILL_FIELD:
        # Extract field name and value from message
        field_info = await extract_field_info(request.message, request.language)
        return {
            "type": "action",
            "action": "fill_field",
            "field": field_info['field_name'],
            "value": field_info['field_value'],
            "response": f"I'll fill {field_info['field_name']} with {field_info['field_value']}"
        }
    
    elif intent == IntentType.NEXT_STEP:
        return {
            "type": "action",
            "action": "next_step",
            "response": "Moving to the next step..."
        }
    
    else:  # Regular chat
        response = await get_groq_response(request, request.language)
        return {
            "type": "chat",
            "response": response
        }
```

#### Step 4: Implement Natural Language Field Mapping

```python
# backend/app/services/field_mapper.py

FIELD_ALIASES = {
    # Email variations
    'email': ['email', 'email address', 'e-mail', 'mail', 'contact email'],
    
    # Name variations
    'full_name': ['full name', 'name', 'your name', 'name please'],
    
    # Password variations
    'password': ['password', 'enter password', 'pwd'],
    
    # Amount variations
    'loan_amount': ['loan amount', 'how much', 'amount needed', 'required amount'],
    
    # Income variations
    'annual_income': ['annual income', 'yearly income', 'income', 'salary'],
    
    # Project type
    'project_type': ['project type', 'business type', 'what business'],
}

async def extract_field_info(message: str, language: str) -> dict:
    """
    Extract field name and value from natural language message using Groq
    
    Example:
    Input: "My email is john@example.com"
    Output: {"field_name": "email", "field_value": "john@example.com"}
    """
    
    prompt = f"""
    Extract the form field and its value from this message: "{message}"
    
    Available fields: {list(FIELD_ALIASES.keys())}
    
    Respond with JSON: {{"field": "field_name", "value": "extracted_value"}}
    Only respond with valid JSON, nothing else.
    """
    
    response = await groq_client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    
    # Parse JSON response
    result = json.loads(response.choices[0].message.content)
    return result
```

#### Step 5: Add Voice Command Listener with Action Detection

```typescript
// src/hooks/useAgenticVoice.ts

import { useState, useCallback } from 'react'
import { useChatbot } from '../context/ChatbotContext'

export function useAgenticVoice() {
  const [isListening, setIsListening] = useState(false)
  const { sendMessage, fillFormField } = useChatbot()

  const startListening = useCallback(async () => {
    setIsListening(true)
    
    try {
      const transcript = await startSpeechRecognition('en')
      
      if (!transcript) {
        setIsListening(false)
        return
      }

      // Send to backend for intent detection
      const response = await fetch('/api/chatbot/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          context: 'form_filling',
        }),
      })

      const data = await response.json()

      if (data.type === 'action' && data.action === 'fill_field') {
        // Execute form field filling
        const success = await fillFormField(data.field, data.value)
        
        if (success) {
          // Speak confirmation
          await speakText(data.response, 'en')
        }
      } else if (data.type === 'chat') {
        // Regular chat response
        await sendMessage(transcript)
      }
    } finally {
      setIsListening(false)
    }
  }, [sendMessage, fillFormField])

  return { isListening, startListening }
}
```

#### Step 6: Create an Agentic Assistant Component

```typescript
// src/components/AgenticAssistant.tsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useAgenticVoice } from '../hooks/useAgenticVoice'

export default function AgenticAssistant() {
  const { isListening, startListening } = useAgenticVoice()
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success'>('idle')

  return (
    <motion.div
      className="fixed bottom-20 right-4 bg-white rounded-full shadow-lg p-4"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={startListening}
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
          isListening
            ? 'bg-red-500 text-white'
            : 'bg-accent-600 text-white hover:bg-accent-700'
        }`}
      >
        {status === 'success' ? (
          <CheckCircle size={24} />
        ) : status === 'processing' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic size={24} />
          </motion.div>
        ) : (
          <Mic size={24} />
        )}
      </button>
      
      <div className="mt-2 text-xs font-semibold text-neutral-600 text-center">
        {isListening ? 'Listening...' : 'Say command'}
      </div>
    </motion.div>
  )
}
```

---

## 🎤 Voice Command Examples

Once agentic mode is enabled:

### Filling Forms
```
User: "My email is john@example.com"
→ Chatbot: ✅ I've filled email with john@example.com

User: "Name is Rajesh Kumar"
→ Chatbot: ✅ I've filled full name with Rajesh Kumar

User: "I need fifty thousand"
→ Chatbot: ✅ I've filled loan amount with ₹50,000
```

### Navigation
```
User: "Next"
→ Chatbot: Moving to the next step...

User: "Go back"
→ Chatbot: Returning to the previous step...

User: "Show me available schemes"
→ Chatbot: Executing search query...
```

### Correction
```
User: "Change that"
→ Chatbot: What would you like to change?

User: "No, my income is 3 lakhs"
→ Chatbot: ✅ I've updated annual income to ₹3,00,000
```

---

## 🛠️ Implementation Roadmap

### Phase 1 ✅ (COMPLETED)
- Basic chatbot with screen context
- Voice input/output
- Multilingual support
- Message history

### Phase 2 (NEXT - Form Filling)
- [ ] Form field detection
- [ ] Intent recognition
- [ ] Field auto-population
- [ ] Confirmation flow
- [ ] Error handling

### Phase 3 (Navigation)
- [ ] Page navigation commands
- [ ] Step progression
- [ ] Data validation
- [ ] Undo/correction

### Phase 4 (Advanced)
- [ ] Complex multi-field scenarios
- [ ] Context memory across pages
- [ ] Machine learning intent detection
- [ ] User preference learning

---

## 📝 Backend Setup for Groq API

### 1. Get Groq API Key
```bash
# Visit https://console.groq.com and get your API key
export GROQ_API_KEY=your_key_here
```

### 2. Install Groq Python Library
```bash
cd backend
pip install groq
```

### 3. Create Chatbot Service
```python
# backend/app/services/groq_service.py

from groq import Groq

client = Groq()

async def get_groq_response(
    message: str,
    context: str,
    language: str,
    conversation_history: list
) -> str:
    """
    Get response from Groq API with context awareness
    """
    
    system_prompt = f"""You are UdyamSetu Assistant, a helpful guide for Indian entrepreneurs.

Current Screen Context:
{context}

Language: {language}
You should respond in {language}.

Rules:
- Be concise and helpful
- Provide actionable guidance
- Reference scheme details when relevant
- Always mention official next steps
- Never invent scheme information
- If unsure, ask for clarification"""

    messages = [
        {"role": "system", "content": system_prompt},
        *conversation_history,
        {"role": "user", "content": message}
    ]

    response = client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )

    return response.choices[0].message.content
```

### 4. Create API Endpoint
```python
# backend/app/api/chatbot.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.groq_service import get_groq_response

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

class ChatRequest(BaseModel):
    message: str
    context: str
    language: str
    history: list = []

@router.post("")
async def chat(request: ChatRequest):
    try:
        response = await get_groq_response(
            message=request.message,
            context=request.context,
            language=request.language,
            conversation_history=request.history
        )
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/intent")
async def detect_intent(request: ChatRequest):
    """Detect if message is a form-filling command or regular chat"""
    # Implementation for agentic intent detection
    pass
```

---

## 🔒 Security & Privacy Considerations

1. **Sensitive Data**: Don't send full bank account details to AI
2. **Validation**: Always validate field values before auto-filling
3. **Confirmation**: Always ask user to confirm before critical actions
4. **Audit**: Log all chatbot interactions for compliance
5. **Encryption**: Send data over HTTPS
6. **Rate Limiting**: Implement rate limits on API calls

---

## 📱 Testing Agentic Features

```typescript
// Test cases for agentic chatbot

describe('Agentic Chatbot', () => {
  test('should detect form fields on page', () => {
    // Render form
    // Call detectFormFields()
    // Assert all fields detected
  })

  test('should fill email field with voice input', async () => {
    // Mock speech recognition with "my email is test@example.com"
    // Assert email field filled
    // Assert confirmation message shown
  })

  test('should handle invalid field names', () => {
    // Try to fill non-existent field
    // Assert error message shown
    // Assert available fields listed
  })

  test('should validate field values', () => {
    // Try to fill email with invalid value
    // Assert validation error
  })
})
```

---

## 🚀 Performance Tips

1. **Lazy Load Speech Recognition**: Only load when voice button clicked
2. **Cache Form Fields**: Detect fields once, reuse
3. **Debounce Voice Input**: Prevent rapid successive calls
4. **Stream Responses**: Show Groq response as it streams
5. **Offline Fallback**: Show helpful tips when offline

---

## 📚 Resources

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Groq API Docs](https://console.groq.com/docs)
- [Form Handling React](https://react.dev/reference/react-dom/components/input)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

---

## ❓ FAQ

**Q: Will the chatbot work offline?**
A: Voice input will work offline, but Groq API calls require internet. Local fallback responses can be cached.

**Q: Can I customize voice commands?**
A: Yes! Update the `FIELD_ALIASES` mapping and train custom Groq prompts.

**Q: What if user voice is unclear?**
A: Implement confidence threshold. If < 70%, ask for clarification or text input.

**Q: Can it fill passwords safely?**
A: Yes, but implement extra validation. Never auto-fill authentication fields in production.

---

**Next Steps:**
1. Set up Groq API key in backend .env
2. Implement form field detection service
3. Add intent detection to backend
4. Create agentic voice hook
5. Test with sample forms
6. Deploy and monitor

Good luck! 🚀
