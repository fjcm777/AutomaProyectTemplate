import json
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[3]
ENV_PATH = ROOT_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_NAME: str = "Automa Proyect API"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str
    BACKEND_CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"]
    )

    # Always read the root `.env` so local and Docker workflows behave the same.
    model_config = SettingsConfigDict(env_file=str(ENV_PATH), extra="ignore")

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return json.loads(value)
        raise TypeError("BACKEND_CORS_ORIGINS must be a JSON list or list[str].")


settings = Settings()
