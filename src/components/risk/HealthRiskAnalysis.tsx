import { useState } from "react";
import { Activity, Heart, AlertTriangle, FileText, ArrowUpRight, BarChart3, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for patient health metrics
const MOCK_HEALTH_DATA = {
  bloodPressure: { systolic: 138, diastolic: 88, history: [120, 124, 130, 135, 138] },
  cholesterol: { total: 210, ldl: 130, hdl: 45, history: [180, 190, 200, 205, 210] },
  bloodSugar: { fasting: 110, a1c: 5.8, history: [100, 102, 105, 108, 110] },
  heartRate: { resting: 78, history: [72, 75, 73, 76, 78] },
  bmi: { value: 27.5, history: [26.8, 27.0, 27.2, 27.4, 27.5] },
  metrics: [
    { name: "Cardiovascular Risk", value: 65, trend: "increasing", severity: "moderate" },
    { name: "Diabetes Risk", value: 45, trend: "stable", severity: "low" },
    { name: "Hypertension Risk", value: 72, trend: "increasing", severity: "high" },
    { name: "Obesity Risk", value: 58, trend: "stable", severity: "moderate" }
  ]
};

const getRiskColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "text-green-500";
    case "moderate":
      return "text-orange-500";
    case "high":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getProgressColor = (value: number) => {
  if (value < 40) return "bg-green-500";
  if (value < 70) return "bg-orange-500";
  return "bg-red-500";
};

const getTrendIcon = (trend: string) => {
  if (trend === "increasing") return <ArrowUpRight className="h-4 w-4 text-red-500" />;
  if (trend === "decreasing") return <ArrowUpRight className="h-4 w-4 rotate-180 text-green-500" />;
  return null;
};

const HealthRiskAnalysis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "Risk Analysis Complete",
        description: "Your health risk analysis has been updated with the latest data.",
      });
    }, 2000);
  };

  // Only show the analysis button for patients
  const showAnalysisButton = user?.role === "patient";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-medical-800">Health Risk Analysis</h2>
        <p className="text-muted-foreground">
          {user?.role === "patient" 
            ? "View your personal health risk assessment based on your medical records" 
            : "View patient health risk assessment based on their medical records"}
        </p>
      </div>

      {!showResults ? (
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Health Risk Assessment</CardTitle>
            <CardDescription>
              Our advanced AI algorithm analyzes your health records to identify potential risks
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-16 w-16 text-medical-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Analyze Your Health Data</h3>
              <p className="mb-6 max-w-md text-muted-foreground">
                The analysis uses your latest health records, lab results, and medical history to provide personalized risk assessments.
              </p>
              {showAnalysisButton && (
                <Button 
                  className="bg-medical-600 hover:bg-medical-700"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Start Health Risk Analysis"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Risk Summary</CardTitle>
              <CardDescription>
                Based on your recent health records and medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {MOCK_HEALTH_DATA.metrics.map((metric) => (
                  <Card key={metric.name} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        {metric.name}
                        {getTrendIcon(metric.trend)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xl font-bold ${getRiskColor(metric.severity)}`}>
                            {metric.value}%
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                            {metric.severity}
                          </span>
                        </div>
                        <Progress value={metric.value} className={getProgressColor(metric.value)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="metrics">
            <TabsList className="mb-4">
              <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      <CardTitle className="text-base">Blood Pressure</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">
                          {MOCK_HEALTH_DATA.bloodPressure.systolic}/{MOCK_HEALTH_DATA.bloodPressure.diastolic}
                        </span>
                        <span className="text-sm text-orange-500">Slightly Elevated</span>
                      </div>
                      <p className="text-xs text-gray-500">Normal range: Less than 120/80 mmHg</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      <CardTitle className="text-base">Cholesterol</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{MOCK_HEALTH_DATA.cholesterol.total} mg/dL</span>
                        <span className="text-sm text-orange-500">Borderline High</span>
                      </div>
                      <p className="text-xs text-gray-500">Normal range: Less than 200 mg/dL</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-green-500" />
                      <CardTitle className="text-base">Blood Sugar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{MOCK_HEALTH_DATA.bloodSugar.fasting} mg/dL</span>
                        <span className="text-sm text-orange-500">Prediabetic</span>
                      </div>
                      <p className="text-xs text-gray-500">Normal range: Less than 100 mg/dL</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Health Recommendations</CardTitle>
                  <CardDescription>
                    Based on your risk assessment, we recommend the following actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-orange-800">Blood Pressure Management</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Your blood pressure is slightly elevated. Consider reducing sodium intake, 
                          increasing physical activity, and monitoring your blood pressure regularly.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <Heart className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Cardiovascular Health</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Schedule a follow-up with your cardiologist in the next 3 months.
                          Consider increasing omega-3 fatty acids in your diet and reducing saturated fats.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <Stethoscope className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Lifestyle Modifications</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Aim for 150 minutes of moderate aerobic activity per week.
                          Reduce alcohol consumption and eliminate tobacco use if applicable.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Download Full Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default HealthRiskAnalysis;
