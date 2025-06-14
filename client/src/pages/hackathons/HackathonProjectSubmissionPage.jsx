import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHackathonStore from "@/store/hackathon-store";
import userStore from "@/store/user-store";
import apiClient from "@/lib/axios-setup";
import HackathonProjectForm from "@/components/hackathons/HackathonProjectForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HackathonProjectSubmissionPage() {
  const { hackathonId } = useParams();
  const { currentHackathon: hackathon, getHackathonById } = useHackathonStore();
  const user = userStore((state) => state.user);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hackathonId) {
      loadData();
    }
  }, [hackathonId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load hackathon details
      if (!hackathon || hackathon.id !== hackathonId) {
        await getHackathonById(hackathonId);
      }

      // Check user registration status
      if (user) {
        await checkRegistrationStatus();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load hackathon details");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await apiClient.get(
        `/hackathons/${hackathonId}/participants/me`
      );
      setRegistrationStatus(response.data);
    } catch (error) {
      // User not registered
      setRegistrationStatus(null);
      toast.error(
        "You must be registered for this hackathon to submit a project"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            Hackathon not found
          </h1>
          <p className="text-lg text-gray-600">
            The hackathon you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            Authentication Required
          </h1>
          <p className="text-lg text-gray-600">
            Please log in to submit a project for this hackathon.
          </p>
        </div>
      </div>
    );
  }

  if (!registrationStatus) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            Registration Required
          </h1>
          <p className="text-lg text-gray-600">
            You must be registered for this hackathon to submit a project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <HackathonProjectForm
      hackathon={hackathon}
      registrationStatus={registrationStatus}
    />
  );
}
