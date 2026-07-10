"use client"

import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useOrganization, UserButton } from "@clerk/clerk-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Server, AlertTriangle, Settings, ExternalLink, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Services", href: "/dashboard/services", icon: Server, exact: false },
  { name: "Incidents", href: "/dashboard/incidents", icon: AlertTriangle, exact: false },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { organization } = useOrganization()

  const isActiveRoute = (href: string, exact: boolean) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {organization?.name?.charAt(0) || "S"}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-sm">{organization?.name}</h2>
                <p className="text-xs text-muted-foreground">Status Page</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActiveRoute(item.href, item.exact)}>
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => window.open(`/status/${organization?.slug}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>

              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
