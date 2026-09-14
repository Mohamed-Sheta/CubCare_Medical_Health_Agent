from src.controllers import BaseController
from fastapi import UploadFile, HTTPException, status
from src.models.enums import ResponseSignal
import re
import os

class UploadController(BaseController):
    def __init__(self, db_client, current_user):
        super().__init__(db_client)
        self.db_client = db_client
        self.current_user = current_user
        self.size_scale = 1048576

    
    def verify_uploaded_file(self, file:UploadFile):
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=ResponseSignal.FILE_NAME_ERROR.value)
        
        if file.content_type not in self.app_settings.FILE_ALLOWED_TYPES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=ResponseSignal.FILE_TYPE_NOT_SUPPORTED.value)

        if file.size > (self.app_settings.FILE_MAX_SIZE * self.size_scale):
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,detail=ResponseSignal.FILE_SIZE_EXCEEDED.value)

        return True


    def get_clean_file_name(self, orig_file_name: str):
        # remove any special characters, except underscore and .
        cleaned_file_name = re.sub(r'[^\w.]', '', orig_file_name.strip())

        # replace spaces with underscore
        cleaned_file_name = cleaned_file_name.replace(" ", "_")

        return cleaned_file_name


    def generate_unique_file_path(self, orig_file_name: str, project_name: str):
        project_path = self.get_project_path(user_id=self.current_user.user_id, project_name=project_name)

        random_key = self.generate_random_string()
        cleaned_file_name = self.get_clean_file_name(orig_file_name=orig_file_name)

        new_file_path = os.path.join(project_path, random_key+'_'+cleaned_file_name)

        while os.path.exists(new_file_path):
            random_key = self.generate_random_string()
            new_file_path = os.path.join(project_path, random_key+'_'+cleaned_file_name)

        return new_file_path, random_key+'_'+cleaned_file_name   # new file path , file_name