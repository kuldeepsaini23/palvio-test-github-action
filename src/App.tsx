import { Routes, Route, Navigate } from "react-router-dom"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./provider/ThemeProvider"
import LandingPage from "./pages/Landing"
import PublicStatus from "./pages/PublicStatus"
import SignInPage from "./pages/SignIn"
import Dashboard from "./pages/Dashboard"
import OrganizationSetup from "./pages/OrganizationSetup"
import { Toaster } from "sonner";


const queryClient = new QueryClient()

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/status/:orgSlug" element={<PublicStatus />} />
              <Route path="/sign-in" element={<SignInPage />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                }
              />

              <Route
                path="/setup"
                element={
                  <SignedIn>
                    <OrganizationSetup />
                  </SignedIn>
                }
              />

              {/* Redirect signed out users to sign in */}
              <Route
                path="/dashboard"
                element={
                  <SignedOut>
                    <Navigate to="/sign-in" replace />
                  </SignedOut>
                }
              />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster richColors />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App
