from sqlalchemy import Column, String, Text, DateTime, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum
import uuid

Base = declarative_base()

class ServiceStatus(str, enum.Enum):
    OPERATIONAL = "OPERATIONAL"
    DEGRADED = "DEGRADED"
    PARTIAL_OUTAGE = "PARTIAL_OUTAGE"
    MAJOR_OUTAGE = "MAJOR_OUTAGE"

class IncidentStatus(str, enum.Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    clerk_org_id = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Service(Base):
    __tablename__ = "services"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(ServiceStatus), default=ServiceStatus.OPERATIONAL)
    org_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.OPEN)
    org_id = Column(String, nullable=False)
    service_ids = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class IncidentUpdate(Base):
    __tablename__ = "incident_updates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    incident_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
