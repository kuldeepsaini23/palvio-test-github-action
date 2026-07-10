"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@clerk/clerk-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { type Service, ServiceStatus } from "@/lib/types";
import { toast } from "sonner";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(ServiceStatus),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
}

export default function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      status: service?.status || ServiceStatus.OPERATIONAL,
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => {
      if (!organization?.id) {
        throw new Error("Organization ID is required");
      }
      return api.createService({ ...data, orgId: organization.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create service");
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => {
      if (!service?.id) {
        throw new Error("Service ID is required");
      }
      return api.updateService(service.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update service");
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    if (service) {
      updateServiceMutation.mutate(data);
    } else {
      createServiceMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Website, API, Database" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the service"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ServiceStatus.OPERATIONAL}>
                    Operational
                  </SelectItem>
                  <SelectItem value={ServiceStatus.DEGRADED}>
                    Degraded
                  </SelectItem>
                  <SelectItem value={ServiceStatus.PARTIAL_OUTAGE}>
                    Partial Outage
                  </SelectItem>
                  <SelectItem value={ServiceStatus.MAJOR_OUTAGE}>
                    Major Outage
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createServiceMutation.isPending || updateServiceMutation.isPending
            }
          >
            {service ? "Update" : "Create"} Service
          </Button>
        </div>
      </form>
    </Form>
  );
}
