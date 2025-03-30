
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Activity, 
  Calendar, 
  FileText, 
  Bell, 
  Clock, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  User,
  Pill,
  Heart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock data
const patientHealthStats = {
  heartRate: { current: 72, min: 60, max: 100 },
  bloodPressure: { current: "120/80", min: "90/60", max: "140/90" },
  bloodSugar: { current: 95, min: 70, max: 130 },
  weight: { current: 165, min: 140, max: 190 },
};

const recentAppointments = [
  {
    id: 1,
    doctor: "Dr. Jane Smith",
    specialty: "Cardiologist",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "completed",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "2023-06-28",
    time: "2:30 PM",
    status: "upcoming",
  },
];

const medications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    time: "Morning",
    refillDate: "2023-07-15",
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    time: "Morning and Evening",
    refillDate: "2023-07-10",
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const renderPatientDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medical-700">Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{patientHealthStats.heartRate.current}</div>
                <div className="ml-1 text-sm text-muted-foreground">bpm</div>
              </div>
              <Progress 
                value={((patientHealthStats.heartRate.current - patientHealthStats.heartRate.min) / 
                (patientHealthStats.heartRate.max - patientHealthStats.heartRate.min)) * 100}
                className="h-2 mt-2"
              />
              <div className="flex justify-between mt-1 text-xs text-medical-600">
                <span>{patientHealthStats.heartRate.min} bpm</span>
                <span>{patientHealthStats.heartRate.max} bpm</span>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medical-700">Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{patientHealthStats.bloodPressure.current}</div>
                <div className="ml-1 text-sm text-muted-foreground">mmHg</div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-medical-600">
                <span className="flex items-center">
                  <Activity size={12} className="mr-1" />
                  Normal range
                </span>
                <span>{patientHealthStats.bloodPressure.min} - {patientHealthStats.bloodPressure.max}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medical-700">Blood Glucose</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{patientHealthStats.bloodSugar.current}</div>
                <div className="ml-1 text-sm text-muted-foreground">mg/dL</div>
              </div>
              <Progress 
                value={((patientHealthStats.bloodSugar.current - patientHealthStats.bloodSugar.min) / 
                (patientHealthStats.bloodSugar.max - patientHealthStats.bloodSugar.min)) * 100}
                className="h-2 mt-2"
              />
              <div className="flex justify-between mt-1 text-xs text-medical-600">
                <span>{patientHealthStats.bloodSugar.min} mg/dL</span>
                <span>{patientHealthStats.bloodSugar.max} mg/dL</span>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medical-700">Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{patientHealthStats.weight.current}</div>
                <div className="ml-1 text-sm text-muted-foreground">lbs</div>
              </div>
              <Progress 
                value={((patientHealthStats.weight.current - patientHealthStats.weight.min) / 
                (patientHealthStats.weight.max - patientHealthStats.weight.min)) * 100}
                className="h-2 mt-2"
              />
              <div className="flex justify-between mt-1 text-xs text-medical-600">
                <span>{patientHealthStats.weight.min} lbs</span>
                <span>{patientHealthStats.weight.max} lbs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-medical-700">
                  Upcoming Appointments
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-medical-100 p-2 rounded-full mr-3">
                      <Calendar size={18} className="text-medical-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          appointment.status === "completed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex mt-2 text-sm text-gray-600">
                        <div className="flex items-center mr-4">
                          <Clock size={14} className="mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(appointment.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-medical-500 hover:bg-medical-600">
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-medical-700">
                  Medications
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div 
                    key={medication.id}
                    className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-medical-100 p-2 rounded-full mr-3">
                      <Pill size={18} className="text-medical-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{medication.name} {medication.dosage}</h4>
                        <span className="text-xs text-gray-500">Refill by {formatDate(medication.refillDate)}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>Take {medication.frequency}, {medication.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request Medication Refill
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  const renderDoctorDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">2 urgent consultations</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-between p-2 h-auto text-sm">
                View Schedule
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Patient Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">5 unread messages</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-between p-2 h-auto text-sm">
                View Messages
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">2 medication refills, 2 test results</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-between p-2 h-auto text-sm">
                View Approvals
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>You have 8 appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-medical-50 rounded-lg">
                <div className="flex items-center">
                  <span className="bg-medical-500 text-white text-sm font-medium px-2 py-1 rounded mr-3">
                    9:00 AM
                  </span>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-gray-500">Annual checkup</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Records</Button>
                  <Button size="sm">Start</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-medical-50 rounded-lg">
                <div className="flex items-center">
                  <span className="bg-emergency text-white text-sm font-medium px-2 py-1 rounded mr-3">
                    10:30 AM
                  </span>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <span className="emergency-badge ml-2">Urgent</span>
                    </div>
                    <p className="text-sm text-gray-500">Chest pain evaluation</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Records</Button>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHospitalDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emergency Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold">12</div>
                <div className="ml-2 px-2 py-1 bg-emergency text-white text-xs rounded-full">
                  3 Critical
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current patients in ER</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-between p-2 h-auto text-sm">
                View ER Status
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bed Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">78%</div>
                <div className="ml-2 text-sm text-green-600">12 Available</div>
              </div>
              <Progress value={78} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Total capacity: 55 beds</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emergency Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-emergency" />
                <span className="font-medium">Emergency Patient Lookup</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">For critical patient information access</p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full bg-emergency hover:bg-emergency-dark">
                Access Emergency Records
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Hospital Activity</CardTitle>
            <CardDescription>Overview of today's hospital operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-medical-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="bg-white p-2 rounded-full">
                      <User size={20} className="text-medical-700" />
                    </div>
                    <span className="text-lg font-bold">24</span>
                  </div>
                  <h4 className="mt-2 font-medium">New Admissions</h4>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
                
                <div className="bg-medical-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="bg-white p-2 rounded-full">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <span className="text-lg font-bold">18</span>
                  </div>
                  <h4 className="mt-2 font-medium">Discharges</h4>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
                
                <div className="bg-medical-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="bg-white p-2 rounded-full">
                      <Heart size={20} className="text-emergency" />
                    </div>
                    <span className="text-lg font-bold">5</span>
                  </div>
                  <h4 className="mt-2 font-medium">Surgeries</h4>
                  <p className="text-sm text-gray-500">Scheduled today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDashboardForRole = () => {
    switch (user?.role) {
      case "patient":
        return renderPatientDashboard();
      case "doctor":
        return renderDoctorDashboard();
      case "hospital":
        return renderHospitalDashboard();
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          {greeting}, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          Here's your health information at a glance.
        </p>
      </div>
      {renderDashboardForRole()}
    </div>
  );
};

export default Dashboard;
