from fastapi import HTTPException, status
from src.models.enums import ResponseSignal
from src.models import BaseDataModel
from src.models.db.schemas import Asset
from sqlalchemy.future import select
from sqlalchemy import delete, func
from sqlalchemy.dialects.postgresql import UUID

class AssetModel(BaseDataModel):
    def __init__(self, current_user, db_client):
        super().__init__(current_user, db_client)

    @classmethod
    async def create_instance(cls, current_user, db_client):
        instance = cls(current_user=current_user, db_client=db_client)
        return instance

    
    async def create_asset(self, asset: Asset):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Asset).where(Asset.asset_id == asset.asset_id)
                existed_project = (await db.execute(statement)).scalars().first()

                if existed_project:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ResponseSignal.PROJECT_ALREADY_EXIST.value)

                db.add(asset)
                await db.flush()
                await db.refresh(asset) 

                return asset

    
    async def get_all_project_assets(self, project_id: UUID, asset_type: str = None):
        async with self.db_client() as db:
            async with db.begin():
                if asset_type:
                    statement = select(Asset).where(
                        Asset.asset_project_id == project_id,
                        func.lower(Asset.asset_type) == func.lower(asset_type)
                    )
                else:
                    statement = select(Asset).where(Asset.asset_project_id == project_id)

                assets = (await db.execute(statement)).scalars().all()

                if not assets:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.ASSET_NOT_FOUND.value)

                return assets

    
    async def get_asset_record(self, project_id: UUID, asset_name: str):
        async with self.db_client() as db:
            async with db.begin():
                statement = select(Asset).where(Asset.asset_project_id == project_id, Asset.asset_name == asset_name)
                asset = (await db.execute(statement)).scalars().first()

                if not asset:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.ASSET_NOT_FOUND.value)
                
                return asset


    
    async def delete_assets_by_project_id(self, project_id: UUID):
        async with self.db_client() as db:
            async with db.begin():
                statement = delete(Asset).where(Asset.asset_project_id == project_id)
                deleted_assets = await db.execute(statement)
        
                return deleted_assets.rowcount