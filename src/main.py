from fastapi import FastAPI 
from src.routes import auth_router, user_router, data_router, nlp_router, project_router, message_router
from src.helpers import get_settings, limiter 
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession 
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from src.stores import LLMProviderFactory, TemplateParser, VectorDBProviderFactory, SummaryTemplateParser, VoiceProviderFactory

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler


app = FastAPI() 
settings = get_settings() 

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware( 
    SessionMiddleware, 
    secret_key=settings.SECRET_KEY 
) 

async def startup_span(): 
    postgres_conn = f"postgresql+asyncpg://{settings.POSTGRES_USERNAME}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DATABASE}" 
    
    app.db_engine = create_async_engine(url=postgres_conn) 
    
    app.db_client = sessionmaker( 
        bind=app.db_engine, 
        autoflush=False, 
        autocommit=False, 
        class_=AsyncSession, 
        expire_on_commit=False 
    )

    # LLM & VectorDB Provider Factories
    llm_provider_factory = LLMProviderFactory(app_settings=settings)
    app.vectordb_provider_factory = VectorDBProviderFactory(app_settings=settings, db_client=app.db_client)
    voice_provider_factory = VoiceProviderFactory(app_settings=settings)

    # embedding client
    app.embedding_client = llm_provider_factory.create(provider=settings.EMBEDDING_BACKEND)
    app.embedding_client.set_embedding_model(model_name=settings.EMBEDDING_MODEL_NAME, embedding_size=settings.EMBEDDING_MODEL_SIZE)

    # generation client
    app.generation_client = llm_provider_factory.create(provider=settings.GENERATION_BACKEND)
    app.generation_client.set_generation_model(model_name=settings.GENERATION_MODEL_NAME)

    # voice client
    app.voice_transcription_client = voice_provider_factory.create(provider=settings.VOICE_BACKEND)

    # template parser
    app.template_parser = TemplateParser()

    # summary template parser
    app.summary_template_parser = SummaryTemplateParser()


async def shutdown_span(): 
    await app.db_engine.dispose() 

app.on_event("startup")(startup_span) 
app.on_event("shutdown")(shutdown_span)


app.state.limiter = limiter
app.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(data_router)
app.include_router(nlp_router)
app.include_router(project_router)
app.include_router(message_router)