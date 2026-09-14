from fastapi import Depends, HTTPException, status, Request
from fastapi.security.oauth2 import OAuth2PasswordBearer
from sqlalchemy.future import select
from src.models.db.schemas import User
from src.helpers.config import get_settings
from src.models.enums import ResponseSignal
from datetime import datetime , timedelta
from sqlalchemy.orm import sessionmaker
from jose import jwt, JWTError
from src.routes import schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/auth/login')

class AuthHandler:
    def __init__(self, db_client: sessionmaker):
        self.settings = get_settings()
        self.db_client = db_client

        self.secret_key = self.settings.SECRET_KEY
        self.algorithm = self.settings.ALGORITHM
        self.access_token_expire_minutes = self.settings.ACCESS_TOKEN_EXPIRE_MINUTES


    def create_access_token(self, data: dict):
        to_encode = data.copy()

        expire = datetime.now() + timedelta(minutes=self.access_token_expire_minutes)

        to_encode.update({"exp":expire})

        jwt_token = jwt.encode(to_encode, key=self.secret_key, algorithm=self.algorithm)

        return jwt_token


    def verify_access_token(self, token: str, credentials_exception):
        try:
            payload = jwt.decode(token, key=self.secret_key, algorithms=[self.algorithm])
            user_id = payload.get("user_id")

            if user_id is None:
                raise credentials_exception
    
            token_data = schemas.TokenData(id=user_id)

        except JWTError:
            raise credentials_exception

        return token_data


    async def get_user(self, token: str):
        credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ResponseSignal.INVALID_CREDENTIALS.value, headers={"WWW-Authenticate":"Bearer"})
        
        token_data = self.verify_access_token(token , credentials_exception)

        async with self.db_client() as db:
            async with db.begin(): 
                statement = select(User).where(User.user_id == token_data.id)
                user = (await db.execute(statement)).scalars().first()

                if user is None:
                    raise credentials_exception
                
                return user


async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    auth_handler = AuthHandler(db_client=request.app.db_client)

    return await auth_handler.get_user(token)