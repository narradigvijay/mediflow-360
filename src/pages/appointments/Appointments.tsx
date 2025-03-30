
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  User,
  CheckCircle,
  X,
  MessageCircle,
  MoreVertical,
  VideoIcon,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data
const doctors = [
  {
    id: 1,
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    hospital: "Medical Center",
    image: "https://i.pravatar.cc/150?img=5",
    availableDates: ["2023-06-15", "2023-06-16", "2023-06-18", "2023-06-20"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Practitioner",
    hospital: "Community Clinic",
    image: "https://i.pravatar.cc/150?img=11",
    availableDates: ["2023-06-16", "2023-06-17", "2023-06-19", "2023-06-20"],
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    hospital: "University Hospital",
    image: "https://i.pravatar.cc/150?img=19",
    availableDates: ["2023-06-15", "2023-06-17", "2023-06-19", "2023-06-21"],
  },
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const patientAppointments = [
  {
    id: 1,
    doctor: "Dr. Jane Smith",
    specialty: "Cardiologist",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "upcoming",
    type: "in-person",
    location: "Medical Center, Room 305",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "2023-05-28",
    time: "02:30 PM",
    status: "completed",
    type: "in-person",
    location: "Community Clinic, Room 102",
  },
  {
    id: 3,
    doctor: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    date: "2023-06-20",
    time: "11:00 AM",
    status: "upcoming",
    type: "virtual",
    location: "Video Consultation Link",
  },
];

const doctorAppointments = [
  {
    id: 1,
    patient: "John Doe",
    reason: "Annual checkup",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "upcoming",
    type: "in-person",
    location: "Room 305",
  },
  {
    id: 2,
    patient: "Alice Smith",
    reason: "Blood pressure follow-up",
    date: "2023-06-15",
    time: "11:00 AM",
    status: "upcoming",
    type: "in-person",
    location: "Room 305",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    reason: "Chest pain evaluation",
    date: "2023-06-15",
    time: "02:00 PM",
    status: "upcoming",
    type: "virtual",
    location: "Video Consultation",
    priority: "high",
  },
  {
    id: 4,
    patient: "Mary Williams",
    reason: "Medication review",
    date: "2023-05-28",
    time: "02:30 PM",
    status: "completed",
    type: "in-person",
    location: "Room 102",
  },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  return type === "virtual" ? (
    <VideoIcon size={14} className="mr-1" />
  ) : (
    <User size={14} className="mr-1" />
  );
};

const Appointments = () => {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  const resetBookingForm = () => {
    setSelectedDoctor(null);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setAppointmentReason("");
    setAppointmentType("in-person");
    setIsBookingComplete(false);
  };

  const handleBookAppointment = () => {
    // In a real app, this would send a request to the server
    setIsBookingComplete(true);
    setTimeout(() => {
      setShowBookingDialog(false);
      resetBookingForm();
    }, 3000);
  };

  const renderPatientAppointments = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Your Appointments</h3>
            <p className="text-sm text-gray-500">
              Manage your scheduled appointments
            </p>
          </div>
          <Button onClick={() => setShowBookingDialog(true)}>
            <PlusCircle size={16} className="mr-2" />
            Book Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {patientAppointments
                .filter((apt) => apt.status === "upcoming")
                .map((appointment) => (
                  <Card key={appointment.id} className="medical-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="bg-medical-100 p-3 rounded-full">
                            <CalendarIcon size={20} className="text-medical-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.doctor}</h4>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
                              <span className="flex items-center">
                                <CalendarIcon size={14} className="mr-1" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center">
                                {getTypeIcon(appointment.type)}
                                {appointment.type === "virtual" ? "Video Call" : appointment.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle size={14} className="mr-1" />
                          Message
                        </Button>
                        {appointment.type === "virtual" ? (
                          <Button size="sm" className="bg-medical-500 hover:bg-medical-600">
                            <VideoIcon size={14} className="mr-1" />
                            Join Video
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-medical-500 hover:bg-medical-600">
                            Get Directions
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Cancel Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="space-y-4">
              {patientAppointments
                .filter((apt) => apt.status === "completed")
                .map((appointment) => (
                  <Card key={appointment.id} className="medical-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle size={20} className="text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.doctor}</h4>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
                              <span className="flex items-center">
                                <CalendarIcon size={14} className="mr-1" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center">
                                {getTypeIcon(appointment.type)}
                                {appointment.type === "virtual" ? "Video Call" : appointment.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" size="sm">
                          View Summary
                        </Button>
                        <Button size="sm" className="bg-medical-500 hover:bg-medical-600">
                          Book Follow-up
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isBookingComplete ? "Appointment Booked!" : "Book an Appointment"}</DialogTitle>
              <DialogDescription>
                {isBookingComplete 
                  ? "Your appointment has been scheduled successfully." 
                  : "Schedule an appointment with a healthcare provider."}
              </DialogDescription>
            </DialogHeader>

            {isBookingComplete ? (
              <div className="py-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Appointment Confirmed</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Your appointment details have been sent to your email.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Doctor</label>
                    <Select value={selectedDoctor?.id?.toString()} onValueChange={(value) => {
                      const doctor = doctors.find(doc => doc.id.toString() === value);
                      setSelectedDoctor(doctor);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDoctor && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              disabled={(date) => {
                                // Convert date to string format used in availableDates
                                const dateStr = format(date, "yyyy-MM-dd");
                                // Disable dates that are not in the doctor's available dates or in the past
                                return (
                                  !selectedDoctor.availableDates.includes(dateStr) ||
                                  date < new Date()
                                );
                              }}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Select Time</label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Appointment Type</label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In-Person Visit</SelectItem>
                        <SelectItem value="virtual">Video Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                    <Textarea
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                      placeholder="Briefly describe the reason for your appointment"
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleBookAppointment} 
                    disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason}
                    className="bg-medical-500 hover:bg-medical-600"
                  >
                    Book Appointment
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const renderDoctorAppointments = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Your Schedule</h3>
            <p className="text-sm text-gray-500">
              Manage your upcoming appointments
            </p>
          </div>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Today</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <Button>
              <PlusCircle size={16} className="mr-2" />
              Add Appointment
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>{formatDate(new Date().toISOString().split('T')[0])}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorAppointments
                .filter((apt) => apt.status === "upcoming")
                .map((appointment) => (
                  <Card key={appointment.id} className={cn(
                    "border-l-4",
                    appointment.priority === "high" ? "border-l-red-500" : "border-l-medical-500"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            "p-3 rounded-full",
                            appointment.priority === "high" ? "bg-red-100" : "bg-medical-100"
                          )}>
                            {appointment.priority === "high" ? (
                              <AlertCircle size={20} className="text-red-600" />
                            ) : (
                              <User size={20} className="text-medical-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">{appointment.patient}</h4>
                              {appointment.priority === "high" && (
                                <Badge className="ml-2 bg-red-100 text-red-800">High Priority</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{appointment.reason}</p>
                            
                            <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center">
                                {getTypeIcon(appointment.type)}
                                {appointment.type === "virtual" ? "Video Call" : appointment.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" size="sm">
                          <User size={14} className="mr-1" />
                          Patient Records
                        </Button>
                        {appointment.type === "virtual" ? (
                          <Button size="sm" className="bg-medical-500 hover:bg-medical-600">
                            <VideoIcon size={14} className="mr-1" />
                            Start Video
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-medical-500 hover:bg-medical-600">
                            Start Appointment
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Schedule</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              <div className="py-3">
                <h4 className="text-sm font-medium">Tomorrow, June 16</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1 text-medical-500" />
                      09:00 AM
                    </span>
                    <span>David Wilson - Annual checkup</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1 text-medical-500" />
                      02:30 PM
                    </span>
                    <span>Emma Brown - Follow-up consultation</span>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <h4 className="text-sm font-medium">Friday, June 17</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1 text-medical-500" />
                      10:00 AM
                    </span>
                    <span>James Thompson - New patient</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAppointmentsForRole = () => {
    switch (user?.role) {
      case "patient":
        return renderPatientAppointments();
      case "doctor":
        return renderDoctorAppointments();
      default:
        return <div className="text-center py-10">This feature is not available for your role.</div>;
    }
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <p className="text-muted-foreground">
          {user?.role === "patient"
            ? "Schedule and manage your appointments with healthcare providers"
            : "View and manage your patient appointments"}
        </p>
      </div>
      {renderAppointmentsForRole()}
    </div>
  );
};

export default Appointments;
