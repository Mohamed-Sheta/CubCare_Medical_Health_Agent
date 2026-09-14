from fastapi import APIRouter, HTTPException, status, Depends, Request, UploadFile
from src.routes.schemas import ProcessOneFile, ProcessManyFiles
from src.models.enums import ResponseSignal, AssetTypeEnum
from src.controllers import UploadController, ProcessController, DeleteController
from src.models import ProjectModel, AssetModel, ChunkModel, ChatModel
from src.routes.schemas import ProjectCreateRequest, UpdateChatTitleRequest
from src.models.db.schemas import Project, Asset, Chunk, Chat
from src.helpers import Settings, get_settings, limiter
from src.auth.oauth2 import get_current_user
import aiofiles
import logging
import os

logger = logging.getLogger("uvicorn.error")


data_router = APIRouter(
    prefix="/api/v1/data",
    tags=["api_v1","data"]
)


@data_router.post('/create/{project_name}', status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_project(request: Request, project_name: str, project_creation_request: ProjectCreateRequest, current_user = Depends(get_current_user)):
    upload_controller = UploadController(current_user=current_user, db_client=request.app.db_client)
    
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    project_path = upload_controller.create_project(user_id=current_user.user_id, project_name=project_name)

    if not project_path:
        logger.error("Error while Creating folder")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ResponseSignal.PROJECT_CREATION_FAILED.value)

    project = Project(
        project_name=project_name,
        owner_id=current_user.user_id
    )

    project = await project_model.create_project(project=project)

    chat = Chat(
        title=project_creation_request.title,
        project_id=project.project_id
    )

    # 4. Save the chat
    _ = await chat_model.create_chat(chat=chat)

    return {
        "message": ResponseSignal.PROJECT_CREATION_SUCCESS.value,
        "project_name": project.project_name,
        "project_chat_title": chat.title
    }



