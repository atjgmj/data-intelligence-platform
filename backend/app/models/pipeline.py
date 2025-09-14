from sqlalchemy import Column, String, DateTime, Enum, Text, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.core.database import Base

class PipelineStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"

class TransformationPipeline(Base):
    __tablename__ = "transformation_pipelines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    steps = Column(JSONB, default=[])
    source_datasets = Column(ARRAY(UUID(as_uuid=True)))
    target_schema = Column(JSONB, default={})
    status = Column(Enum(PipelineStatus), default=PipelineStatus.DRAFT, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="pipelines")

    def __repr__(self):
        return f"<TransformationPipeline(name='{self.name}', status='{self.status}')>"