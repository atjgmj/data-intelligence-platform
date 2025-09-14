from sqlalchemy import Column, String, Integer, DateTime, Enum, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.core.database import Base

class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    query_text = Column(Text)
    query_intent = Column(JSONB, default={})
    execution_plan = Column(JSONB, default={})
    results = Column(JSONB, default={})
    execution_time = Column(Integer)  # milliseconds
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING, nullable=False)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="analyses")
    dataset = relationship("Dataset", back_populates="analyses")

    def __repr__(self):
        return f"<AnalysisHistory(id='{self.id}', status='{self.status}')>"