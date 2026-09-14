from src.controllers import BaseController
from fastapi import HTTPException, status, Response
from sqlalchemy.future import select
from src.models.db.schemas import User
from src.routes.schemas import UserUpdate
from src.models.enums import ResponseSignal
import shutil
import os


class UserController(BaseController):
    def __init__(self, db_client, current_user):
        super().__init__(db_client)
        self.db_client = db_client
        self.current_user = current_user

    
    async def search_for_user(self, username: str):
        async with self.db_client() as db:
            statement = select(User).where(User.username.ilike(f"%{username}%"))
            result = await db.execute(statement)
            users = result.scalars().all()
            
            if not users:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                    detail=ResponseSignal.USER_NOT_FOUND.value)
                
            return users


    async def delete_user_account(self):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(User).where(User.user_id == self.current_user.user_id)
                user = (await db.execute(statement)).scalars().first() # get the logged in user

                if not user:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.USER_NOT_FOUND.value)

                await db.delete(user)

        
        user_folder_path = os.path.join(self.users_dir, str(self.current_user.user_id))

        if os.path.exists(user_folder_path) and os.path.isdir(user_folder_path):
            shutil.rmtree(path=user_folder_path)
            
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    
    async def update_user_data(self, new_data: UserUpdate):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(User).where(User.user_id == self.current_user.user_id)
                user = (await db.execute(statement)).scalars().first() # get the logged in user

                if not user:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.USER_NOT_FOUND.value)
        
                if new_data.email != user.email:
                    statement2 = select(User).where(User.email == new_data.email, User.user_id != user.user_id)
                    email_exists = (await db.execute(statement2)).scalars().first()

                    if email_exists:
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ResponseSignal.EMAIL_ALREADY_EXIST.value)

                
                user.username = new_data.username
                user.email = new_data.email

                return user