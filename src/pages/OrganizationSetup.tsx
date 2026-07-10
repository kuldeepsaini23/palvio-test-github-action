"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOrganization, useOrganizationList } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function OrganizationSetup() {
  const navigate = useNavigate()
  const { organization } = useOrganization()
  const { organizationList, createOrganization, setActive } = useOrganizationList()
  const [isCreating, setIsCreating] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [orgSlug, setOrgSlug] = useState("")

  const createOrgMutation = useMutation({
    mutationFn: api.createOrganization,
    onSuccess: () => {
      toast.success("Organization created successfully")
      navigate("/dashboard")
    },
    onError: (error) => {
      toast.error("Failed to create organization", {
        description: error.message,
      })
    },
  })

  const handleCreateOrganization = async () => {
    if (!orgName.trim() || !orgSlug.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      if (!createOrganization) {
        toast.error("Unable to create organization")
        return
      }
      
      const clerkOrg = await createOrganization({ name: orgName })
      if (clerkOrg) {
        await createOrgMutation.mutateAsync({
          name: orgName,
          slug: orgSlug,
          clerkOrgId: clerkOrg.id,
        })
      }
    } catch (error) {
      console.error("Error creating organization:", error)
    }
  }

  const handleSelectOrganization = async (orgId: string) => {
    const selectedOrg = organizationList?.find((org) => org.organization.id === orgId)
    if (selectedOrg && setActive) {
      await setActive({ organization: selectedOrg.organization })
      navigate("/dashboard")
    }
  }

  // If user already has an organization, redirect to dashboard
  if (organization) {
    navigate("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-2xl p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Setup Your Organization</CardTitle>
            <p className="text-muted-foreground">
              Create or select an organization to get started with your status page
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Organizations */}
            {organizationList && organizationList.length > 0 && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">Select Existing Organization</h3>
                  <div className="space-y-2">
                    {organizationList.map(({ organization: org }) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSelectOrganization(org.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {org.membersCount} member{org.membersCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Create New Organization */}
            <div>
              <h3 className="font-semibold mb-3">Create New Organization</h3>

              {!isCreating ? (
                <Button variant="outline" className="w-full" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Organization
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      placeholder="e.g., Acme Inc"
                      value={orgName}
                      onChange={(e) => {
                        setOrgName(e.target.value)
                        // Auto-generate slug
                        setOrgSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-")
                            .replace(/^-|-$/g, ""),
                        )
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="orgSlug">Status Page URL</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        /status/
                      </span>
                      <Input
                        id="orgSlug"
                        placeholder="acme-inc"
                        value={orgSlug}
                        onChange={(e) => setOrgSlug(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">This will be your public status page URL</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateOrganization}
                      disabled={createOrgMutation.isPending}
                      className="flex-1"
                    >
                      {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
