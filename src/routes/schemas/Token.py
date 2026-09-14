from uuid import UUID
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        from_attributes = True



class TokenData(BaseModel):
    id: UUID|None = None