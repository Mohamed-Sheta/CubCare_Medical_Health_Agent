from pydantic import BaseModel
from typing import Optional

class IndexPushRequest(BaseModel):
    do_reset: Optional[int] = 0