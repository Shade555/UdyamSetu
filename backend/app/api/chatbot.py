"""
Chatbot API Routes
Endpoints for the context-aware multilingual chatbot
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging

from ..services.groq_chatbot import (
    get_groq_response,
    detect_intent,
    extract_field_info,
    ChatRequest,
    ChatResponse,
)

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


class Message(BaseModel):
    """Message model for conversation history"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[int] = None


class ChatQueryRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    context: str
    language: str = "en"
    history: List[Message] = []


class ChatQueryResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str
    language: str
    timestamp: int


class IntentRequest(BaseModel):
    """Request for intent detection"""
    message: str
    language: str = "en"


class IntentResponse(BaseModel):
    """Response for intent detection"""
    intent: str
    details: str


class FieldExtractionRequest(BaseModel):
    """Request for field extraction"""
    message: str
    available_fields: List[str]
    language: str = "en"


class FieldExtractionResponse(BaseModel):
    """Response for field extraction"""
    field: Optional[str]
    value: Optional[str]


# ============================================================================
# MAIN CHAT ENDPOINT
# ============================================================================

@router.post("", response_model=ChatQueryResponse)
async def chat(request: ChatQueryRequest):
    """
    Main chatbot endpoint - Get intelligent responses with context awareness
    
    Args:
        request: ChatQueryRequest containing:
            - message: User's message
            - context: Current screen context
            - language: Language code (en, hi, mr)
            - history: Conversation history
    
    Returns:
        ChatQueryResponse with:
            - response: Generated response
            - language: Response language
            - timestamp: Response timestamp
    
    Example:
        ```json
        {
            "message": "How do I calculate EMI?",
            "context": "You are on the EMI Calculator page...",
            "language": "en",
            "history": []
        }
        ```
    """
    
    try:
        # Validate input
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        if request.language not in ["en", "hi", "mr"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported language. Use 'en', 'hi', or 'mr'"
            )
        
        # Convert message history to dict format for service
        history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        # Get response from Groq
        logger.info(f"Processing chat request: lang={request.language}, context_len={len(request.context)}")
        
        response = await get_groq_response(
            message=request.message,
            context=request.context,
            language=request.language,
            history=history
        )
        
        logger.info(f"Generated response: {response[:50]}...")
        
        return ChatQueryResponse(
            response=response,
            language=request.language,
            timestamp=int(datetime.now().timestamp() * 1000)  # milliseconds
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat: {str(e)}"
        )


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@router.get("/health")
async def health_check():
    """
    Check if chatbot service is operational
    
    Returns:
        Status information including Groq API connectivity
    """
    try:
        # Test Groq connectivity with minimal call
        test_response = await get_groq_response(
            message="OK",
            context="Testing",
            language="en",
            history=[]
        )
        
        return {
            "status": "ok",
            "service": "groq_chatbot",
            "timestamp": int(datetime.now().timestamp()),
            "groq_connected": True
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "error",
            "service": "groq_chatbot",
            "timestamp": int(datetime.now().timestamp()),
            "groq_connected": False,
            "error": str(e)
        }


# ============================================================================
# INTENT DETECTION ENDPOINT (For Agentic Features)
# ============================================================================

@router.post("/intent", response_model=IntentResponse)
async def detect_user_intent(request: IntentRequest):
    """
    Detect user's intent from their message
    
    Used for future agentic features like form filling and navigation
    
    Args:
        request: IntentRequest containing:
            - message: User's message
            - language: Language code
    
    Returns:
        IntentResponse with:
            - intent: Type of intent (chat, fill_field, navigate, question, confirm)
            - details: Brief explanation of detected intent
    
    Example intents:
        - "chat": Regular conversation
        - "fill_field": User wants to fill a form field
        - "navigate": User wants to go to next/previous step
        - "question": User asking specific question
        - "confirm": User confirming action
    """
    
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        logger.info(f"Detecting intent for message: {request.message[:50]}...")
        
        intent = await detect_intent(
            message=request.message,
            language=request.language
        )
        
        return IntentResponse(**intent)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Intent detection error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting intent: {str(e)}"
        )


# ============================================================================
# FIELD EXTRACTION ENDPOINT (For Agentic Features)
# ============================================================================

@router.post("/extract-field", response_model=FieldExtractionResponse)
async def extract_field_value(request: FieldExtractionRequest):
    """
    Extract form field name and value from natural language
    
    Used for voice-based form filling in agentic mode
    
    Args:
        request: FieldExtractionRequest containing:
            - message: User's natural language input
            - available_fields: List of available form fields
            - language: Language code
    
    Returns:
        FieldExtractionResponse with:
            - field: Detected field name (or None if not found)
            - value: Extracted value (or None if not found)
    
    Example:
        Input: "My email is john@example.com"
        Available fields: ["email", "password", "name"]
        Output: {"field": "email", "value": "john@example.com"}
    """
    
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        if not request.available_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Available fields list cannot be empty"
            )
        
        logger.info(f"Extracting field from: {request.message[:50]}...")
        
        result = await extract_field_info(
            message=request.message,
            available_fields=request.available_fields,
            language=request.language
        )
        
        return FieldExtractionResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Field extraction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting field: {str(e)}"
        )


# ============================================================================
# STATISTICS ENDPOINT
# ============================================================================

@router.get("/stats")
async def get_chatbot_stats():
    """
    Get chatbot usage statistics
    
    Returns:
        Statistics about chatbot usage (for monitoring)
    """
    
    # This is a placeholder - implement with your database
    return {
        "total_messages": 0,
        "active_sessions": 0,
        "supported_languages": ["en", "hi", "mr"],
        "last_updated": int(datetime.now().timestamp())
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@router.options("/{path:path}")
async def cors_preflight(path: str):
    """Handle CORS preflight requests"""
    return {"status": "ok"}
