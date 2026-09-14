from pydantic import BaseModel

class ProjectCreateRequest(BaseModel):
    title: str