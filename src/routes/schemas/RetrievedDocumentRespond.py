from pydantic import BaseModel

class RetrievedDocumentRespond(BaseModel):
    text: str
    score: float