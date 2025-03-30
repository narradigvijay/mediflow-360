
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Index";
import HealthRecords from "./pages/health/HealthRecords";
import Appointments from "./pages/appointments/Appointments";
import Unauthorized from "./pages/auth/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="health-records" element={<HealthRecords />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="settings" element={<div className="text-center py-10">Settings page content will go here</div>} />
              <Route path="notifications" element={<div className="text-center py-10">Notifications page content will go here</div>} />
              
              {/* Doctor specific routes */}
              <Route path="my-patients" element={
                <ProtectedRoute requiredRoles={["doctor"]}>
                  <div className="text-center py-10">My Patients page content will go here</div>
                </ProtectedRoute>
              } />
              
              {/* Hospital specific routes */}
              <Route path="emergency-access" element={
                <ProtectedRoute requiredRoles={["hospital"]}>
                  <div className="text-center py-10">Emergency Access page content will go here</div>
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
