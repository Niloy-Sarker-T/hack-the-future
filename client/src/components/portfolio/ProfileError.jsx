import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProfileError = ({ error, onRetry, type = "general" }) => {
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (type === "user-not-found") {
      return {
        title: "User Not Found",
        description:
          "The user profile you're looking for doesn't exist or has been removed.",
        suggestion:
          "Check the username and try again, or browse other profiles.",
      };
    }

    if (type === "network") {
      return {
        title: "Connection Error",
        description:
          "Unable to load the profile. Please check your internet connection.",
        suggestion: "Try refreshing the page or check your network connection.",
      };
    }

    return {
      title: "Something Went Wrong",
      description:
        error || "An unexpected error occurred while loading the profile.",
      suggestion:
        "Please try again or contact support if the problem persists.",
    };
  };

  const { title, description, suggestion } = getErrorMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-white">{title}</h1>

            <p className="text-gray-400 mb-4">{description}</p>

            <p className="text-sm text-gray-500">{suggestion}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-[#14B8A6] hover:bg-[#0E9384] text-white flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A] hover:text-white flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileError;
