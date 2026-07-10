from sqlalchemy.orm import Session
from models import Organization, Service, Incident, IncidentUpdate
from schemas import (
    OrganizationCreate, ServiceCreate, ServiceUpdate, 
    IncidentCreate, IncidentUpdate as IncidentUpdateSchema
)
from typing import List, Optional

# Organization CRUD
def create_organization(db: Session, org: OrganizationCreate) -> Organization:
    db_org = Organization(**org.dict())
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

def get_organization(db: Session, org_id: str) -> Optional[Organization]:
    return db.query(Organization).filter(Organization.id == org_id).first()

def get_organization_by_slug(db: Session, slug: str) -> Optional[Organization]:
    return db.query(Organization).filter(Organization.slug == slug).first()

def get_organization_by_clerk_id(db: Session, clerk_org_id: str) -> Optional[Organization]:
    return db.query(Organization).filter(Organization.clerk_org_id == clerk_org_id).first()

# Service CRUD
def create_service(db: Session, service: ServiceCreate) -> Service:
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def get_services(db: Session, org_id: str) -> List[Service]:
    return db.query(Service).filter(Service.org_id == org_id).all()

def get_service(db: Session, service_id: str) -> Optional[Service]:
    return db.query(Service).filter(Service.id == service_id).first()

def update_service(db: Session, service_id: str, service_update: ServiceUpdate) -> Optional[Service]:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service:
        update_data = service_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_service, field, value)
        db.commit()
        db.refresh(db_service)
    return db_service

def delete_service(db: Session, service_id: str) -> bool:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service:
        db.delete(db_service)
        db.commit()
        return True
    return False

# Incident CRUD
def create_incident(db: Session, incident: IncidentCreate) -> Incident:
    db_incident = Incident(**incident.dict())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

def get_incidents(db: Session, org_id: str) -> List[Incident]:
    return db.query(Incident).filter(Incident.org_id == org_id).order_by(Incident.created_at.desc()).all()

def get_incident(db: Session, incident_id: str) -> Optional[Incident]:
    return db.query(Incident).filter(Incident.id == incident_id).first()

def update_incident(db: Session, incident_id: str, incident_update: IncidentUpdateSchema) -> Optional[Incident]:
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if db_incident:
        update_data = incident_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_incident, field, value)
        db.commit()
        db.refresh(db_incident)
    return db_incident
