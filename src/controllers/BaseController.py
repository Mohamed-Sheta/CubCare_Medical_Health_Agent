from fastapi import HTTPException, status
from sqlalchemy.orm import sessionmaker
from src.helpers.config import get_settings
from src.models.enums import ResponseSignal
from src.auth.oauth2 import AuthHandler
import uuid
import os
import random
import string


class BaseController:
    def __init__(self, db_client: sessionmaker):
        self.db_client = db_client
        self.app_settings = get_settings()
        self.auth_handler = AuthHandler(db_client=self.db_client)
        self.src_dir = os.path.dirname(os.path.dirname(__file__))
        self.file_dir = os.path.join(self.src_dir, "assets/files")
        self.users_dir = os.path.join(self.file_dir, "users")
        self.database_dir = os.path.join(self.src_dir, "assets/database")


    def get_project_path(self, user_id: uuid.UUID, project_name: str):
        project_path = os.path.join(self.users_dir, str(user_id) + "_" + project_name)

        if not os.path.exists(project_path):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=ResponseSignal.NO_FILES_ERROR.value,)

        return project_path


    def get_user_projects_paths(self, user_id: uuid.UUID):
        user_projects_path = os.listdir(os.path.join(self.users_dir, str(user_id)))
        
        if not user_projects_path:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.PROJECT_NOT_FOUND.value)
            
        projects_paths = [os.path.join(self.users_dir, f"{str(user_id)}_{project_path}") for project_path in user_projects_path]
        
        return projects_paths


    def create_project(self, user_id: uuid.UUID, project_name: str):
        project_path = os.path.join(self.users_dir, str(user_id) + "_" + project_name)

        if os.path.exists(project_path):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=ResponseSignal.PROJECT_ALREADY_EXIST.value,)

        os.makedirs(project_path, exist_ok=True)

        return project_path


    def get_database_path(self, user_id: uuid.UUID, db_name: str, project_name: str = None):
        if project_name:
            folder_name = f"{str(user_id)}_{project_name}_{db_name}"
        else:
            folder_name = f"{str(user_id)}_{db_name}"

        database_path = os.path.join(self.database_dir, folder_name)

        if not os.path.exists(database_path):
            os.makedirs(database_path, exist_ok=True)

        return database_path


    def generate_random_string(self, length: int = 12) -> str:
        return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))