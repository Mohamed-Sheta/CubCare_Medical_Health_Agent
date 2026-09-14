from src.stores.vectordb import VectorDBInterface
from src.routes.schemas import RetrievedDocumentRespond
from qdrant_client import QdrantClient, models
from src.stores.vectordb.enums import DistanceMethodEnum
from fastembed import SparseTextEmbedding
from src.helpers.config import Settings
import logging

class QdrantDBProvider(VectorDBInterface):
    def __init__(
        self,
        db_client: str,
        default_vector_size: int = 384,
        distance_method: str = None,
        index_threshold: int = 1000
    ):
        super().__init__()
        self.client = None # main qdrant clint
        self.db_client = db_client  # we mean "db_path" here
        self.default_vector_size = default_vector_size
        self.distance_method = distance_method
        self.index_threshold = index_threshold

        if distance_method == DistanceMethodEnum.COSINE.value:
            self.distance_method = models.Distance.COSINE
        elif distance_method == DistanceMethodEnum.DOT.value:
            self.distance_method = models.Distance.DOT

        self.sparse_model = SparseTextEmbedding(
            model_name= Settings().SPARSE_TEXT_EMBEDDING_MODEL_NAME
        )

        self.logger = logging.getLogger("uvicorn.error")


    async def connect(self):
        self.client = QdrantClient(path=self.db_client)

    async def disconnect(self):
        self.client = None

    async def is_collection_exists(self, collection_name):
        return self.client.collection_exists(collection_name=collection_name)

    async def list_all_collections(self):
        return self.client.get_collections()

    async def get_collection_info(self, collection_name):
        return self.client.get_collection(collection_name=collection_name)

    async def create_collection(self, collection_name, embedding_size, do_reset = False):
        if do_reset:
            _ = await self.delete_collection(collection_name=collection_name)

        if not await self.is_collection_exists(collection_name=collection_name):
            self.logger.info(f"Creating new Qdrant collection: {collection_name}")
            _ = self.client.create_collection(
                collection_name=collection_name,

                vectors_config={
                    "dense": models.VectorParams(
                        size=embedding_size,
                        distance=self.distance_method
                    )
                },

                sparse_vectors_config={
                    "sparse": models.SparseVectorParams()
                }
            )
            return True
        
        return False


    async def delete_collection(self, collection_name):
        if await self.is_collection_exists(collection_name=collection_name):
            self.logger.info(f"Deleting collection {collection_name}")

            return self.client.delete_collection(collection_name=collection_name)


    async def insert_one(self, collection_name, text, vector, metadata = None, record_id = None):
        if not await self.is_collection_exists(collection_name=collection_name):
            self.logger.error(f"Can't insert new record to non-existed collection {collection_name}")
            return False

        try:
            sparse_vector = list(self.sparse_model.embed([text]))[0]

            _ = self.client.upload_points(
                collection_name=collection_name,
                points=[
                    models.PointStruct(
                        id=record_id,
                        vector={
                            "dense": vector,
                            "sparse": sparse_vector.as_object()
                        },
                        payload={
                            "text": text,
                            "metadata": metadata,
                        }
                    )
                ]
            )
        except Exception as e:
            self.logger.error(f"Error while inserting: {e}")
            return False
        
        return True


    async def insert_many(self, collection_name, texts, vectors, metadata = None, record_ids = None, batch_size = 50):
        if not await self.is_collection_exists(collection_name=collection_name):
            self.logger.error(f"Can't insert new record to non-existed collection {collection_name}")
            return False

        if len(texts) != len(vectors):
            self.logger.error("The number of texts and vectors must be identical.")
            return False

        if metadata is None:
            metadata = [None] * len(texts)

        if record_ids is None:
            record_ids = list(range(0,len(texts)))

        for i in range(0, len(texts), batch_size):
            batch_end = i + batch_size

            batch_text = texts[i:batch_end]
            batch_vectors = vectors[i:batch_end]
            batch_metadata = metadata[i:batch_end]
            batch_record_ids = record_ids[i:batch_end]

            batch_sparse_vectors = list(self.sparse_model.embed(batch_text))

            batch_points = [
                models.PointStruct(
                    id=batch_record_ids[i],
                    vector={
                        "dense": batch_vectors[i],
                        "sparse": batch_sparse_vectors[i].as_object()
                    },
                    payload={
                        "text": batch_text[i],
                        "metadata": batch_metadata[i],
                    }
                )
                for i in range(len(batch_text))
            ]

            try:
                self.client.upload_points(
                    collection_name=collection_name,
                    points=batch_points
                )
            except Exception as e:
                self.logger.error(f"Error while inserting batch: {e}")
                return False

        return True


    async def search_hybrid(self, collection_name: str, query: str, dense_vector: list, limit: int = 5):
        if not await self.is_collection_exists(collection_name=collection_name):
            return None

        try:
            sparse_vector = list(self.sparse_model.embed([query]))[0]

            results = self.client.query_points(
                collection_name=collection_name,
                prefetch=[
                    models.Prefetch(
                        query=dense_vector,
                        using="dense",
                        limit=10
                    ),

                    models.Prefetch(
                        query=sparse_vector.as_object(),
                        using="sparse",
                        limit=10
                    )
                ],

                query=models.FusionQuery(fusion=models.Fusion.RRF),
                limit=limit
            )

            if not results or len(results.points) == 0:
                return None

            return [
                RetrievedDocumentRespond(
                    **{
                        "text": point.payload.get("text", ""),
                        "score": point.score
                    }
                )
                for point in results.points
            ]
        except Exception as e:
            self.logger.error(f"Error during hybrid search in collection {collection_name}: {e}")
            return None