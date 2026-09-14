from src.models.db.schemas.base import Base
from sqlalchemy import Column, DateTime,func, String, ForeignKey, Index
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Chat(Base):
    __tablename__="chats"
    chat_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, unique=True, default=uuid.uuid4)
    
    title = Column(String, nullable=False)
    summary = Column(String, nullable=True, default="")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.project_id", onupdate="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="chat")
    messages = relationship("Message", back_populates="chat")


    @validates("title")
    def validate_title(self, key, value):
        if not value or not value.strip():
            raise ValueError("Chat title cannot be empty or whitespace only.")
        return value.strip()


    __table_args__ = (
        Index("ix_project_id", project_id),
    )