"use client"

import { SignIn } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="bg-background rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <SignIn routing="path" path="/sign-in" redirectUrl="/dashboard" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  )
}
