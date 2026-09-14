from fastapi import HTTPException, status
from .BaseController import BaseController
from ..models.enums import ResponseSignal
import os
import shutil


class DeleteController(BaseController):
    def __init__(self, db_client, current_user):
        super().__init__(db_client)
        self.current_user = current_user

    def delete_project(self, project_name: str):
        project_path = self.get_project_path(user_id=self.current_user.user_id, project_name=project_name)

        if not project_path or not os.path.exists(project_path): 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.PROJECT_NOT_FOUND.value)

        try:
            if os.path.isdir(project_path):
                shutil.rmtree(project_path)  # Deletes folder and all its contents
            else:
                os.remove(project_path)      # Deletes file if it's a loose file
        except PermissionError:
            # Catch Windows locking errors if a file inside is currently open
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ResponseSignal.FILE_LOCKED_OR_IN_USE.value)


    def delete_database(self, project_name: str):
        database_path = self.get_database_path(
            user_id=self.current_user.user_id,
            db_name=self.app_settings.VECTOR_DB_PATH,
            project_name=project_name
        )

        if os.path.exists(database_path):
            try:
                if os.path.isdir(database_path):
                    shutil.rmtree(database_path)
                else:
                    os.remove(database_path)
            except PermissionError:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ResponseSignal.FILE_LOCKED_OR_IN_USE.value)