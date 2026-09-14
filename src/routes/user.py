from fastapi import APIRouter, status, Depends, Request
from src.controllers import UserController
from src.routes import schemas
from typing import List
from src.auth import get_current_user

user_router = APIRouter(
    prefix="/api/v1/user",
    tags=["api_v1", "user"]
)


@user_router.get("/", response_model=List[schemas.UserRespond], status_code=status.HTTP_200_OK)
async def search_for_user(request: Request, search_user_input: schemas.UserSearch,current_user=Depends(get_current_user)):
    user_controller = UserController(db_client=request.app.db_client, current_user=current_user)

    users = await user_controller.search_for_user(username=search_user_input.username)

    return users


@user_router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(request: Request, current_user=Depends(get_current_user)):
    user_controller = UserController(db_client=request.app.db_client, current_user=current_user)

    return await user_controller.delete_user_account()


@user_router.put("/", response_model=schemas.UserRespond, status_code=status.HTTP_200_OK)
async def update_user_data(request: Request,new_data: schemas.UserUpdate,current_user=Depends(get_current_user),):
    user_controller = UserController(db_client=request.app.db_client, current_user=current_user)

    return await user_controller.update_user_data(new_data=new_data)
