import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // If Clerk hasn't loaded yet, don’t render anything
  if (!isLoaded) return null;

  // If not signed in, redirect immediately
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If signed in, render the protected children
  return <>{children}</>;
};

export default ProtectedRoute;
