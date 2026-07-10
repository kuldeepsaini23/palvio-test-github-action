"use client"

import { useQuery } from "@tanstack/react-query"
import { useOrganization } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, AlertTriangle, CheckCircle, XCircle, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { ServiceStatus, IncidentStatus } from "@/lib/types"

const statusColors = {
  [ServiceStatus.OPERATIONAL]: "text-green-600",
  [ServiceStatus.DEGRADED]: "text-yellow-600",
  [ServiceStatus.PARTIAL_OUTAGE]: "text-orange-600",
  [ServiceStatus.MAJOR_OUTAGE]: "text-red-600",
}

export default function OverviewPage() {
  const { organization } = useOrganization()
  const navigate = useNavigate();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services", organization?.id],
    queryFn: () => api.getServices(organization?.id),
    enabled: !!organization?.id,
  })

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ["incidents", organization?.id],
    queryFn: () => api.getIncidents(organization?.id),
    enabled: !!organization?.id,
  })

  if (servicesLoading || incidentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const operationalServices = services?.filter((s) => s.status === ServiceStatus.OPERATIONAL).length || 0
  const totalServices = services?.length || 0
  const activeIncidents = incidents?.filter((i) => i.status === IncidentStatus.OPEN).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground">Monitor your services and incidents at a glance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/dashboard/services")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">{operationalServices} operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {operationalServices === totalServices ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalServices === totalServices ? "All Good" : "Issues"}</div>
            <p className="text-xs text-muted-foreground">
              {operationalServices}/{totalServices} services operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {activeIncidents === 0 ? "No active incidents" : "Requires attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Services Status</CardTitle>
          <Button variant="outline" onClick={() => navigate("/dashboard/services")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {services && services.length > 0 ? (
            <div className="space-y-4">
              {services.slice(0, 5).map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        service.status === ServiceStatus.OPERATIONAL
                          ? "bg-green-500"
                          : service.status === ServiceStatus.DEGRADED
                            ? "bg-yellow-500"
                            : service.status === ServiceStatus.PARTIAL_OUTAGE
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                    </div>
                  </div>
                  <Badge variant="secondary" className={statusColors[service.status]}>
                    {service.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first service</p>
              <Button onClick={() => navigate("/dashboard/services")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Incidents</CardTitle>
          <Button variant="outline" onClick={() => navigate("/dashboard/incidents")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {incidents && incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.slice(0, 3).map((incident) => (
                <div key={incident.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                  </div>
                  <Badge variant={incident.status === IncidentStatus.OPEN ? "destructive" : "secondary"}>
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No incidents</h3>
              <p className="text-muted-foreground">All systems are running smoothly</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
