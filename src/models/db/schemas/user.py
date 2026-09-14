from src.models.db.schemas.base import Base
from sqlalchemy import Column, String, DateTime, func, Index
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID
import uuid
import re

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

class User(Base):
    __tablename__="users"

    user_id = Column(UUID(as_uuid=True),primary_key=True, nullable=False, unique=True, default=uuid.uuid4)
    
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=True)
    google_id = Column(String,unique=True,nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    projects = relationship("Project", back_populates="user")


    @validates("username")
    def validate_username(self, key, value):
        if not value or len(value.strip()) < 6:
            raise ValueError("Username must be at least 6 characters long.")
        return value.strip()

    @validates("email")
    def validate_email(self, key, value):
        if not value:
            raise ValueError("Email address is required.")
        
        cleaned_email = value.strip().lower()
        if not EMAIL_REGEX.match(cleaned_email):
            raise ValueError("Invalid email format.")
        return cleaned_email

    __table_args__ = (
        Index("ix_user_id", user_id),
    )
    