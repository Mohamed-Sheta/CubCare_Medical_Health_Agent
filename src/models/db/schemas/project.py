from src.models.db.schemas.base import Base
from sqlalchemy import Column, String, DateTime, func, ForeignKey, Index
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Project(Base):
    __tablename__="projects"

    project_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, unique=True, default=uuid.uuid4)

    project_name = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False) 
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", onupdate="CASCADE"), nullable=False)

    user = relationship("User", back_populates="projects")
    chat = relationship("Chat", back_populates="project", uselist=False)
    assets = relationship("Asset", back_populates="project")
    chunks = relationship("Chunk", back_populates="project")


    @validates("project_name")
    def validate_project_name(self, key, value):
        if not value or not value.strip():
            raise ValueError("Project name cannot be empty or whitespace only.")
        return value.strip()


    __table_args__ = (
        Index("ix_owner_id", owner_id),
    )
    