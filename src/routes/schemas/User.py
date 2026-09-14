from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username: str
    email: EmailStr


class UserSearch(BaseModel):
    username: str


class UserRespond(BaseModel):
    user_id: UUID
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True