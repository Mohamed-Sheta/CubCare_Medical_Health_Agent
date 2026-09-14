from fastapi import HTTPException, status
from src.models.enums import ResponseSignal
from src.models import BaseDataModel
from src.models.db.schemas import Message
from sqlalchemy.future import select
from sqlalchemy import delete, func
from sqlalchemy.dialects.postgresql import UUID


class MessageModel(BaseDataModel):
    def __init__(self, current_user, db_client):
        super().__init__(current_user, db_client)

    @classmethod
    async def create_instance(cls, current_user, db_client):
        instance = cls(current_user=current_user, db_client=db_client)
        return instance


    async def create_message(self, message: Message):
        async with self.db_client() as db:
            async with db.begin():
                db.add(message)
            await db.commit()
            await db.flush(message)
            await db.refresh(message)

        return message


    async def get_chat_messages(self, chat_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Message).where(Message.chat_id == chat_id)
                messages = (await db.execute(statement)).scalars().all()

                return messages


    async def get_last_chat_messages(self, chat_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Message).where(Message.chat_id == chat_id)\
                            .order_by(Message.message_order.desc()).limit(6)
                
                result = await db.execute(statement)
                messages = result.scalars().all()
                
                return messages[::-1] # Reverse the list so the oldest of the six is first, and the newest is last


    async def get_paginated_chat_messages(self, chat_id: UUID, page: int = 1, page_size: int = 20):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Message).where(Message.chat_id == chat_id)\
                            .order_by(Message.message_order.desc())\
                            .offset((page - 1) * page_size)\
                            .limit(page_size)
                
                result = await db.execute(statement)
                messages = result.scalars().all()
                
                return messages[::-1]


    async def get_total_message_count(self, chat_id: UUID):
        async with self.db_client() as db:
            async with db.begin(): 
                statement = select(func.count(Message.message_id)).where(Message.chat_id == chat_id) 
                messages_count = (await db.execute(statement)).scalars().first() 

                return messages_count if messages_count is not None else 0
                

    async def delete_chat_messages(self, chat_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = delete(Message).where(Message.chat_id == chat_id)
                deleted_messages = await db.execute(statement)

                if not deleted_messages:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.MESSAGES_NOT_FOUND.value)
        
                return deleted_messages.rowcount