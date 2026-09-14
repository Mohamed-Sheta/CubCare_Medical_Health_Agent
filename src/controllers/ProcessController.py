from .BaseController import BaseController
from langchain_community.document_loaders import TextLoader, PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.models.enums import FileExtensionEnum
import os
import logging

logger = logging.getLogger("uvicorn.error")

class ProcessController(BaseController):
    def __init__(self, db_client, current_user, project_name: str):
        super().__init__(db_client)
        self.db_client = db_client
        self.current_user = current_user
        self.project_name = project_name
        self.project_path = self.get_project_path(user_id=str(self.current_user.user_id), project_name=self.project_name)

    
    def get_file_extenstion(self, file_name: str):
        return os.path.splitext(file_name)[-1].lower()

    
    def get_file_loader(self, file_name: str):
        ext = self.get_file_extenstion(file_name=file_name)
        file_path = os.path.join(self.project_path, file_name)

        if not os.path.exists(file_path):
            return None

        if ext == FileExtensionEnum.TXT.value:
            return TextLoader(file_path=file_path, encoding="utf-8")

        if ext == FileExtensionEnum.PDF.value:
            return PyMuPDFLoader(file_path=file_path)

        return None

    
    def get_file_content(self, file_name: str):
        loader = self.get_file_loader(file_name=file_name)

        if not loader:
            return None

        return loader.load()


    def process_file_content(self, file_content: list, chunk_size: int = 200, overlap_size: int = 20):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=overlap_size,
            length_function=len,
        )

        chunks = text_splitter.split_documents(file_content)        
        return chunks