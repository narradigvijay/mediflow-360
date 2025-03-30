
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  FileUp,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  MessageCircle,
  Stethoscope,
  Clipboard,
  Thermometer,
  Syringe,
  Activity,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data
const medicalRecords = [
  {
    id: "rec1",
    type: "Lab Result",
    title: "Complete Blood Count (CBC)",
    date: "2023-05-15",
    doctor: "Dr. Jane Smith",
    department: "Hematology",
    status: "normal",
    summary: "All blood cell counts within normal range.",
    icon: <Activity />,
  },
  {
    id: "rec2",
    type: "Imaging",
    title: "Chest X-Ray",
    date: "2023-04-22",
    doctor: "Dr. Robert Johnson",
    department: "Radiology",
    status: "abnormal",
    summary: "Minor abnormality detected in lower right lung. Follow-up recommended.",
    icon: <FileText />,
  },
  {
    id: "rec3",
    type: "Prescription",
    title: "Metformin Prescription",
    date: "2023-05-10",
    doctor: "Dr. Sarah Chen",
    department: "Endocrinology",
    status: "active",
    summary: "500mg twice daily for diabetes management.",
    icon: <Clipboard />,
  },
  {
    id: "rec4",
    type: "Vaccination",
    title: "Influenza Vaccine",
    date: "2023-03-05",
    doctor: "Dr. Michael Lee",
    department: "Immunization Clinic",
    status: "completed",
    summary: "Annual flu vaccination administered.",
    icon: <Syringe />,
  },
  {
    id: "rec5",
    type: "Consultation Note",
    title: "Annual Physical Examination",
    date: "2023-02-18",
    doctor: "Dr. Lisa Wong",
    department: "General Practice",
    status: "normal",
    summary: "Overall health is good. Recommended lifestyle adjustments for weight management.",
    icon: <Stethoscope />,
  },
];

const allergy = [
  { id: 1, allergen: "Penicillin", severity: "High", symptoms: "Rash, Difficulty Breathing", diagnosed: "2018-03-15" },
  { id: 2, allergen: "Peanuts", severity: "Moderate", symptoms: "Hives, Swelling", diagnosed: "2015-07-22" },
];

const immunizations = [
  { id: 1, vaccine: "Influenza (Flu)", date: "2023-03-05", provider: "Dr. Michael Lee" },
  { id: 2, vaccine: "COVID-19", date: "2022-08-15", provider: "Community Vaccination Center" },
  { id: 3, vaccine: "Tetanus Booster", date: "2021-04-12", provider: "Dr. Sarah Chen" },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "abnormal":
      return "bg-red-100 text-red-800";
    case "active":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRecordIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "lab result":
      return <Activity size={16} />;
    case "imaging":
      return <FileText size={16} />;
    case "prescription":
      return <Clipboard size={16} />;
    case "vaccination":
      return <Syringe size={16} />;
    case "consultation note":
      return <Stethoscope size={16} />;
    default:
      return <FileText size={16} />;
  }
};

