from pydantic import BaseModel

class UpdateChatTitleRequest(BaseModel):
    title: str