from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models import ServiceStatus, IncidentStatus

# Organization schemas
class OrganizationCreate(BaseModel):
    name: str
    slug: str
    clerk_org_id: str

class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    clerk_org_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Service schemas
class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: ServiceStatus = ServiceStatus.OPERATIONAL
    org_id: Optional[str] = None

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ServiceStatus] = None

class ServiceResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: ServiceStatus
    org_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Incident schemas
class IncidentCreate(BaseModel):
    title: str
    description: str
    status: IncidentStatus = IncidentStatus.OPEN
    service_ids: List[str] = []
    org_id: Optional[str] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IncidentStatus] = None
    service_ids: Optional[List[str]] = None

class IncidentUpdateResponse(BaseModel):
    id: str
    content: str
    incident_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    status: IncidentStatus
    org_id: str
    service_ids: List[str]
    created_at: datetime
    updated_at: Optional[datetime] = None
    updates: List[IncidentUpdateResponse] = []

    class Config:
        from_attributes = True
