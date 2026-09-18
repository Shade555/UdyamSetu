"""
Groq Chatbot Service
Handles intelligent responses with context awareness for UdyamSetu
"""

import os
import json
from typing import List, Dict, Optional
from groq import Groq
from pydantic import BaseModel

# Initialize Groq client - load from env or settings
groq_api_key = os.getenv("GROQ_API_KEY", "")
if not groq_api_key:
    # Try to import from settings
    try:
        from ..config import get_settings
        groq_api_key = get_settings().groq_api_key
    except:
        pass

if not groq_api_key:
    print("WARNING: GROQ_API_KEY not set - chatbot will not work")
    client = None
else:
    client = Groq(api_key=groq_api_key)


class Message(BaseModel):
    """Chat message model"""
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Chatbot request model"""
    message: str
    context: str
    language: str = "en"  # "en", "hi", "mr"
    history: List[Message] = []


class ChatResponse(BaseModel):
    """Chatbot response model"""
    response: str
    language: str
    success: bool


async def get_groq_response(
    message: str,
    context: str,
    language: str = "en",
    history: List[Dict] = None,
) -> str:
    """
    Get intelligent response from Groq API with screen context awareness
    
    Args:
        message: User's message
        context: Current screen context description
        language: Language code (en, hi, mr)
        history: Conversation history
    
    Returns:
        Response string from Groq API
    """
    
    if not client:
        return "Chatbot service is not configured. Please set GROQ_API_KEY."
    
    if history is None:
        history = []
    
    # Language names for system prompt
    lang_name_map = {
        "en": "English",
        "hi": "Hindi",
        "mr": "Marathi",
    }
    lang_name = lang_name_map.get(language, "English")
    
    # Build comprehensive system prompt
    system_prompt = f"""You are UdyamSetu Assistant - a friendly, knowledgeable guide for Indian entrepreneurs seeking financial assistance and education loans.

## CURRENT PAGE CONTEXT:
{context}

## LANGUAGE:
Respond in {lang_name} (language code: {language})

## RULES:
1. **Be concise**: Keep responses to 2-3 sentences maximum
2. **Be helpful**: Provide actionable guidance based on the page context
3. **Be honest**: Never invent scheme details or financial terms
4. **Be accurate**: Refer to official information when relevant
5. **Be conversational**: Use natural, friendly language
6. **Be clear**: Avoid jargon; explain terms simply
7. **Redirect appropriately**: Guide users to next steps
8. **Avoid**: Making final lending decisions or guarantees

## ABOUT UDYAMSETU:
- Purpose: Help SC beneficiaries find suitable credit/education schemes
- Schemes: Term loans, micro-finance, educational loans (up to ₹50L)
- Interest rates: Typically 6.5% to 15% depending on scheme
- Partners: Banks, NBFC-MFIs, SCAs (State Channelizing Agencies)
- Benefits: Concessional rates, flexible repayment, government support

## IF USER ASKS ABOUT:
- **Eligibility**: Direct to profile check and official guidelines
- **Interest rates**: Mention ranges but reference official sources
- **Documents**: List what's typically needed, suggest verification with partner
- **Partners**: Explain authorization and location-based search
- **Applications**: Emphasize official application process with verified partners

## TONE:
- Warm and encouraging (government scheme for underserved population)
- Professional but approachable
- Empowering (help them find paths, don't create obstacles)
- Trustworthy (never overpromise, always verify with officials)"""
    
    # Prepare messages for Groq
    messages = [
        {"role": "system", "content": system_prompt},
    ]
    
    # Add conversation history if provided
    if history:
        for msg in history:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    
    # Add current user message
    messages.append({"role": "user", "content": message})
    
    try:
        # Call Groq API with optimal settings for context-aware responses
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            max_tokens=300,
            temperature=0.7,
            top_p=0.9,
        )
        
        # Extract and return response
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback response
        return "I'm having trouble connecting to the service. Could you please try again in a moment?"


async def detect_intent(
    message: str,
    language: str = "en",
) -> Dict[str, str]:
    """
    Detect user's intent (for future agentic features)
    
    Args:
        message: User message
        language: Language code
    
    Returns:
        Dictionary with intent type and details
    """
    
    intent_prompt = f"""Analyze this message in {language} and return JSON with:
{{"intent": "chat|fill_field|navigate|question|confirm", "details": "brief explanation"}}

Message: "{message}"

Return ONLY valid JSON, no other text."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": intent_prompt}],
            max_tokens=100,
            temperature=0.3,  # Low temperature for consistency
        )
        
        # Parse JSON response
        content = response.choices[0].message.content.strip()
        return json.loads(content)
        
    except Exception as e:
        print(f"Intent detection error: {e}")
        return {"intent": "chat", "details": "default"}


async def extract_field_info(
    message: str,
    available_fields: List[str],
    language: str = "en",
) -> Dict[str, str]:
    """
    Extract form field and value from natural language (for agentic features)
    
    Args:
        message: User message
        available_fields: List of form field names
        language: Language code
    
    Returns:
        Dictionary with field name and extracted value
    """
    
    fields_str = ", ".join(available_fields)
    
    extraction_prompt = f"""Extract form field information from this {language} message:
"{message}"

Available fields: {fields_str}

Return JSON: {{"field": "field_name", "value": "extracted_value"}}
Return ONLY valid JSON, nothing else."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": extraction_prompt}],
            max_tokens=100,
            temperature=0.3,
        )
        
        content = response.choices[0].message.content.strip()
        return json.loads(content)
        
    except Exception as e:
        print(f"Field extraction error: {e}")
        return {"field": None, "value": None}


async def get_guidance_for_page(
    page_path: str,
    language: str = "en",
) -> str:
    """
    Generate brief guidance message for a specific page
    
    Args:
        page_path: URL path of current page
        language: Language code
    
    Returns:
        Guidance text for the page
    """
    
    guidance_prompt = f"""Generate a brief, helpful welcome message for a user on this page:
Page: {page_path}
Language: {language}

Keep it to 1-2 sentences, friendly and encouraging.
Example: "Welcome to the scheme selection page. I can help you understand which scheme is best for you."
"""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": guidance_prompt}],
            max_tokens=100,
            temperature=0.7,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Guidance generation error: {e}")
        return "Hello! I'm here to help. What would you like to know?"