const RecordDetail = ({ record }: { record: any }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-full bg-medical-100">
          {record.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{record.title}</h3>
          <p className="text-sm text-gray-500">{record.type}</p>
        </div>
      </div>
      <Badge className={getStatusColor(record.status)}>
        {record.status}
      </Badge>
    </div>
    
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{formatDate(record.date)}</p>
      </div>
      <div>
        <p className="text-gray-500">Doctor</p>
        <p className="font-medium">{record.doctor}</p>
      </div>
      <div>
        <p className="text-gray-500">Department</p>
        <p className="font-medium">{record.department}</p>
      </div>
    </div>
    
    <div className="pt-2 border-t">
      <p className="text-gray-500 text-sm mb-1">Summary</p>
      <p>{record.summary}</p>
    </div>
    
    <div className="flex space-x-2 pt-2">
      <Button variant="outline" className="flex-1">
        <Download size={16} className="mr-2" />
        Download
      </Button>
      <Button className="flex-1 bg-medical-500 hover:bg-medical-600">
        <Eye size={16} className="mr-2" />
        View Full Report
      </Button>
    </div>
  </div>
);

const HealthRecords = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredRecords = medicalRecords.filter(record => 
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPatientRecords = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="vaccination">Vaccinations</SelectItem>
                <SelectItem value="consultation">Consultations</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <FileUp size={16} className="mr-2" />
              Upload Record
            </Button>
          </div>
        </div>

        <Tabs defaultValue="records">
          <TabsList className="mb-4">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records">
            <div className="grid gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <Card key={record.id} className="medical-card hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button 
                            className="p-4 w-full text-left flex justify-between items-center" 
                            onClick={() => setSelectedRecord(record)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-full ${getStatusColor(record.status).split(' ')[0]}`}>
                                {getRecordIcon(record.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{record.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {formatDate(record.date)}
                                  </span>
                                  <span>{record.doctor}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Medical Record Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about this medical record
                            </DialogDescription>
                          </DialogHeader>
                          <RecordDetail record={record} />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="allergies">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Allergies & Adverse Reactions</CardTitle>
                <CardDescription>List of known allergies and adverse reactions</CardDescription>
              </CardHeader>
              <CardContent>
                {allergy.length > 0 ? (
                  <div className="space-y-4">
                    {allergy.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-full mr-3">
                              <AlertTriangle size={16} className="text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.allergen}</h4>
                              <p className="text-sm text-gray-500">Diagnosed: {formatDate(item.diagnosed)}</p>
                            </div>
                          </div>
                          <Badge className={`${
                            item.severity.toLowerCase() === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : item.severity.toLowerCase() === 'moderate'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.severity} Severity
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Symptoms:</span> {item.symptoms}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p>No allergies recorded.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Report New Allergy
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="immunizations">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Immunization Records</CardTitle>
                <CardDescription>History of vaccinations</CardDescription>
              </CardHeader>
              <CardContent>
                {immunizations.length > 0 ? (
                  <div className="space-y-4">
                    {immunizations.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-full mr-3">
                            <Syringe size={16} className="text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.vaccine}</h4>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(item.date)}
                              </span>
                              <span>{item.provider}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p>No immunization records found.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Add Immunization Record
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderDoctorRecords = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Patient Records</h3>
            <p className="text-sm text-gray-500">Search and view patient medical records</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Users size={16} className="mr-2" />
              Select Patient
            </Button>
            <Button>
              <FileUp size={16} className="mr-2" />
              Upload Record
            </Button>
          </div>
        </div>
        
        <Card className="medical-card p-4">
          <div className="text-center py-6">
            <Users size={40} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">Select a patient to view records</h3>
            <p className="text-sm text-gray-500 mt-1">
              You can search for patients by name, ID, or phone number
            </p>
            <div className="max-w-md mx-auto mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search for a patient..." className="pl-10" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderHospitalRecords = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Emergency Access</h3>
            <p className="text-sm text-gray-500">Access patient records for emergency care</p>
          </div>
          <Button className="bg-emergency hover:bg-emergency-dark">
            <AlertTriangle size={16} className="mr-2" />
            Emergency Access
          </Button>
        </div>
        
        <Card className="border-emergency-light">
          <CardHeader>
            <CardTitle className="text-emergency-dark">Emergency Record Access</CardTitle>
            <CardDescription>
              This feature allows emergency access to critical patient information when immediate care is needed.
              All access is logged and audited for compliance with privacy regulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-emergency-light/50 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="text-emergency-dark mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-emergency-dark">Emergency Use Only</h4>
                    <p className="text-sm mt-1">
                      This feature should only be used in genuine medical emergencies where the patient is unable to provide consent 
                      and immediate access to their medical history is necessary for proper treatment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Identifier</label>
                  <Input placeholder="Enter ID, SSN, or medical record number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Access Code</label>
                  <Input type="password" placeholder="Enter hospital emergency code" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Emergency Access</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for emergency access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unconscious">Unconscious Patient</SelectItem>
                    <SelectItem value="critical">Critical Condition</SelectItem>
                    <SelectItem value="unresponsive">Unresponsive Patient</SelectItem>
                    <SelectItem value="transfer">Emergency Transfer</SelectItem>
                    <SelectItem value="other">Other Emergency Situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-emergency hover:bg-emergency-dark">Access Emergency Records</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderRecordsForRole = () => {
    switch (user?.role) {
      case "patient":
        return renderPatientRecords();
      case "doctor":
        return renderDoctorRecords();
      case "hospital":
        return renderHospitalRecords();
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Health Records</h2>
        <p className="text-muted-foreground">
          {user?.role === "patient" 
            ? "View and manage your health records" 
            : user?.role === "doctor"
            ? "Access and update patient health records"
            : "Emergency access to patient records"}
        </p>
      </div>
      {renderRecordsForRole()}
    </div>
  );
};

export default HealthRecords;
