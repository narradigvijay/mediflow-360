
import { useState } from "react";
import { Search, AlertTriangle, MapPin, Hospital, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for hospital medications
const MOCK_HOSPITALS = [
  {
    id: "h1",
    name: "General Hospital",
    distance: 1.2,
    address: "123 Medical Ave, Healthville",
    phone: "(555) 123-4567",
    medications: [
      { name: "Insulin", available: true, quantity: 250, unit: "vials" },
      { name: "Epinephrine", available: true, quantity: 120, unit: "injections" },
      { name: "Morphine", available: true, quantity: 75, unit: "doses" },
      { name: "Amoxicillin", available: true, quantity: 350, unit: "tablets" },
      { name: "Lisinopril", available: false, quantity: 0, unit: "tablets" },
    ]
  },
  {
    id: "h2",
    name: "Community Medical Center",
    distance: 2.8,
    address: "456 Healthcare Blvd, Medicstown",
    phone: "(555) 987-6543",
    medications: [
      { name: "Insulin", available: true, quantity: 120, unit: "vials" },
      { name: "Epinephrine", available: false, quantity: 0, unit: "injections" },
      { name: "Morphine", available: true, quantity: 45, unit: "doses" },
      { name: "Amoxicillin", available: true, quantity: 200, unit: "tablets" },
      { name: "Lisinopril", available: true, quantity: 180, unit: "tablets" },
    ]
  },
  {
    id: "h3",
    name: "St. Mary's Hospital",
    distance: 3.5,
    address: "789 Wellness Rd, Healthton",
    phone: "(555) 456-7890",
    medications: [
      { name: "Insulin", available: false, quantity: 0, unit: "vials" },
      { name: "Epinephrine", available: true, quantity: 80, unit: "injections" },
      { name: "Morphine", available: true, quantity: 60, unit: "doses" },
      { name: "Amoxicillin", available: true, quantity: 175, unit: "tablets" },
      { name: "Lisinopril", available: true, quantity: 220, unit: "tablets" },
    ]
  },
];

const MedicationAvailability = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a medication name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = MOCK_HOSPITALS.filter(hospital => 
        hospital.medications.some(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) && med.available
        )
      ).map(hospital => ({
        ...hospital,
        matchingMedications: hospital.medications.filter(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) && med.available
        )
      }));

      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No hospitals found",
          description: `No hospitals have "${searchTerm}" available right now.`,
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-medical-800">Emergency Medication Locator</h2>
        <p className="text-muted-foreground">Find nearby hospitals with specific medications available</p>
      </div>
      
      <Card className="bg-emergency-light/20 border-emergency">
        <CardHeader className="bg-emergency-light/50 border-b border-emergency/20">
          <CardTitle className="flex items-center text-emergency-dark">
            <AlertTriangle className="mr-2" size={20} />
            Emergency Medication Search
          </CardTitle>
          <CardDescription>
            Quickly locate hospitals that have your needed medication in stock
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Enter medication name (e.g., Insulin, Epinephrine)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              className="bg-emergency hover:bg-emergency-dark"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Find Medication Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available at {searchResults.length} hospital{searchResults.length !== 1 ? 's' : ''}</h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">{hospital.distance} miles</Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {hospital.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Available Medications:</p>
                    {hospital.matchingMedications.map((med: any, index: number) => (
                      <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <Pill size={16} className="mr-2 text-medical-500" />
                          <span>{med.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {med.quantity} {med.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <Hospital size={14} className="inline mr-1" />
                    {hospital.phone}
                  </div>
                  <Button variant="outline" size="sm">
                    Get Directions
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationAvailability;
