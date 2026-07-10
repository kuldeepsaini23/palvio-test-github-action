"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useOrganization } from "@clerk/clerk-react"
import { Plus, MoreHorizontal, Edit, Trash2, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ServiceForm from "@/components/forms/ServiceForm"
import { api } from "@/lib/api"
import { type Service, ServiceStatus } from "@/lib/types"

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

export default function ServicesPage() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", organization?.id],
    queryFn: () => api.getServices(organization?.id!),
    enabled: !!organization?.id,
  })

  const deleteServiceMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  const handleDelete = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(serviceId)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedService(null)
  }

  if (isLoading) {
    return <div>Loading services...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your services and their current status</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedService(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <ServiceForm service={selectedService} onSuccess={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${statusColors[service.status]}`} />
                <Badge variant="secondary">{statusLabels[service.status]}</Badge>
              </div>
              {service.description && <p className="text-sm text-muted-foreground mt-2">{service.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {services?.length === 0 && (
        <div className="text-center py-12">
          <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first service</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      )}
    </div>
  )
}