@data_router.post('/upload/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def upload(request: Request, project_name: str, file: UploadFile, current_user = Depends(get_current_user), app_settings:Settings = Depends(get_settings)):
    upload_controller = UploadController(current_user=current_user, db_client=request.app.db_client)
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    asset_model = await AssetModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    project = await project_model.get_project(project_name=project_name)

    is_valid = upload_controller.verify_uploaded_file(file=file)

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= ResponseSignal.INVALID_FILE_FORMAT.value)

    uploaded_file_path, uploaded_file_name = upload_controller.generate_unique_file_path(
        orig_file_name=file.filename, 
        project_name=project.project_name
    )

    try:
        async with aiofiles.open(uploaded_file_path, 'wb') as f:
            while chunk := await file.read(app_settings.FILE_DEFAULT_CHUNK_SIZE):
                await f.write(chunk)
    except Exception as e:
        logger.error(f"Error while uploading file: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ResponseSignal.FILE_UPLOAD_FAILED.value)
    finally:
        await file.close()
        

    asset = Asset(
        asset_name=uploaded_file_name,
        asset_type=AssetTypeEnum.FILE.value,
        asset_size=os.path.getsize(uploaded_file_path),
        asset_project_id=project.project_id
    )

    asset_record = await asset_model.create_asset(asset=asset)

    return {
        "message": ResponseSignal.FILE_UPLOAD_SUCCESS.value,
        "file_name": str(asset_record.asset_name),
    }



@data_router.post('/update/title/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def update_chat_title(request: Request, project_name: str, update_chat_title_request: UpdateChatTitleRequest, current_user = Depends(get_current_user)):
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    project = await project_model.get_project(project_name=project_name)
    chat = await chat_model.get_project_chat(project_id=project.project_id)

    new_title = await chat_model.update_chat_title(
        chat_id=chat.chat_id,
        new_title=update_chat_title_request.title
    )

    return {
        "message": ResponseSignal.CHAT_TITLE_CHANGED_SUCCESSFULLY.value,
        "new_chat_title": new_title
    }



@data_router.delete('/delete/{project_name}', status_code=status.HTTP_200_OK)
async def delete_project(request: Request, project_name: str, current_user = Depends(get_current_user)):
    delete_controller = DeleteController(current_user=current_user, db_client=request.app.db_client)
    
    delete_controller.delete_project(project_name=project_name)
    delete_controller.delete_database(project_name=project_name)

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    no_of_deleted_project, no_of_deleted_chat, no_of_deleted_messages , no_of_deleted_assets, no_of_deleted_chunks = await project_model.delete_project(project_name=project_name)

    return {
        "message": ResponseSignal.DELETE_DOCUMENT_SUCCESS.value,
        "number of deleted messages": no_of_deleted_messages,
        "number of deleted assets": no_of_deleted_assets,
        "number of deleted chunks": no_of_deleted_chunks,
    }



@data_router.post('/process/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def process_one_file(request: Request, project_name: str, process_request: ProcessOneFile, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    process_controller = ProcessController(
        db_client=request.app.db_client,
        current_user=current_user,
        project_name=project_name
    )

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    asset_model = await AssetModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chunk_model = await ChunkModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    file_name = process_request.file_name
    chunk_size = process_request.chunk_size
    overlap_size = process_request.overlap_size
    do_reset = process_request.do_reset

    file_content = process_controller.get_file_content(file_name=file_name)
    
    if file_content is None:
        logger.error(f"Error while processing file:{file_name}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.NO_FILES_CONTENT.value)
        
    file_chunks = process_controller.process_file_content(
        file_content=file_content,
        chunk_size=chunk_size,
        overlap_size=overlap_size
    )

    if file_chunks is None or len(file_chunks) == 0:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=ResponseSignal.PROCESSING_FAILED.value)

    project = await project_model.get_project(project_name=project_name)
    asset = await asset_model.get_asset_record(project_id=project.project_id, asset_name=file_name)

    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.NO_FILES_ERROR.value)
    
    if do_reset == 1:
        _ = await chunk_model.delete_chunks_by_project_id(project_id=project.project_id)

    
    file_chunks_records = [
        Chunk(
            chunk_text=chunk.page_content,
            chunk_metadata=chunk.metadata,
            chunk_order=i+1,
            chunk_project_id=project.project_id,
            chunk_asset_id=asset.asset_id
        )
        for i, chunk in enumerate(file_chunks)
    ]
    
    count_of_inserted_chunks = await chunk_model.insert_many_chunks(chunks=file_chunks_records)
    
    return {
        "message": ResponseSignal.PROCESSING_SUCCESS.value,
        "processed_file": file_name,
        "inserted_chunks": count_of_inserted_chunks
    }




@data_router.post('/process/all/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def process_many_file(request: Request, project_name: str, process_request: ProcessManyFiles, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    process_controller = ProcessController(
        db_client=request.app.db_client,
        current_user=current_user,
        project_name=project_name,
    )
    
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    asset_model = await AssetModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chunk_model = await ChunkModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    
    chunk_size = process_request.chunk_size
    overlap_size = process_request.overlap_size
    do_reset = process_request.do_reset

    project = await project_model.get_project(project_name=project_name)

    project_files = await asset_model.get_all_project_assets(
        project_id=project.project_id,
        asset_type=AssetTypeEnum.FILE.value
    )

    project_file_ids = { 
        record.asset_id: record.asset_name 
        for record in project_files 
    }
    
    if len(project_file_ids) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.NO_FILES_ERROR.value)
        
    if do_reset == 1:
        _ = await chunk_model.delete_chunks_by_project_id(project_id=project.project_id)
        
    no_records = 0
    no_of_files = 0
    
    for asset_id, file_name in project_file_ids.items():
        file_content = process_controller.get_file_content(file_name=file_name)
        if file_content is None:
            logger.warning(f"Skipping processing file content recovery block for: {file_name}")
            continue
            
        file_chunks = process_controller.process_file_content(
            file_content=file_content,
            chunk_size=chunk_size,
            overlap_size=overlap_size
        )
        
        if file_chunks is None or len(file_chunks) == 0:
            continue
            
        file_chunks_records = [
            Chunk(
                chunk_text=chunk.page_content,
                chunk_metadata=chunk.metadata,
                chunk_order=i+1,
                chunk_project_id=project.project_id,
                chunk_asset_id=asset_id
            )
            for i, chunk in enumerate(file_chunks)
        ]
        
        inserted = await chunk_model.insert_many_chunks(chunks=file_chunks_records)
        no_records += inserted
        no_of_files += 1
        
    return {
        "message": ResponseSignal.PROCESSING_SUCCESS.value,
        "processed_files_count": no_of_files,
        "inserted_chunks": no_records
    }


@data_router.get('/assets/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("30/minute")
async def get_all_assets(request: Request, project_name: str, current_user = Depends(get_current_user)):
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    asset_model = await AssetModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    project = await project_model.get_project(project_name=project_name)

    try:
        assets = await asset_model.get_all_project_assets(
            project_id=project.project_id,
            asset_type=AssetTypeEnum.FILE.value
        )
    except HTTPException as e:
        if e.status_code == status.HTTP_404_NOT_FOUND:
            assets = []
        else:
            raise e

    assets_data = [
        {
            "asset_id": str(a.asset_id),
            "asset_name": a.asset_name,
            "asset_type": a.asset_type,
            "asset_size": a.asset_size,
            "created_at": str(getattr(a, 'created_at', '')) if getattr(a, 'created_at', None) is not None else None
        }
        for a in assets
    ]

    return {
        "project_name": project_name,
        "assets": assets_data
    }