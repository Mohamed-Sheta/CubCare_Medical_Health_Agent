from src.helpers.config import get_settings
from sqlalchemy.orm import sessionmaker
from src.models.db.schemas import User

class BaseDataModel:
    def __init__(self, current_user: User, db_client: sessionmaker):
        self.db_client = db_client
        self.current_user = current_user
        self.app_settings = get_settings()