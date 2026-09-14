from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str

    FILE_ALLOWED_TYPES: List[str]
    FILE_MAX_SIZE: int
    FILE_DEFAULT_CHUNK_SIZE: int   


    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    POSTGRES_USERNAME: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DATABASE: str

    MCP_SERVER_URL: str


    GENERATION_MODEL_LITERAL: List[str]
    VECTOR_DB_BACKEND_LITERAL: List[str]

    EMBEDDING_BACKEND: str = None
    GENERATION_BACKEND: str = None
    EMBEDDING_MODEL_NAME: str = None
    GENERATION_MODEL_NAME: str = None
    GROQ_API_KEY: str = None

    EMBEDDING_MODEL_SIZE: int = None
    DEFAULT_INPUT_MAX_CHARACTERS: int = None
    DEFAULT_OUTPUT_MAX_CHARACTERS: int = None
    DEFAULT_GENERATION_TEMPERATURE: float = None


    VECTOR_DB_BACKEND: str
    VECTOR_DB_PATH: str
    VECTOR_DB_DISTANCE_METHOD: str
    VECTOR_DB_PGVEC_INDEX_THRESHOLD: int
    SPARSE_TEXT_EMBEDDING_MODEL_NAME: str = "Qdrant/bm25"

    VOICE_MODEL_PATH: str
    VOICE_BACKEND: str

    model_config = SettingsConfigDict(env_file="src/.env",env_file_encoding="utf-8")

def get_settings():
    return Settings()