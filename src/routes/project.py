from fastapi import APIRouter, status, Depends, Request, Query
from src.auth.oauth2 import get_current_user
from src.models import ProjectModel, ChatModel
from src.helpers import limiter
from typing import Optional

project_router = APIRouter(
    prefix="/api/v1/project",
    tags=["api_v1", "project"]
)


@project_router.get('/all', status_code=status.HTTP_200_OK)
@limiter.limit("20/minute")
async def get_all_projects(
    request: Request,
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=50, description="Items per page"),
    current_user = Depends(get_current_user)
):
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    projects, total_pages, total_projects = await project_model.get_all_user_projects(
        page=page,
        total_documents_in_each_page=limit
    )

    projects_data = []
    for p in projects:
        try:
            chat = await chat_model.get_project_chat(project_id=p.project_id)
            title = chat.title if chat else p.project_name
        except Exception:
            title = p.project_name

        projects_data.append({
            "project_id": str(p.project_id),
            "project_name": p.project_name,
            "title": title,
            "created_at": str(p.created_at) if p.created_at else None
        })

    return {
        "projects": projects_data,
        "total_pages": total_pages,
        "total_projects": total_projects,
        "current_page": page
    }
