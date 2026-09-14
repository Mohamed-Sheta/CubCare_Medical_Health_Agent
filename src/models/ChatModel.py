from fastapi import HTTPException, status
from src.models.enums import ResponseSignal
from src.models import BaseDataModel
from src.models.db.schemas import Chat
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import UUID


class ChatModel(BaseDataModel):
    def __init__(self, current_user, db_client):
        super().__init__(current_user, db_client)

    @classmethod
    async def create_instance(cls, current_user, db_client):
        instance = cls(current_user=current_user, db_client=db_client)
        return instance


    async def get_project_chat(self, project_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chat).where(Chat.project_id == project_id)
                chat = (await db.execute(statement)).scalars().first()

                if not chat:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.CHAT_NOT_FOUND.value)

                return chat


    async def get_chat_summary(self, chat: Chat):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chat.summary).where(Chat.chat_id == chat.chat_id)
                chat_summary = (await db.execute(statement)).scalars().first()

                return chat_summary


    async def create_chat(self, chat: Chat):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chat).where(Chat.chat_id == chat.chat_id)
                existed_chat = (await db.execute(statement)).scalars().first()

                if existed_chat:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.CHAT_ALREADY_EXISTED.value)

                db.add(chat)
                await db.flush()
                await db.refresh(chat) 
                
                return chat


    async def delete_project_chat(self, project_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = delete(Chat).where(Chat.project_id == project_id)
                deleted_chat = await db.execute(statement)

                if not deleted_chat:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.CHAT_NOT_FOUND.value)
        
                return deleted_chat.rowcount

    
    async def update_chat_title(self, chat_id: UUID, new_title: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chat).where(Chat.chat_id == chat_id)
                chat = (await db.execute(statement)).scalars().first()

                if not chat:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.CHAT_NOT_FOUND.value)

                chat.title = new_title

                return chat.title

    async def update_chat_summary(self, chat_id: UUID, new_summary: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chat).where(Chat.chat_id == chat_id)
                chat = (await db.execute(statement)).scalars().first()

                if not chat:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.CHAT_NOT_FOUND.value)

                chat.summary = new_summary

                return chat.summary