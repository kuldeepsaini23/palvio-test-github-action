import type { Service, Incident, ServiceStatus, IncidentStatus } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Services
  async getServices(orgId: string): Promise<Service[]> {
    return this.request(`/api/organizations/${orgId}/services`)
  }

  async createService(data: {
    name: string
    description?: string
    status: ServiceStatus
    orgId: string
  }): Promise<Service> {
    return this.request(`/api/organizations/${data.orgId}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateService(
    serviceId: string,
    data: {
      name?: string
      description?: string
      status?: ServiceStatus
    },
  ): Promise<Service> {
    return this.request(`/api/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteService(serviceId: string): Promise<void> {
    return this.request(`/api/services/${serviceId}`, {
      method: "DELETE",
    })
  }

  // Incidents
  async getIncidents(orgId: string): Promise<Incident[]> {
    return this.request(`/api/organizations/${orgId}/incidents`)
  }

  async createIncident(data: {
    title: string
    description: string
    status: IncidentStatus
    serviceIds: string[]
    orgId: string
  }): Promise<Incident> {
    return this.request(`/api/organizations/${data.orgId}/incidents`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateIncident(
    incidentId: string,
    data: {
      title?: string
      description?: string
      status?: IncidentStatus
      serviceIds?: string[]
    },
  ): Promise<Incident> {
    return this.request(`/api/incidents/${incidentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Public Status
  async getPublicStatus(orgSlug: string) {
    return this.request(`/api/public/status/${orgSlug}`)
  }

  // Organizations
  async createOrganization(data: {
    name: string
    slug: string
    clerkOrgId: string
  }) {
    return this.request("/api/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()
