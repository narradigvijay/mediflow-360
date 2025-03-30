
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-medical-50 to-medical-100 px-4">
      <div className="text-center">
        <div className="bg-white p-4 rounded-full inline-block mb-4">
          <LockKeyhole className="h-16 w-16 text-medical-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-medical-800">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="space-y-2">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-medical-600 hover:bg-medical-700 w-full"
          >
            Return to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
