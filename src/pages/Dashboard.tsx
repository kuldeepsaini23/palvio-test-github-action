import { Routes, Route, Navigate } from "react-router-dom"
import { useOrganization } from "@clerk/clerk-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import OverviewPage from "./dashboard/Overview"


export default function Dashboard() {
  const { organization, isLoaded } = useOrganization()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!organization) {
    return <Navigate to="/setup" replace />
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        {/* <Route path="/services" element={<ServicesPage />} /> */}
        {/* <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/incidents/:incidentId" element={<IncidentDetails />} />
        <Route path="/settings" element={<SettingsPage />} /> */}
        {/* Catch all dashboard routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
