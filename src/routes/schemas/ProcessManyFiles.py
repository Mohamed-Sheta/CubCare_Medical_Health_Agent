from pydantic import BaseModel
from typing import Optional

class ProcessManyFiles(BaseModel):
    chunk_size: Optional[int] = 100
    overlap_size: Optional[int] = 20
    do_reset: Optional[int] = 0