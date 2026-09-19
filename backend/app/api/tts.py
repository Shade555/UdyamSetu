"""Authenticated server-side proxy for the optional Indic TTS service."""

import json
from typing import Literal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from ..config import get_settings

router = APIRouter(prefix="/api/tts", tags=["tts"])


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=600)
    language: Literal["en", "hi", "mr"]


@router.post("")
def synthesize_speech(payload: TTSRequest) -> Response:
    """Proxy audio from Indic TTS without exposing its API key to the browser."""
    settings = get_settings()
    if not settings.indic_tts_url or not settings.indic_tts_api_key:
        raise HTTPException(status_code=503, detail="Indic TTS is not configured")

    request = Request(
        settings.indic_tts_url,
        data=json.dumps(payload.model_dump()).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-API-Key": settings.indic_tts_api_key},
        method="POST",
    )
    try:
        with urlopen(request, timeout=180) as upstream:
            audio = upstream.read()
            media_type = upstream.headers.get_content_type()
    except HTTPError as error:
        # A sleeping/expired Colab runtime is an expected transient condition. The
        # frontend will fall back to browser speech instead of treating it as a chat failure.
        raise HTTPException(status_code=503, detail=f"Indic TTS temporarily unavailable (upstream HTTP {error.code})") from error
    except URLError as error:
        raise HTTPException(status_code=503, detail="Indic TTS is unavailable") from error

    if not audio or not media_type.startswith("audio/"):
        raise HTTPException(status_code=503, detail="Indic TTS returned invalid audio")
    return Response(content=audio, media_type=media_type, headers={"Cache-Control": "private, max-age=86400"})
