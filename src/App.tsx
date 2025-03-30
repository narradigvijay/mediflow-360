
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
import MedicationAvailability from "./components/emergency/MedicationAvailability";
import HealthRiskAnalysis from "./components/risk/HealthRiskAnalysis";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
              
              {/* Emergency related routes */}
              <Route path="emergency-access" element={
                <ProtectedRoute requiredRoles={["doctor", "hospital"]}>
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-medical-800">Emergency Access</h2>
                      <p className="text-muted-foreground">Access patient records in emergency situations</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-red-800 mb-2">Emergency Access Mode</h3>
                      <p className="text-red-700 mb-4">This feature allows immediate access to critical patient information when emergency care is needed. All access is logged for compliance and auditing.</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-white p-4 rounded border shadow-sm">
                          <h4 className="font-medium mb-2">Patient Search</h4>
                          <p className="text-sm text-gray-500 mb-4">Search for a patient by ID, name, or other identifiers</p>
                          <div className="space-y-4">
                            <input type="text" placeholder="Enter patient information" className="w-full p-2 border rounded" />
                            <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Search Patient Records</button>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border shadow-sm">
                          <h4 className="font-medium mb-2">Recent Emergency Accesses</h4>
                          <div className="space-y-2 text-sm">
                            <p className="p-2 bg-gray-50 rounded">Patient #12345 - Accessed 2 hours ago</p>
                            <p className="p-2 bg-gray-50 rounded">Patient #67890 - Accessed 5 hours ago</p>
                            <p className="p-2 bg-gray-50 rounded">Patient #24680 - Accessed 1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="emergency-contacts" element={
                <ProtectedRoute requiredRoles={["patient"]}>
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-medical-800">Emergency Contacts</h2>
                      <p className="text-muted-foreground">Manage your emergency contacts who will be notified in case of emergencies</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Add Emergency Contact</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" placeholder="Full name" className="w-full p-2 border rounded" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Relationship</label>
                            <select className="w-full p-2 border rounded">
                              <option>Select relationship</option>
                              <option>Spouse</option>
                              <option>Parent</option>
                              <option>Child</option>
                              <option>Sibling</option>
                              <option>Friend</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input type="tel" placeholder="Phone number" className="w-full p-2 border rounded" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" placeholder="Email address" className="w-full p-2 border rounded" />
                          </div>
                          <button className="w-full bg-medical-600 text-white py-2 px-4 rounded hover:bg-medical-700">Add Contact</button>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Your Emergency Contacts</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">John Doe</h4>
                                <p className="text-sm text-gray-500">Spouse</p>
                              </div>
                              <button className="text-red-600 hover:text-red-800">Remove</button>
                            </div>
                            <div className="mt-2 text-sm">
                              <p>Phone: (555) 123-4567</p>
                              <p>Email: john.doe@example.com</p>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">Jane Smith</h4>
                                <p className="text-sm text-gray-500">Sister</p>
                              </div>
                              <button className="text-red-600 hover:text-red-800">Remove</button>
                            </div>
                            <div className="mt-2 text-sm">
                              <p>Phone: (555) 987-6543</p>
                              <p>Email: jane.smith@example.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* New emergency medication route */}
              <Route path="medication-finder" element={
                <ProtectedRoute>
                  <MedicationAvailability />
                </ProtectedRoute>
              } />
              
              {/* Health risk analysis route */}
              <Route path="health-risk" element={
                <ProtectedRoute>
                  <HealthRiskAnalysis />
                </ProtectedRoute>
              } />
              
              <Route path="hospital-locator" element={
                <ProtectedRoute>
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-medical-800">Hospital Locator</h2>
                      <p className="text-muted-foreground">Find nearby hospitals based on treatment and medicine availability</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Search Criteria</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Treatment Type</label>
                              <select className="w-full p-2 border rounded">
                                <option>Select treatment</option>
                                <option>Emergency Surgery</option>
                                <option>Cardiac Care</option>
                                <option>Trauma Center</option>
                                <option>Burn Unit</option>
                                <option>Pediatric Emergency</option>
                                <option>Stroke Center</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Medication Required</label>
                              <input type="text" placeholder="Enter medicine name" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Distance</label>
                              <select className="w-full p-2 border rounded">
                                <option>Any distance</option>
                                <option>Within 5 miles</option>
                                <option>Within 10 miles</option>
                                <option>Within 25 miles</option>
                                <option>Within 50 miles</option>
                              </select>
                            </div>
                            <button className="w-full bg-medical-600 text-white py-2 px-4 rounded hover:bg-medical-700">Find Hospitals</button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-4">Nearby Hospitals</h3>
                          <div className="h-[300px] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            <p className="text-gray-500">Map will display here</p>
                          </div>
                          <div className="space-y-2">
                            <div className="p-3 border rounded-lg">
                              <h4 className="font-medium">General Hospital</h4>
                              <p className="text-sm">1.2 miles away • Trauma Center Available</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h4 className="font-medium">Medical Center</h4>
                              <p className="text-sm">2.8 miles away • Cardiac Care Available</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Doctor specific routes */}
              <Route path="my-patients" element={
                <ProtectedRoute requiredRoles={["doctor"]}>
                  <div className="text-center py-10">My Patients page content will go here</div>
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
