from src.stores.vectordb import VectorDBInterface
from src.stores.vectordb.enums import PgVectorTableSchemaEnum, PgVectorIndexTypeEnum, PgVectorDistanceMethodEnum, DistanceMethodEnum
from src.routes.schemas import RetrievedDocumentRespond
from sqlalchemy.sql import text
import logging
import json


class PGVectorDBProvider(VectorDBInterface):
    def __init__(
        self,
        db_client: str,
        default_vector_size: int = 384,
        distance_method: str = None,
        index_threshold: int = 1000
    ):
        super().__init__()
        self.db_client = db_client
        self.default_vector_size = default_vector_size
        self.distance_method = distance_method
        self.index_threshold = index_threshold

        self.pgvector_table_prefix = PgVectorTableSchemaEnum._PREFIX.value

        self.default_index_name = lambda x: f"{x}_vector_idx"

        if distance_method == DistanceMethodEnum.COSINE.value:
            self.distance_method = PgVectorDistanceMethodEnum.COSINE.value
        elif distance_method == DistanceMethodEnum.DOT.value:
            self.distance_method = PgVectorDistanceMethodEnum.DOT.value

        self.logger = logging.getLogger("uvicorn.error")


    async def connect(self):
        async with self.db_client() as db:
            async with db.begin():
                await db.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            await db.commit()


    async def disconnect(self):
        pass


    async def is_collection_exists(self, collection_name: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = text(f"SELECT * FROM pg_tables WHERE tablename = :collection_name")
                table = await db.execute(statement, {"collection_name": collection_name})
                record = table.scalars().first()

                return record is not None


    async def list_all_collections(self):
        async with self.db_client() as db:
            async with db.begin():
                statement = text(f"SELECT tablename FROM pg_tables WHERE tablename LIKE :prefix")
                table = await db.execute(statement, {"prefix": self.pgvector_table_prefix})
                records = table.scalars().all()

        return records


    async def get_collection_info(self, collection_name: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = text(
                                """
                                    SELECT schemaname, tablename, tableowner, tablespace, hasindexes
                                    FROM pg_tables
                                    WHERE tablename = :collection_name
                                """
                            )

                count_sql_statement = text(f"SELECT COUNT(*) FROM {collection_name}")

                table_info_result = await db.execute(statement, {"collection_name":collection_name})
                record_count_result = await db.execute(count_sql_statement)

                info = table_info_result.fetchone()
                count = record_count_result.scalar()

                if not info:
                    return None

                return {
                    "table_info": {
                        "schemaname": info[0],
                        "tablename": info[1],
                        "tableowner": info[2],
                        "tablespace": info[3],
                        "hasindexes": info[4],
                    },
                    "record_count": count
                }


    async def create_collection(self, collection_name: str, embedding_size: int, do_reset: bool = False):
        if do_reset:
            await self.delete_collection(collection_name=collection_name)

        is_collection_existed = await self.is_collection_exists(collection_name=collection_name) 
        
        if not is_collection_existed: 
            self.logger.info("Creating collection")
            async with self.db_client() as db:
                async with db.begin():
                    statement = text(f"""
                                        CREATE TABLE {collection_name} (
                                        {PgVectorTableSchemaEnum.ID.value} bigserial PRIMARY KEY,
                                        {PgVectorTableSchemaEnum.TEXT.value} text, 
                                        {PgVectorTableSchemaEnum.VECTOR.value} vector({embedding_size}), 
                                        {PgVectorTableSchemaEnum.METADATA.value} jsonb DEFAULT '{{}}', 
                                        {PgVectorTableSchemaEnum.CHUNK_ID.value} integer, 
                                        FOREIGN KEY ({PgVectorTableSchemaEnum.CHUNK_ID.value})
                                        REFERENCES chunks(chunk_id) ON DELETE CASCADE
                                    """)
                    
                    await db.execute(statement) 
            return True
        return False


    async def is_index_existed(self, collection_name: str) -> bool:
        index_name = self.default_index_name(collection_name)

        async with self.db_client() as db:
            async with db.begin():
                statement = text(
                                """
                                    SELECT 1
                                    FROM pg_indexes
                                    WHERE tablename = :collection_name
                                    AND indexname = :index_name
                                """)
                result = await db.execute(statement, {"collection_name": collection_name, "index_name": index_name})

                return result.scalars().first() is not None


    async def create_vector_index(self, collection_name: str, index_type: str = PgVectorIndexTypeEnum.HNSW.value):
        is_index_existed = await self.is_index_existed(collection_name=collection_name)

        if is_index_existed:
            return False

        async with self.db_client() as db:
            async with db.begin():
                statement = text(f"SELECT COUNT(*) FROM {collection_name}")
                count = (await db.execute(statement)).scalars().first()

                if count < self.index_threshold:
                    return False  # No index needed

                self.logger.info(f"START: Creating vector index for collection: {collection_name}")

                index_name = self.default_index_name(collection_name)
                statement2 = text(
                                f"""
                                    CREATE INDEX {index_name} ON {collection_name}
                                    USING {index_type}({PgVectorTableSchemaEnum.VECTOR.value} {self.distance_method})
                                """)
                await db.execute(statement2)

                self.logger.info(f"END: Creating vector index for collection: {collection_name}")


    async def reset_vector_index(self, collection_name: str, index_type: str = PgVectorIndexTypeEnum.HNSW.value) -> bool:
        index_name = self.default_index_name(collection_name)

        async with self.db_client() as db:
            async with db.begin():
                statement = text(f"DROP INDEX IF EXISTS {index_name}")
                await db.execute(statement)

        return await self.create_vector_index(collection_name=collection_name, index_type=index_type)


    async def delete_collection(self, collection_name: str):
        is_collection_existed = await self.is_collection_exists(collection_name=collection_name) 

        if not is_collection_existed:
            return False

        async with self.db_client() as db:
            async with db.begin():
                self.logger.info(f"Deleting collection {collection_name}")

                statement = text(f"DROP TABLE IF EXISTS {collection_name}")
                await db.execute(statement)
                await db.commit()

        return True


    async def insert_one(self, collection_name, text, vector, metadata = None, record_id = None):
        is_collection_existed = await self.is_collection_exists(collection_name=collection_name) 

        if not is_collection_existed: 
            self.logger.error(f"Can't insert new record to non-existed collection: {collection_name}") 
            return False 

        if not record_id: 
            self.logger.error(f"Can't insert new record without chunk_id: {record_id}") 
            return False 

        async with self.db_client() as db: 
            async with db.begin(): 
                statement = text(f"""
                                    INSERT INTO {collection_name}
                                    (
                                        {PgVectorTableSchemaEnum.TEXT.value}, 
                                        {PgVectorTableSchemaEnum.VECTOR.value}, 
                                        {PgVectorTableSchemaEnum.METADATA.value}, 
                                        {PgVectorTableSchemaEnum.CHUNK_ID.value} 
                                    )
                                    VALUES
                                    (
                                        :text,
                                        :vector,
                                        :metadata,
                                        :chunk_id
                                    )
                                """)
                await db.execute( 
                    statement, 
                    { 
                        "text": text, 
                        "vector": f"[{','.join(str(v) for v in vector)}]", 
                        "metadata": json.dumps(metadata, ensure_ascii=False) if metadata is not None else "{}", 
                        "chunk_id": record_id, 
                    }, 
                ) 

        await self.create_vector_index(collection_name=collection_name) 
        return True


    async def insert_many(self, collection_name, texts, vectors, metadata = None, record_ids = None, batch_size = 50):
        is_collection_existed = await self.is_collection_exists(collection_name=collection_name) 

        if not is_collection_existed: 
            self.logger.error(f"Can't insert new record to non-existed collection: {collection_name}") 
            return False 

        if len(vectors) != len(record_ids): 
            self.logger.error(f"Invalid Data items for collection: {collection_name}") 
            return False 

        if not metadata or len(metadata) == 0: 
            metadata = [None] * len(texts) 

        if not record_ids or len(record_ids) == 0: 
            self.logger.error("Can't insert new record without chunk_ids") 
            return False 

        async with self.db_client() as db: 
            async with db.begin(): 
                for i in range(0, len(texts), batch_size): 
                    batch_texts = texts[i : i+batch_size] 
                    batch_vectors = vectors[i : i+batch_size] 
                    batch_metadata = metadata[i : i+batch_size] 
                    batch_record_ids = record_ids[i : i+batch_size] 
                    
                    values = [] 
                    for _text, _vector, _metadata, _record_id in zip(batch_texts, batch_vectors, batch_metadata, batch_record_ids): 
                        values.append({ 
                            "text": _text, 
                            "vector": f"[{','.join(str(v) for v in _vector)}]", 
                            "metadata": json.dumps(_metadata, ensure_ascii=False) if _metadata is not None else "{}", 
                            "chunk_id": _record_id 
                        }) 
                        
                    batch_insert_sql = text(f""" 
                        INSERT INTO {collection_name} ( 
                            {PgVectorTableSchemaEnum.TEXT.value}, 
                            {PgVectorTableSchemaEnum.VECTOR.value}, 
                            {PgVectorTableSchemaEnum.METADATA.value}, 
                            {PgVectorTableSchemaEnum.CHUNK_ID.value} 
                        ) VALUES ( :text, :vector, :metadata, :chunk_id ) 
                    """) 
                    await db.execute(batch_insert_sql, values) 
                    
        await self.create_vector_index(collection_name=collection_name) 
        return True


    async def search_hybrid(self, collection_name: str, query: str, dense_vector: list, limit: int = 5):
        if not await self.is_collection_exists(collection_name=collection_name):
            return None

        candidate_limit = 10

        async with self.db_client() as db:
            async with db.begin():

                statement = text(f"""
                    WITH dense_results AS (
                        SELECT
                            chunk_id,
                            text,
                            metadata,
                            ROW_NUMBER() OVER (
                                ORDER BY vector <=> CAST(:vector AS vector)
                            ) AS rank
                        FROM {collection_name}
                        ORDER BY vector <=> CAST(:vector AS vector)
                        LIMIT :candidate_limit
                    ),

                    keyword_results AS (
                        SELECT
                            chunk_id,
                            text,
                            metadata,
                            ROW_NUMBER() OVER (
                                ORDER BY ts_rank(
                                    to_tsvector('english', text),
                                    plainto_tsquery('english', :query)
                                ) DESC
                            ) AS rank
                        FROM {collection_name}
                        WHERE to_tsvector('english', text)
                            @@ plainto_tsquery('english', :query)
                        ORDER BY ts_rank(
                            to_tsvector('english', text),
                            plainto_tsquery('english', :query)
                        ) DESC
                        LIMIT :candidate_limit
                    ),

                    rrf_results AS (
                        SELECT
                            COALESCE(d.chunk_id, k.chunk_id) AS chunk_id,
                            COALESCE(d.text, k.text) AS text,
                            COALESCE(d.metadata, k.metadata) AS metadata,

                            COALESCE(1.0 / (60 + d.rank), 0) +
                            COALESCE(1.0 / (60 + k.rank), 0) AS score

                        FROM dense_results d
                        FULL OUTER JOIN keyword_results k
                            ON d.chunk_id = k.chunk_id
                    )

                    SELECT *
                    FROM rrf_results
                    ORDER BY score DESC
                    LIMIT :limit
                """)

                result = await db.execute(
                    statement,
                    {
                        "vector": f"[{','.join(str(v) for v in dense_vector)}]",
                        "query": query,
                        "candidate_limit": candidate_limit,
                        "limit": limit
                    }
                )

                records = result.mappings().all()

        if not records:
            return None

        return [
            RetrievedDocumentRespond(
                text=record["text"],
                score=record["score"]
            )
            for record in records
        ]