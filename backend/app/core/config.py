from pydantic_settings import BaseSettings, SettingsConfigDict
import json


class Settings(BaseSettings):
    APP_NAME: str = "Automa Proyect API"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str
    BACKEND_CORS_ORIGINS: str = '["http://localhost:5173"]'

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def BACKEND_CORS_ORIGINS_list(self) -> list[str]:
        return json.loads(self.BACKEND_CORS_ORIGINS)


settings = Settings()
settings.BACKEND_CORS_ORIGINS = settings.BACKEND_CORS_ORIGINS_list