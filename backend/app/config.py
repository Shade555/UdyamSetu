from functools import lru_cache
import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "UdyamSetu API"
    environment: str = "development"
    supabase_url: str
    supabase_service_key: str
    groq_api_key: str = ""
    indic_tts_url: str = ""
    indic_tts_api_key: str = ""
    frontend_url: str = "http://localhost:5174"
    api_url: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "..", "..", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
