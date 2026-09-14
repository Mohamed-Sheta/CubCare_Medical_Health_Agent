from src.models import BaseDataModel
from src.models.db.schemas import Chunk
from sqlalchemy.future import select
from sqlalchemy import delete, func
from sqlalchemy.dialects.postgresql import UUID

class ChunkModel(BaseDataModel):
    def __init__(self, current_user, db_client):
        super().__init__(current_user, db_client)

    @classmethod
    async def create_instance(cls, current_user, db_client):
        instance = cls(current_user=current_user, db_client=db_client)
        return instance


    async def create_chunk(self, chunk: Chunk):
        async with self.db_client() as db:
            async with db.begin():
                db.add(chunk)
            await db.commit()
            await db.flush(chunk)
            await db.refresh(chunk) 

        return chunk


    async def get_project_chunks(self, project_id: UUID, page: int = 1, total_chunks_in_page: int = 50):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Chunk).where(Chunk.chunk_project_id == project_id)\
                                     .offset((page - 1) * total_chunks_in_page)\
                                     .limit(total_chunks_in_page) 
                chunks = (await db.execute(statement)).scalars().all() 

                return chunks

    
    async def delete_chunks_by_project_id(self, project_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = delete(Chunk).where(Chunk.chunk_project_id == project_id)
                deleted_chunks = await db.execute(statement)
            await db.commit()

        return deleted_chunks.rowcount


    async def get_total_chunks_count(self, project_id: UUID):
        async with self.db_client() as db: 
            async with db.begin(): 
                statement = select(func.count(Chunk.chunk_id)).where(Chunk.chunk_project_id == project_id) 
                chunks_count = (await db.execute(statement)).scalars().first() 

                return chunks_count if chunks_count is not None else 0


    async def insert_many_chunks(self, chunks: list, batch_size: int = 100):
        async with self.db_client() as db:
            async with db.begin():
                for i in range(0, len(chunks), batch_size):
                    batch = chunks[i: i + batch_size]
                    db.add_all(batch)
            return len(chunks)