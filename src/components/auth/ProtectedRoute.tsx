
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: Array<"patient" | "doctor" | "hospital">;
  allowEmergencyAccess?: boolean;
  emergencyReason?: string;
};

const ProtectedRoute = ({ 
  children, 
  requiredRoles,
  allowEmergencyAccess = false,
  emergencyReason
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Show a loading spinner while authentication state is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-medical-500" />
          <p className="mt-4 text-medical-700">Loading your secure session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if the user has the required role
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    // Check if this is an emergency access situation
    if (allowEmergencyAccess && (user.role === "doctor" || user.role === "hospital")) {
      // Allow emergency access but show a toast notification
      toast({
        title: "Emergency Access Mode",
        description: emergencyReason || "You are accessing this resource under emergency privileges. All actions will be logged.",
        variant: "destructive",
        duration: 5000,
      });
      return <>{children}</>;
    }
    
    // Not allowed - redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
