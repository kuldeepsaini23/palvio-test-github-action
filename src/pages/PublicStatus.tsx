"use client"

import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { ServiceStatus } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

const statusColors = {
  [ServiceStatus.OPERATIONAL]: "bg-green-500",
  [ServiceStatus.DEGRADED]: "bg-yellow-500",
  [ServiceStatus.PARTIAL_OUTAGE]: "bg-orange-500",
  [ServiceStatus.MAJOR_OUTAGE]: "bg-red-500",
}

const statusLabels = {
  [ServiceStatus.OPERATIONAL]: "Operational",
  [ServiceStatus.DEGRADED]: "Degraded",
  [ServiceStatus.PARTIAL_OUTAGE]: "Partial Outage",
  [ServiceStatus.MAJOR_OUTAGE]: "Major Outage",
}

export default function PublicStatus() {
  const { orgSlug } = useParams<{ orgSlug: string }>()

  const { data: statusData, isLoading } = useQuery({
    queryKey: ["public-status", orgSlug],
    queryFn: () => api.getPublicStatus(orgSlug!),
    enabled: !!orgSlug,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading status page...</div>
      </div>
    )
  }

  if (!statusData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Status page not found</div>
      </div>
    )
  }

  const { organization, services, incidents } = statusData
  const allOperational = services.every((s) => s.status === ServiceStatus.OPERATIONAL)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{organization.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">Status Page</p>

          <div className="flex items-center justify-center gap-2">
            <div className={`h-3 w-3 rounded-full ${allOperational ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-lg font-medium">
              {allOperational ? "All Systems Operational" : "Some Systems Affected"}
            </span>
          </div>
        </div>

        {/* Current Incidents */}
        {incidents.filter((i) => i.status === "OPEN").length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents
                .filter((i) => i.status === "OPEN")
                .map((incident) => (
                  <div key={incident.id} className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-orange-800">{incident.title}</h3>
                    <p className="text-orange-700 text-sm">{incident.description}</p>
                    <p className="text-orange-600 text-xs mt-1">
                      Started {formatDistanceToNow(new Date(incident.createdAt))} ago
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service, index) => (
              <div key={service.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${statusColors[service.status]}`} />
                    <Badge variant="secondary">{statusLabels[service.status]}</Badge>
                  </div>
                </div>
                {index < services.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Incident History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No incidents to report. All systems have been running smoothly.
              </p>
            ) : (
              <div className="space-y-4">
                {incidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{incident.title}</h3>
                      <Badge variant={incident.status === "OPEN" ? "destructive" : "secondary"}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(incident.createdAt))} ago
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by StatusPage • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
