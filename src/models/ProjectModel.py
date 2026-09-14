from fastapi import HTTPException, status
from src.models.enums import ResponseSignal
from src.models import BaseDataModel
from src.models.db.schemas import Project
from sqlalchemy.future import select
from sqlalchemy import func, delete
from src.models.ChatModel import ChatModel
from src.models.AssetModel import AssetModel
from src.models.ChunkModel import ChunkModel
from src.models.MessageModel import MessageModel


class ProjectModel(BaseDataModel):
    def __init__(self, current_user, db_client):
        super().__init__(current_user, db_client)

    
    @classmethod
    async def create_instance(cls, current_user, db_client):
        instance = cls(current_user,db_client)
        return instance


    async def get_project(self, project_name: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Project).where(Project.project_name == project_name, Project.owner_id == self.current_user.user_id)
                project = (await db.execute(statement)).scalars().first()

                if not project:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.PROJECT_NOT_FOUND.value)

                return project


    async def create_project(self, project: Project):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Project).where(Project.project_id == project.project_id)
                existed_project = (await db.execute(statement)).scalars().first()

                if existed_project:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.PROJECT_ALREADY_EXIST.value)

                db.add(project)

                await db.flush()
                await db.refresh(project) 

                return project

    
    async def get_all_user_projects(self, page:int = 1, total_documents_in_each_page:int = 10):
        """
            ### Pagination Way:-
            To get all projects, we need to make `pagination` to avoid
            the return of huge number of projects at one time 
            so the steps is:<br>
                - calculate the total number of documents(projects) we have <br>
                - calculate the total number of pages we have <br>
                - if there is a remainder, we need to add one more page to accommodate the remaining documents <br>
                - we need to skip the documents that we have already retrieved in the previous pages and limit the number of documents we retrieve in each page <br>
        """

        async with self.db_client() as db:
            async with db.begin():
                result = select(func.count(Project.project_id)).where(Project.owner_id == self.current_user.user_id)

                total_documents = (await db.execute(result)).scalars().first() or 0

                total_pages = total_documents // total_documents_in_each_page

                if total_documents % total_documents_in_each_page > 0:
                    total_pages += 1

                query = select(Project).where(Project.owner_id == self.current_user.user_id)\
                    .order_by(Project.created_at.desc())\
                    .offset((page - 1) * total_documents_in_each_page)\
                    .limit(total_documents_in_each_page)
                projects = (await db.execute(query)).scalars().all()

                return projects, total_pages, total_documents



    async def delete_project(self, project_name: str):
        chat_model = await ChatModel.create_instance(current_user=self.current_user, db_client=self.db_client)
        message_model = await MessageModel.create_instance(current_user=self.current_user, db_client=self.db_client)
        asset_model = await AssetModel.create_instance(current_user=self.current_user, db_client=self.db_client)
        chunk_model = await ChunkModel.create_instance(current_user=self.current_user, db_client=self.db_client)
        
        project = await self.get_project(project_name=project_name)
        chat = await chat_model.get_project_chat(project_id=project.project_id)

        async with self.db_client() as db:
            async with db.begin():
                chunks_deleted = await chunk_model.delete_chunks_by_project_id(project_id=project.project_id)
                assets_deleted = await asset_model.delete_assets_by_project_id(project_id=project.project_id)
                messages_deleted = await message_model.delete_chat_messages(chat_id=chat.chat_id)
                chat_deleted = await chat_model.delete_project_chat(project_id=project.project_id)

                statement = delete(Project).where(Project.project_name == project_name)
                project_deleted = await db.execute(statement)

                if not project_deleted.rowcount > 0:
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ResponseSignal.DELETE_DOCUMENT_FAILED.value)

            return project_deleted.rowcount, chat_deleted, messages_deleted, assets_deleted, chunks_deleted