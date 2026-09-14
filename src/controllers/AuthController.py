from .BaseController import BaseController
from fastapi import HTTPException, status, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from src.models.enums import ResponseSignal
from src.auth import oauth
from src.routes import schemas
from src.models.db.schemas import User
from src.utils import hash_password, verify_password
from sqlalchemy import select


class AuthController(BaseController):
    def __init__(self, db_client):
        super().__init__(db_client)
        self.db_client = db_client


    async def login(self, credentials_data: OAuth2PasswordRequestForm):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(User).where(User.email == credentials_data.username)
                user = (await db.execute(statement)).scalars().first()

                if not user:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=ResponseSignal.INVALID_CREDENTIALS.value)
                    
                if not verify_password(credentials_data.password, user.password):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=ResponseSignal.INVALID_CREDENTIALS.value)

                # create token
                access_token = self.auth_handler.create_access_token(data={"user_id":str(user.user_id)})
                
                # return token
                return {
                    "access_token": access_token,
                    "token_type": "bearer"
                }


    async def register(self, user_data:schemas.UserCreate):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(User).where(User.email == user_data.email)
                is_user_exist = (await db.execute(statement)).scalars().first()

                if is_user_exist:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=ResponseSignal.ACCOUNT_ALREADY_EXIST.value)
                
                new_user = User(**user_data.dict())
                new_user.password = hash_password(new_user.password)
                db.add(new_user)
                await db.flush()

            await db.refresh(new_user)
            
        return new_user



    async def google_login(self, request: Request):
        return await oauth.google.authorize_redirect(
            request,
            self.app_settings.GOOGLE_REDIRECT_URI,
            prompt="select_account"
        )



    async def google_callback(self, request: Request):
        # 1. Exchange authorization code with Google
        token = await oauth.google.authorize_access_token(request)

        # 2. Get Google user information
        user_info = token.get("userinfo") or {}

        if not user_info.get("sub") or not user_info.get("email"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=ResponseSignal.INVALID_CREDENTIALS.value,)

        google_id = user_info["sub"]
        email = user_info["email"]
        username = user_info.get("name") or email.split("@", 1)[0]

        # 3. Find user
        async with self.db_client() as db:
            async with db.begin():
                statement = select(User).where(User.google_id == google_id)
                user = (await db.execute(statement)).scalars().first()

                if not user:
                    statement = select(User).where(User.email == email)
                    user = (await db.execute(statement)).scalars().first()

                # 4. User doesn't exist
                if not user:
                    user = User(username=username, email=email, google_id=google_id, password=None)
                    db.add(user)
                    await db.flush()

                else:
                    user.google_id = google_id

        # 5. Create YOUR JWT
        access_token = self.auth_handler.create_access_token(
            data={
                "user_id": str(user.user_id),
                "user_email": user.email,
            }
        )
        
        # 6. Return YOUR JWT
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    