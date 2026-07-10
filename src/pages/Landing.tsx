"use client"

import { useNavigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Server, AlertTriangle, BarChart3, Users, Shield } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()

  const features = [
    {
      icon: Server,
      title: "Service Monitoring",
      description: "Track the status of all your services in real-time with detailed monitoring.",
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Manage incidents efficiently with timeline updates and status tracking.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Get insights into your service uptime and performance metrics.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team to resolve issues quickly and efficiently.",
    },
    {
      icon: Shield,
      title: "Public Status Pages",
      description: "Keep your customers informed with beautiful, customizable status pages.",
    },
    {
      icon: CheckCircle,
      title: "99.9% Uptime",
      description: "Reliable infrastructure ensures your status page is always available.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl">StatusPage</span>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/sign-in")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/sign-in")}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Keep Your Customers Informed
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create beautiful status pages, monitor your services, and manage incidents with our comprehensive status
            page platform.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button size="lg" onClick={() => navigate("/sign-in")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/status/demo")}>
              View Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Setup in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need for status monitoring</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you monitor services, manage incidents, and keep your customers informed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary/5 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of companies using StatusPage to keep their customers informed and build trust through
            transparency.
          </p>
          <Button size="lg" onClick={() => navigate("/sign-in")}>
            Create Your Status Page
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">S</span>
              </div>
              <span className="font-semibold">StatusPage</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 StatusPage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
