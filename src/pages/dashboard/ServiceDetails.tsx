"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useOrganization } from "@clerk/clerk-react"
import { ArrowLeft, Edit, Trash2, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import ServiceForm from "@/components/forms/ServiceForm"
import { api } from "@/lib/api"
import { ServiceStatus } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

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

export default function ServiceDetails() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { organization } = useOrganization()
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => api.getServices(serviceId!),
    enabled: !!serviceId,
  })

  const deleteServiceMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service deleted successfully")
      navigate("/dashboard/services")
    },
  })

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      deleteServiceMutation.mutate(serviceId!)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Service not found</h3>
        <Button onClick={() => navigate("/dashboard/services")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/dashboard/services")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${statusColors[service.status]}`} />
            <Badge variant="secondary">{statusLabels[service.status]}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
              </DialogHeader>
              <ServiceForm service={service} onSuccess={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={handleDelete} disabled={deleteServiceMutation.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Service Name</label>
              <p className="text-lg">{service.name}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{service.description || "No description provided"}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Status</label>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-2 w-2 rounded-full ${statusColors[service.status]}`} />
                <span className="font-medium">{statusLabels[service.status]}</span>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p>{formatDistanceToNow(new Date(service.createdAt))} ago</p>
            </div>

            {service.updatedAt && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p>{formatDistanceToNow(new Date(service.updatedAt))} ago</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className={`h-2 w-2 rounded-full ${statusColors[service.status]}`} />
                <div className="flex-1">
                  <p className="font-medium">Current Status: {statusLabels[service.status]}</p>
                  <p className="text-sm text-muted-foreground">
                    Since {formatDistanceToNow(new Date(service.updatedAt || service.createdAt))} ago
                  </p>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Status history will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
