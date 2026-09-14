from src.models.db.schemas.base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

class Chunk(Base):
    __tablename__="chunks"

    chunk_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, unique=True, default=uuid.uuid4)

    chunk_text = Column(String, nullable=False)
    chunk_metadata = Column(JSONB, nullable=False)
    chunk_order = Column(Integer, nullable=False)

    chunk_project_id = Column(UUID(as_uuid=True), ForeignKey("projects.project_id", onupdate="CASCADE"), nullable=False)
    chunk_asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.asset_id", onupdate="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="chunks")
    asset = relationship("Asset", back_populates="chunks")

    __table_args__ = (
        Index("ix_chunk_project_id", chunk_project_id),
        Index("ix_chunk_asset_id", chunk_asset_id),
    )