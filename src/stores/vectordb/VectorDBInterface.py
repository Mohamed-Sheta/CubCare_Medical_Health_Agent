from abc import ABC, abstractmethod
from src.routes.schemas import RetrievedDocumentRespond
from typing import List

class VectorDBInterface(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def disconnect(self):
        pass

    @abstractmethod
    async def is_collection_exists(self, collection_name: str) -> bool:
        pass

    @abstractmethod
    async def list_all_collections(self) -> list:
        pass

    @abstractmethod
    async def get_collection_info(self, collection_name: str) -> dict:
        pass

    @abstractmethod
    async def create_collection(self, collection_name: str, embedding_size: int, do_reset: bool = False):
        pass

    @abstractmethod
    async def delete_collection(self, collection_name: str):
        pass

    @abstractmethod
    async def insert_one(self, collection_name: str, text: str, vector: list, metadata: dict = None, record_id: str = None):
        pass

    @abstractmethod
    async def insert_many(self, collection_name: str, texts: list, vectors: list, metadata: list = None, record_ids: list = None, batch_size: int = 50):
        pass

    @abstractmethod
    async def search_hybrid(self, collection_name: str, query: str, dense_vector: list, limit: int = 5) -> List[RetrievedDocumentRespond]:
        pass