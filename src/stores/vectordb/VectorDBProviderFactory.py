from src.stores.vectordb.enums import VectorDBEnum
from src.helpers.config import Settings
from sqlalchemy.orm import sessionmaker
from src.controllers import BaseController
from .providers import QdrantDBProvider, PGVectorDBProvider


class VectorDBProviderFactory:
    def __init__(self, app_settings: Settings, db_client: sessionmaker = None):
        self.app_settings = app_settings
        self.db_client = db_client
        self.base_controller = BaseController(db_client=self.db_client)

    def create(self, provider: str, current_user, project_name: str = None):
        if provider == VectorDBEnum.QDRANT.value:
            return QdrantDBProvider(
                db_client=self.base_controller.get_database_path(
                    user_id=current_user.user_id, 
                    db_name=self.app_settings.VECTOR_DB_PATH,
                    project_name=project_name
                ),
                default_vector_size=self.app_settings.EMBEDDING_MODEL_SIZE,
                distance_method=self.app_settings.VECTOR_DB_DISTANCE_METHOD,
                index_threshold=self.app_settings.VECTOR_DB_PGVEC_INDEX_THRESHOLD  
            )
        elif provider == VectorDBEnum.PGVECTOR.value:
            return PGVectorDBProvider(
                db_client=self.db_client,
                default_vector_size=self.app_settings.EMBEDDING_MODEL_SIZE,
                distance_method=self.app_settings.VECTOR_DB_DISTANCE_METHOD,
                index_threshold=self.app_settings.VECTOR_DB_PGVEC_INDEX_THRESHOLD  
            )
        else:
            return None