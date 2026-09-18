# UdyamSetu Chatbot - Quick Start Guide

## 🎯 What's New

A **context-aware, multilingual AI chatbot** that:
- ✅ Appears on every page (floating button)
- ✅ Understands the current screen/page context
- ✅ Provides screen-specific guidance
- ✅ Supports voice input (🎤) and voice output (🔊)
- ✅ Works in English, Hindi, and Marathi
- ✅ Integrates with Groq API for intelligent responses
- ✅ Matches the polished dashboard design

---

## 🚀 Getting Started

### 1. Frontend Setup (Already Done ✅)

The frontend chatbot component is **already fully implemented** with:

- `ChatbotContext.tsx` - State management
- `ContextAwareChatbot.tsx` - UI component
- `useChatbotContext.ts` - Screen detection hook
- Updated `App.tsx` to include chatbot on all pages

**No additional frontend code needed!**

### 2. Backend Setup (Required)

#### Step 1: Get Groq API Key
```bash
# Go to: https://console.groq.com
# 1. Sign up (free tier available)
# 2. Navigate to API Keys
# 3. Create a new API key
# 4. Copy the key
```

#### Step 2: Update Backend Environment
```bash
cd backend

# Add to .env file:
GROQ_API_KEY=your_groq_api_key_here
```

#### Step 3: Install Dependencies
```bash
pip install groq
```

#### Step 4: Create Chatbot Service

Create `backend/app/services/groq_service.py`:

```python
from groq import Groq
from typing import Optional

client = Groq()

async def get_groq_response(
    message: str,
    context: str,
    language: str,
    history: list
) -> str:
    """
    Get intelligent response from Groq API with screen context
    """
    
    lang_name = {
        'en': 'English',
        'hi': 'Hindi', 
        'mr': 'Marathi'
    }.get(language, 'English')
    
    system_prompt = f"""You are UdyamSetu Assistant - a friendly guide for Indian entrepreneurs.

CURRENT PAGE CONTEXT:
{context}

RESPOND IN: {lang_name}

INSTRUCTIONS:
- Be helpful and concise (max 2-3 sentences)
- Guide users based on the current page
- Provide actionable next steps
- If unsure, ask clarifying questions
- NEVER invent scheme details or rules
- ALWAYS refer to official sources when relevant"""

    messages = [
        {"role": "system", "content": system_prompt},
        *history,
        {"role": "user", "content": message}
    ]

    try:
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=messages,
            max_tokens=300,
            temperature=0.7,
            top_p=0.9,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        return "I'm having trouble connecting. Please try again."
```

#### Step 5: Create API Endpoint

Create `backend/app/api/chatbot_routes.py`:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services.groq_service import get_groq_response

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    context: str
    language: str
    history: List[Message] = []

