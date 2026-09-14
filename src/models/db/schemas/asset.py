from src.models.db.schemas.base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

class Asset(Base):
    __tablename__="assets"

    asset_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, unique=True, default=uuid.uuid4)

    asset_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)
    asset_size = Column(Integer, nullable=False)
    asset_config = Column(JSONB, nullable=True)

    asset_project_id = Column(UUID(as_uuid=True), ForeignKey("projects.project_id", onupdate="CASCADE"), nullable=False)
    
    project = relationship("Project", back_populates="assets")
    chunks = relationship("Chunk", back_populates="asset")


    @validates("asset_name")
    def validate_asset_name(self, key, value):
        if not value or not value.strip():
            raise ValueError("Asset name cannot be empty or whitespace only.")
        return value.strip()

    @validates("asset_type")
    def validate_asset_type(self, key, value):
        if not value or not value.strip():
            raise ValueError("Asset type cannot be empty.")
        return value.strip().lower()

    @validates("asset_size")
    def validate_asset_size(self, key, value):
        if value is None or value < 0:
            raise ValueError("Asset size must be a non-negative integer.")
        return value


    __table_args__ = (
        Index("ix_asset_project_id", asset_project_id),
        Index("ix_asset_type", asset_type)
    )
    