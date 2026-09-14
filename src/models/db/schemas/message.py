from src.models.db.schemas.base import Base
from sqlalchemy import Column, Integer, DateTime, func, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Message(Base):
    __tablename__="messages"

    message_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, unique=True, default=uuid.uuid4)

    role = Column(String, nullable=False)
    content = Column(String, nullable=False)
    message_order = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.chat_id", onupdate="CASCADE"), nullable=False)

    chat = relationship("Chat", back_populates="messages")

    __table_args__ = (
        Index("ix_chat_id", chat_id),
    )