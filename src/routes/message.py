from fastapi import APIRouter, status, Depends, Request, Query, HTTPException
from src.auth.oauth2 import get_current_user
from src.models import ProjectModel, ChatModel, MessageModel
from src.helpers import limiter
from typing import Optional
import math

message_router = APIRouter(
    prefix="/api/v1/message",
    tags=["api_v1", "message"]
)


@message_router.get('/all', status_code=status.HTTP_200_OK)
@message_router.get('/all/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("30/minute")
async def get_all_messages(
    request: Request,
    project_name: Optional[str] = None,
    page: int = Query(default=1, ge=1, description="Page number (1 = latest 20 messages, 2 = previous 20)"),
    limit: int = Query(default=20, ge=1, le=100, description="Messages per page"),
    current_user = Depends(get_current_user)
):
    if not project_name:
        # Check query params if not provided in path
        project_name = request.query_params.get("project_name")

    if not project_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="project_name parameter is required"
        )

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    message_model = await MessageModel.create_instance(current_user=current_user, db_client=request.app.db_client)

    project = await project_model.get_project(project_name=project_name)
    chat = await chat_model.get_project_chat(project_id=project.project_id)

    total_messages = await message_model.get_total_message_count(chat_id=chat.chat_id)
    total_pages = math.ceil(total_messages / limit) if total_messages > 0 else 1

    messages = await message_model.get_paginated_chat_messages(
        chat_id=chat.chat_id,
        page=page,
        page_size=limit
    )

    messages_data = [
        {
            "message_id": str(m.message_id),
            "role": m.role,
            "content": m.content,
            "message_order": m.message_order,
            "created_at": m.created_at
        }
        for m in messages
    ]

    return {
        "project_name": project.project_name,
        "chat_title": chat.title,
        "messages": messages_data,
        "total_messages": total_messages,
        "total_pages": total_pages,
        "current_page": page,
        "has_more": page < total_pages
    }
