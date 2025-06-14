import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  UserX,
  Users,
  Mail,
  Shield,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios-setup";

export default function JudgeManagement({ hackathonId, isOrganizer = false }) {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newJudge, setNewJudge] = useState({
    email: "",
    role: "judge",
  });

  useEffect(() => {
    if (hackathonId) {
      loadJudges();
    }
  }, [hackathonId]);

  const loadJudges = async () => {
    try {
      const response = await apiClient.get(
        `/judges/hackathons/${hackathonId}/judges`
      );
      setJudges(response.data || []);
    } catch (error) {
      console.error("Error loading judges:", error);
      toast.error("Failed to load judges");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJudge = async () => {
    if (!newJudge.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(`/judges/hackathons/${hackathonId}/judges`, {
        judges: [
          {
            email: newJudge.email,
            role: newJudge.role,
          },
        ],
      });

      toast.success("Judge assigned successfully!");
      setDialogOpen(false);
      setNewJudge({ email: "", role: "judge" });
      loadJudges();
    } catch (error) {
      console.error("Error adding judge:", error);
      toast.error(error.response?.data?.message || "Failed to assign judge");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveJudge = async (judgeId) => {
    try {
      await apiClient.delete(
        `/judges/hackathons/${hackathonId}/judges/${judgeId}`
      );
      toast.success("Judge removed successfully!");
      loadJudges();
    } catch (error) {
      console.error("Error removing judge:", error);
      toast.error("Failed to remove judge");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "judge":
        return "bg-blue-100 text-blue-800";
      case "mentor":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Judges & Mentors
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage judges and mentors for this hackathon
          </p>
        </div>

        {isOrganizer && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Judge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Judge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="judge@example.com"
                    value={newJudge.email}
                    onChange={(e) =>
                      setNewJudge((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The judge will receive an email notification about their
                    assignment
                  </p>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newJudge.role}
                    onValueChange={(value) =>
                      setNewJudge((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="judge">Judge</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddJudge}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Assign Judge
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>

      <CardContent>
        {judges.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No judges assigned</h3>
            <p className="text-muted-foreground mb-4">
              {isOrganizer
                ? "Assign judges to evaluate projects for this hackathon."
                : "No judges have been assigned to this hackathon yet."}
            </p>
            {isOrganizer && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Judge
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {judges.map((judge) => (
              <div
                key={judge.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {judge.judge?.avatarUrl ? (
                      <img
                        src={judge.judge.avatarUrl}
                        alt={judge.judge.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <Users className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {judge.judge?.fullName || judge.externalJudgeEmail}
                      </h4>
                      <Badge className={getRoleBadgeColor(judge.role)}>
                        {judge.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {judge.judge?.email || judge.externalJudgeEmail}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Assigned {new Date(judge.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {isOrganizer && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Judge</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this judge from the
                          hackathon? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveJudge(judge.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
