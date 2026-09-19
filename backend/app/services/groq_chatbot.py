"""
Groq Chatbot Service
Handles intelligent responses with context awareness for UdyamSetu
"""

import os
import json
import re
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


def _parse_json_object(content: str) -> Dict[str, str]:
    """Parse JSON even when a model wraps it in a markdown code fence or prose."""
    candidate = content.strip().replace("```json", "").replace("```", "").strip()
    match = re.search(r"\{.*\}", candidate, re.DOTALL)
    if not match:
        return {"intent": "chat", "details": "The model returned no structured intent"}
    try:
        parsed = json.loads(match.group(0))
    except json.JSONDecodeError:
        return {"intent": "chat", "details": "The model returned invalid structured intent"}
    intent = parsed.get("intent")
    if intent not in {"chat", "fill_field", "navigate", "question", "confirm"}:
        intent = "chat"
    return {"intent": intent, "details": str(parsed.get("details", ""))}


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
    
    normalized = message.strip().lower()
    named_value = re.search(r"\b(?:email|e-mail|name|full name|loan amount|amount|income|tenure|requirement)\b\s+(?:is|to|as)\s+\S+", normalized)
    amount_request = re.search(r"\b(?:i\s+)?need\b.*\d|\b(?:loan|amount)\b.*\d", normalized)
    if re.search(r"\b(my|the|set|fill|update|change)\b.+\b(is|to|as)\b", normalized) or named_value or amount_request or "@" in normalized:
        return {"intent": "fill_field", "details": "Message appears to provide a form value"}
    if not client:
        return {"intent": "chat", "details": "No AI client configured"}

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
        content = response.choices[0].message.content or ""
        return _parse_json_object(content)
        
    except Exception as e:
        # Intent detection is advisory. A malformed model response must not break chat.
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
    normalized_fields = {re.sub(r"[^a-z0-9]", "", field.lower()): field for field in available_fields}

    email = re.search(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", message)
    if email:
        field = next((original for key, original in normalized_fields.items() if "email" in key or "mail" in key), None)
        if field:
            return {"field": field, "value": email.group(0)}
    match = re.search(r"(?:my|the|set|fill|update|change)\s+(.+?)\s+(?:is|to|as)\s+(.+?)[.!?]*$", message, re.IGNORECASE)
    if match:
        requested, value = match.group(1).strip().lower(), match.group(2).strip()
        requested_key = re.sub(r"[^a-z0-9]", "", requested)
        field = next((original for key, original in normalized_fields.items() if requested_key in key or key in requested_key), None)
        if field and value:
            return {"field": field, "value": value}
    amount_match = re.search(r"(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|crore|crores)?", message, re.IGNORECASE)
    if amount_match and re.search(r"\b(need|loan|amount|income)\b", message, re.IGNORECASE):
        amount_field = next((original for key, original in normalized_fields.items() if "amount" in key or "income" in key), None)
        if amount_field:
            amount = float(amount_match.group(1).replace(",", ""))
            unit = (amount_match.group(2) or "").lower()
            if unit in {"lakh", "lakhs", "lac", "lacs"}:
                amount *= 100000
            elif unit in {"crore", "crores"}:
                amount *= 10000000
            return {"field": amount_field, "value": str(int(amount) if amount.is_integer() else amount)}
    if not client:
        return {"field": None, "value": None}
    
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


async def process_agentic_request(message: str, available_fields: List[str], language: str = "en") -> Dict[str, Optional[str]]:
    """Classify a safe browser action. The browser validates and performs every fill."""
    if not available_fields:
        return {"type": "chat", "action": None, "field": None, "value": None}
    intent = await detect_intent(message, language)
    if intent.get("intent") != "fill_field":
        return {"type": "chat", "action": None, "field": None, "value": None}
    extracted = await extract_field_info(message, available_fields, language)
    if extracted.get("field") and extracted.get("value"):
        return {"type": "action", "action": "fill_field", "field": extracted["field"], "value": extracted["value"]}
    return {"type": "chat", "action": None, "field": None, "value": None}


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