@router.post("")
async def chat(request: ChatRequest):
    """Main chatbot endpoint"""
    
    try:
        # Convert history to dict format for Groq
        history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        response = await get_groq_response(
            message=request.message,
            context=request.context,
            language=request.language,
            history=history
        )
        
        return {"response": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Check if chatbot service is working"""
    return {"status": "ok"}
```

#### Step 6: Add Route to Main App

Update `backend/app/main.py`:

```python
from .api import chatbot_routes

# Add this to your app setup:
app.include_router(chatbot_routes.router)
```

### 3. Update Frontend API Service

Update `frontend/src/services/api.ts`:

```typescript
// Find this line (around line 50):
// const API_BASE = process.env.VITE_API_BASE || 'http://localhost:8000'

// The chatbot already sends requests to '/api/chatbot'
// It will use this base automatically
```

### 4. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Visit: http://localhost:5174
```

---

## 💬 Using the Chatbot

### 1. Open Chatbot
- Click the **blue circle** with message icon in bottom-right
- Chatbot opens with welcome message

### 2. Text Chat
- Type your question
- Click Send (or press Enter)
- Get intelligent response based on current page

### 3. Voice Input
- Click the **microphone icon**
- Speak your question
- Chatbot listens and processes
- Get response

### 4. Voice Output
- Toggle **"Voice ON"** button
- Turn on text-to-speech responses
- Chatbot will speak all responses

### 5. Change Language
- Click language dropdown (English/हिन्दी/मराठी)
- Select preferred language
- All responses now in that language

---

## 📍 Screen Context Examples

### Login Page
```
User: "How do I sign in?"
Chatbot: "Enter your registered email and password. If you forgot your password, click 'Forgot Password' or create a new account."
```

### Signup Page
```
User: "What password should I use?"
Chatbot: "Use a strong password with at least 6 characters. Mix uppercase, lowercase, numbers, and symbols for better security."
```

### Requirement Input
```
User: "What should I write?"
Chatbot: "Tell me about your need - what business or education are you looking for? Include the amount and annual income if possible."
```

### Scheme Recommendation
```
User: "Why was this scheme recommended?"
Chatbot: "This scheme matches your profile because: your requested amount fits the limit, your project type is supported, and your income qualifies."
```

### EMI Calculator
```
User: "How is EMI calculated?"
Chatbot: "EMI = (Loan Amount × Interest Rate) / (1 - (1 + Interest Rate)^-Tenure). Adjust the sliders to see different scenarios."
```

---

## 🎯 Screen Detection Map

The chatbot automatically detects and responds based on:

| Page | Context | Example Help |
|------|---------|--------------|
| `/login` | Sign-in help | Password recovery, account creation |
| `/signup` | Account creation | Password requirements, verification |
| `/onboarding/language` | Language selection | Available languages |
| `/onboarding/need` | Need selection | Business vs Education vs Other |
| `/onboarding/requirement` | Input collection | What details to provide |
| `/onboarding/profile` | Profile review | Confirm extracted data |
| `/home` | Dashboard | Journey overview, next steps |
| `/home/scheme-recommendations` | Scheme selection | Why schemes match |
| `/home/emi-calculator` | Finance planning | EMI calculations |
| `/home/partner-locator` | Find partners | Partner authorization, distance |
| `/home/official-action` | Final step | Next official steps |

---

## 🚀 Testing the Chatbot

### Test 1: Basic Chat
```
1. Go to http://localhost:5174/login
2. Click chatbot icon
3. Type: "How do I sign in?"
4. Should get helpful login guidance
```

### Test 2: Voice Input
```
1. Click microphone icon
2. Say: "My name is John Doe"
3. Should appear in input box
4. Click Send
```

### Test 3: Language Switch
```
1. Click language dropdown
2. Select "हिन्दी"
3. Type: "क्या मैं मदद पा सकता हूँ?"
4. Should get response in Hindi
```

### Test 4: Screen Context
```
1. Go to /home/emi-calculator
2. Ask: "How do I calculate EMI?"
3. Should get EMI-specific guidance
4. Go to /home/partner-locator
5. Ask: "How do I find a partner?"
6. Should get partner-specific guidance
```

---

## 🐛 Troubleshooting

### Chatbot not showing?
- Check console for errors: `F12` → Console tab
- Verify chatbot icon appears (blue circle, bottom-right)
- Refresh page if needed

### Groq API not responding?
```bash
# Check API key is set
echo $GROQ_API_KEY

# Test Groq connection
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.groq.com/health
```

### Voice not working?
- Check browser permissions: Settings → Microphone
- Ensure HTTPS or localhost for web speech API
- Try different browser (Chrome, Edge work best)

### Responses are generic?
- Ensure screen context hook is running
- Check network tab to verify `/api/chatbot` calls
- Verify Groq API key is valid

---

## 🔐 Security Notes

1. **API Key**: Never commit `.env` files with API keys
2. **User Data**: Don't send sensitive info to chatbot without consent
3. **Rate Limiting**: Implement limits to prevent API abuse
4. **Data Retention**: Delete chat history after sessions
5. **GDPR/Privacy**: Inform users about data usage

---

## 📊 Analytics & Monitoring

Track chatbot usage:

```python
# backend/app/db/models.py

class ChatbotInteraction(Base):
    __tablename__ = "chatbot_interactions"
    
    id: int = Column(Integer, primary_key=True)
    user_id: str
    screen_path: str
    user_message: str
    bot_response: str
    language: str
    was_helpful: Optional[bool]
    created_at: datetime
```

---

## 🎨 Customization

### Change Colors
Update in `frontend/src/components/ContextAwareChatbot.tsx`:
```typescript
// Find: bg-accent-600
// Change to your preferred color
```

### Add More Languages
Update in `ChatbotContext.tsx` and add language to:
```typescript
const languageLabels = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  // Add more: gu: 'ગુજરાતી'
}
```

### Change Groq Model
In `groq_service.py`:
```python
response = client.chat.completions.create(
    model="mixtral-8x7b-32768",  # Change this
    # Other options: "llama-2-70b", "neural-chat-7b"
)
```

---

## 📚 Next Steps

### Phase 2: Agentic Chatbot (Form Filling)
See `CHATBOT_IMPLEMENTATION_GUIDE.md` for detailed implementation of:
- Automatic form field detection
- Voice-to-field filling
- Command recognition
- Multi-step workflows

### Phase 3: Advanced Features
- User preference learning
- Conversation context across pages
- Custom training on scheme data
- Integration with OCR for document assistance

---

## 💡 Pro Tips

1. **Screen Context Awareness**: Chatbot automatically knows what page you're on
2. **Conversation Memory**: It remembers previous messages in same session
3. **Multilingual Flexibility**: Switch languages mid-conversation
4. **Voice Accessibility**: Perfect for low-bandwidth or accessibility needs
5. **Mobile Friendly**: Works on all devices with touch support

---

## 🤝 Support

Issues or questions?

1. Check console errors: `F12` → Console
2. Verify backend is running: `http://localhost:8000/docs`
3. Test Groq API separately with their dashboard
4. Review implementation guide: `CHATBOT_IMPLEMENTATION_GUIDE.md`

---

## 📝 Summary

| Component | Status | Location |
|-----------|--------|----------|
| Chatbot UI | ✅ Complete | `components/ContextAwareChatbot.tsx` |
| Context Detection | ✅ Complete | `hooks/useChatbotContext.ts` |
| State Management | ✅ Complete | `context/ChatbotContext.tsx` |
| Voice Support | ✅ Complete | Uses Web Speech API |
| Backend API | ⏳ TODO | Implement chatbot routes |
| Groq Integration | ⏳ TODO | Create groq_service.py |
| Agentic Features | 🔜 Next Phase | See implementation guide |

---

**Ready to chat? Start your frontend and test it out!** 🚀

```bash
cd frontend
npm run dev
# → http://localhost:5174
```
