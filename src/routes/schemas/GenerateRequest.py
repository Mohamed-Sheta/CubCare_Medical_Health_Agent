from pydantic import BaseModel
from typing import Optional

class GenerateRequest(BaseModel):
    text: str
    limit: Optional[int] = 3