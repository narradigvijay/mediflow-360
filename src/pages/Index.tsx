
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-medical-50 to-medical-100 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <div className="h-16 w-16 bg-medical-500 rounded-full mx-auto flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-medical-800">MediFlow 360</h1>
          <p className="mt-2 text-xl text-gray-600">
            Secure Health Record Management System
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4">Welcome to MediFlow 360</h2>
            <p className="text-gray-600 mb-6">
              Access and manage your health records securely from anywhere. Connect with healthcare providers and take control of your health information.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full bg-medical-600 hover:bg-medical-700"
              >
                Sign In
              </Button>
              <p className="text-sm text-gray-500">
                Need emergency access? Contact your healthcare provider
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-medical-700">For Patients</h3>
              <p className="text-sm text-gray-600 mt-1">
                Access your records and appointments
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-medical-700">For Doctors</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage patient care securely
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          &copy; 2023 MediFlow 360. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Index;
