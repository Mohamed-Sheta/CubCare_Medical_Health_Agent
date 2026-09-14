from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from src.controllers import AuthController
from src.routes import schemas
from src.models.enums import ResponseSignal
from src.helpers import limiter

auth_router = APIRouter(
    prefix="/api/v1/auth",
    tags=["api_v1","auth"]
)


@auth_router.post('/login', response_model= schemas.Token, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def login(request: Request, credentials_data: OAuth2PasswordRequestForm = Depends()):
    auth_controller = AuthController(db_client=request.app.db_client)

    result = await auth_controller.login(credentials_data=credentials_data)

    if not result:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=ResponseSignal.INVALID_CREDENTIALS.value)

    return result


@auth_router.post('/register', response_model=schemas.UserRespond, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute, 10/hour")
async def register(request: Request, user_data: schemas.UserCreate):
    auth_controller = AuthController(db_client=request.app.db_client)

    user = await auth_controller.register(user_data=user_data)

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=ResponseSignal.INVALID_CREDENTIALS.value)

    return user


@auth_router.get("/google/login")
@limiter.limit("5/minute")
async def google_login(request: Request):
    auth_controller = AuthController(db_client=request.app.db_client)

    return await auth_controller.google_login(request=request)


@auth_router.get("/google/callback")
async def google_callback(request: Request):
    auth_controller = AuthController(db_client=request.app.db_client)

    return await auth_controller.google_callback(request)