export const ServiceStatus = {
  OPERATIONAL: "OPERATIONAL",
  DEGRADED: "DEGRADED",
  PARTIAL_OUTAGE: "PARTIAL_OUTAGE",
  MAJOR_OUTAGE: "MAJOR_OUTAGE",
} as const;

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus];

export const IncidentStatus = {
  OPEN: "OPEN",
  RESOLVED: "RESOLVED",
} as const;

export type IncidentStatus = typeof IncidentStatus[keyof typeof IncidentStatus];

export interface Service {
  id: string
  name: string
  description?: string
  status: ServiceStatus
  orgId: string
  createdAt: string
  updatedAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: IncidentStatus
  orgId: string
  serviceIds: string[]
  createdAt: string
  updatedAt: string
  updates: IncidentUpdate[]
}

export interface IncidentUpdate {
  id: string
  content: string
  incidentId: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  clerkOrgId: string
  createdAt: string
  updatedAt: string
}
