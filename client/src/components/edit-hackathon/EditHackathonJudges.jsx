import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Mail, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/lib/axios-setup";

export default function EditHackathonJudges({ hackathonId }) {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState("registered"); // 'registered' or 'external'

  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [externalEmails, setExternalEmails] = useState([""]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch existing judges
  const fetchJudges = async () => {
    if (!hackathonId) return;

    setLoading(true);
    try {
      const response = await apiClient.get(
        `/judges/hackathons/${hackathonId}/judges`
      );
      if (response.success) {
        setJudges(response.data);
      }
    } catch (error) {
      console.error("Error fetching judges:", error);
      toast.error("Failed to fetch judges");
    } finally {
      setLoading(false);
    }
  };

  // Search registered users
  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await apiClient.get(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      if (response.success) {
        // Filter out already assigned judges
        const assignedUserIds = judges
          .filter((judge) => judge.userId)
          .map((judge) => judge.userId);

        const filteredResults = response.data.filter(
          (user) => !assignedUserIds.includes(user.id)
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Handle external email changes
  const updateExternalEmail = (index, value) => {
    setExternalEmails((prev) => {
      const newEmails = [...prev];
      newEmails[index] = value;
      return newEmails;
    });
  };

  const addExternalEmailField = () => {
    setExternalEmails((prev) => [...prev, ""]);
  };

  const removeExternalEmailField = (index) => {
    setExternalEmails((prev) => prev.filter((_, i) => i !== index));
  };

  // Assign judges
  const assignJudges = async () => {
    const judgeData = [];

    if (assignmentType === "registered") {
      selectedUsers.forEach((user) => {
        judgeData.push({ userId: user.id });
      });
    } else {
      externalEmails
        .filter((email) => email.trim())
        .forEach((email) => {
          judgeData.push({ externalJudgeEmail: email.trim() });
        });
    }

    if (judgeData.length === 0) {
      toast.error("Please select users or enter email addresses");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        `/judges/hackathons/${hackathonId}/judges`,
        {
          judges: judgeData,
        }
      );

      if (response.success) {
        toast.success("Judges assigned successfully!");
        setIsDialogOpen(false);
        resetForm();
        fetchJudges();
      }
    } catch (error) {
      console.error("Error assigning judges:", error);
      toast.error(error.response?.data?.message || "Failed to assign judges");
    } finally {
      setLoading(false);
    }
  };

  // Remove judge
  const removeJudge = async (judgeId) => {
    setLoading(true);
    try {
      const response = await apiClient.delete(
        `/judges/hackathons/${hackathonId}/judges/${judgeId}`
      );

      if (response.success) {
        toast.success("Judge removed successfully!");
        fetchJudges();
      }
    } catch (error) {
      console.error("Error removing judge:", error);
      toast.error("Failed to remove judge");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUsers([]);
    setExternalEmails([""]);
    setAssignmentType("registered");
  };

  useEffect(() => {
    fetchJudges();
  }, [hackathonId]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (assignmentType === "registered") {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, assignmentType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Judges Management</h3>
          <p className="text-sm text-muted-foreground">
            Assign and manage judges for your hackathon
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Judges
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Judges to Hackathon</DialogTitle>
            </DialogHeader>

            <Tabs value={assignmentType} onValueChange={setAssignmentType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="registered">Registered Users</TabsTrigger>
                <TabsTrigger value="external">External Judges</TabsTrigger>
              </TabsList>

              <TabsContent value="registered" className="space-y-4">
                <div>
                  <Label htmlFor="userSearch">Search Users</Label>
                  <Input
                    id="userSearch"
                    placeholder="Search by name, username, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {searchLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <Label>Search Results</Label>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedUsers.some((u) => u.id === user.id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {user.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              @{user.username} • {user.email}
                            </p>
                          </div>
                          {selectedUsers.some((u) => u.id === user.id) && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Users ({selectedUsers.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <Badge
                          key={user.id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleUserSelection(user)}
                        >
                          {user.fullName} ✕
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="external" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    External judges will receive email invitations to
                    participate in judging.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label>Judge Email Addresses</Label>
                  {externalEmails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="judge@example.com"
                        value={email}
                        onChange={(e) =>
                          updateExternalEmail(index, e.target.value)
                        }
                      />
                      {externalEmails.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeExternalEmailField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addExternalEmailField}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Add Another Email
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={assignJudges} disabled={loading}>
                {loading ? "Assigning..." : "Assign Judges"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Judges List */}
      <div className="space-y-4">
        <h4 className="font-medium">Current Judges ({judges.length})</h4>

        {judges.length > 0 && (
          <div className="text-sm text-muted-foreground mb-4">
            <p>
              <strong>Registered Users:</strong>{" "}
              {judges.filter((j) => j.userId).length}
            </p>
            <p>
              <strong>External Judges:</strong>{" "}
              {judges.filter((j) => !j.userId).length}
            </p>
          </div>
        )}

        {loading && judges.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading judges...</p>
          </div>
        ) : judges.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No judges assigned yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by assigning judges to help evaluate submissions.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Assign First Judge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {judges.map((judge) => (
              <Card key={judge.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        {judge.userId ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {judge.userId ? (
                          <>
                            <p className="font-medium truncate">
                              {judge.user?.fullName || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              @{judge.user?.username} • {judge.user?.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium truncate">
                              External Judge
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {judge.externalJudgeEmail}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeJudge(judge.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant={judge.userId ? "default" : "secondary"}>
                      {judge.userId ? "Registered" : "External"}
                    </Badge>
                    {judge.userId && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Active User
                      </Badge>
                    )}
                    {!judge.userId && (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                      >
                        Invitation Sent
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
