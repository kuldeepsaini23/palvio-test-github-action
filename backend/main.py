from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from database import get_db, engine
from models import Base
from schemas import (
    ServiceCreate, ServiceUpdate, ServiceResponse,
    IncidentCreate, IncidentUpdate, IncidentResponse,
    OrganizationCreate, OrganizationResponse
)
from crud import (
    create_service, get_services, get_service, update_service, delete_service,
    create_incident, get_incidents, get_incident, update_incident,
    create_organization, get_organization_by_slug, get_organization
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Status Page API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Organizations
@app.post("/api/organizations", response_model=OrganizationResponse)
async def create_org(org: OrganizationCreate, db: Session = Depends(get_db)):
    return create_organization(db, org)

@app.get("/api/organizations/{org_id}")
async def get_org(org_id: str, db: Session = Depends(get_db)):
    org = get_organization(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

# Services
@app.get("/api/organizations/{org_id}/services", response_model=List[ServiceResponse])
async def get_org_services(org_id: str, db: Session = Depends(get_db)):
    return get_services(db, org_id)

@app.post("/api/organizations/{org_id}/services", response_model=ServiceResponse)
async def create_org_service(
    org_id: str, 
    service: ServiceCreate, 
    db: Session = Depends(get_db)
):
    service.org_id = org_id
    return create_service(db, service)

@app.get("/api/services/{service_id}", response_model=ServiceResponse)
async def get_service_by_id(service_id: str, db: Session = Depends(get_db)):
    service = get_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.put("/api/services/{service_id}", response_model=ServiceResponse)
async def update_service_by_id(
    service_id: str, 
    service_update: ServiceUpdate, 
    db: Session = Depends(get_db)
):
    service = update_service(db, service_id, service_update)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.delete("/api/services/{service_id}")
async def delete_service_by_id(service_id: str, db: Session = Depends(get_db)):
    success = delete_service(db, service_id)
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

# Incidents
@app.get("/api/organizations/{org_id}/incidents", response_model=List[IncidentResponse])
async def get_org_incidents(org_id: str, db: Session = Depends(get_db)):
    return get_incidents(db, org_id)

@app.post("/api/organizations/{org_id}/incidents", response_model=IncidentResponse)
async def create_org_incident(
    org_id: str, 
    incident: IncidentCreate, 
    db: Session = Depends(get_db)
):
    incident.org_id = org_id
    return create_incident(db, incident)

@app.put("/api/incidents/{incident_id}", response_model=IncidentResponse)
async def update_incident_by_id(
    incident_id: str, 
    incident_update: IncidentUpdate, 
    db: Session = Depends(get_db)
):
    incident = update_incident(db, incident_id, incident_update)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

# Public Status Page
@app.get("/api/public/status/{org_slug}")
async def get_public_status(org_slug: str, db: Session = Depends(get_db)):
    org = get_organization_by_slug(db, org_slug)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    services = get_services(db, org.id)
    incidents = get_incidents(db, org.id)
    
    return {
        "organization": org,
        "services": services,
        "incidents": incidents
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


# run server -> uvicorn main:app --reload