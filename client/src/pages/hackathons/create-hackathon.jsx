import puzzle from "@/assets/HB_Illustration.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/axios-setup";
import userStore from "@/store/user-store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateHackathonPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  if (!user) {
    navigate("/login");
    return null; // Prevent rendering if user is not logged in
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (user.role !== "organizer") {
        const res = await apiClient.put("/users/role", {
          role: "organizer",
        });
        userStore.setState({ user: { ...user, role: "organizer" } });
        toast.success("Role updated to Organizer!", {
          description: "You can now create hackathons.",
          richColors: true,
          duration: 5000,
          position: "top-right",
          icon: "✅",
        });
      }
      const res = await apiClient.post("/hackathons", { title });
      // Assuming res.data contains the created hackathon object with id

      const hackathonId = res.data.id;
      navigate(`/hackathons/${hackathonId}/edit`);
      toast.success("Hackathon created successfully!", {
        description: "You can now edit your hackathon details.",
        richColors: true,
        duration: 5000,
        position: "top-right",
        icon: "🎉",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create hackathon"
      );
      console.error("Error creating hackathon:", err);

      toast.error(error, {
        description:
          "Please try again or contact support if the issue persists.",
        richColors: true,
        duration: 5000,
        position: "top-right",
        action: {
          label: "Retry",
          onClick: () => handleSubmit(e), // Retry the submission
        },
        icon: "🚨",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="my-28">
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl animate-fade-in">
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:flex items-center justify-center bg-accent/20">
              {/* Illustration or icon */}
              <img
                src={puzzle}
                alt="Puzzle Illustration"
                className="w-2/3 h-full"
              />
            </div>
            <form
              className="flex flex-col justify-evenly"
              onSubmit={handleSubmit}
            >
              <h1 className="text-2xl font-bold mb-2">
                Create a New Hackathon
              </h1>
              <Label className="mb-2 ml-2" htmlFor="title">
                Hackathon Title <sup className="text-red-500">*</sup>
              </Label>
              <Input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                required
                type="text"
                autoFocus
                autoComplete="off"
                disabled={loading}
                placeholder="Hackathon Title"
                className="mb-4"
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Hackathon"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// This page allows users to create a new hackathon by entering a title.
