import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useHackathonStore from "@/store/hackathon-store";
import userStore from "@/store/user-store";
import apiClient from "@/lib/axios-setup";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  Share2,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Info,
  Target,
  FileText,
  Settings,
  User,
  UserX,
  Loader2,
  Edit3,
} from "lucide-react";
import JudgeManagement from "@/components/hackathons/JudgeManagement";
import EvaluationResults from "@/components/hackathons/EvaluationResults";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { set } from "date-fns";

export default function HackathonDetails() {
  const {
    currentHackathon: hackathon,
    getHackathonById,
    setCurrentHackathon,
  } = useHackathonStore();
  const user = userStore((state) => state.user);
  const hackathonId = useParams().hackathonId;
  const [currentUrl, setCurrentUrl] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [changeTypeDialogOpen, setChangeTypeDialogOpen] = useState(false);

  useEffect(() => {
    if (hackathonId) {
      loadHackathonData();
      if (user) {
        checkRegistrationStatus();
      }
    }
  }, [hackathonId, user]);

  const loadHackathonData = async () => {
    try {
      const res = await getHackathonById(hackathonId);
      if (res.success) {
        setCurrentHackathon(res.data);
      } else {
        console.error("Failed to fetch hackathon details:", res.error);
      }
    } catch (error) {
      console.error("Error fetching hackathon details:", error);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get(
        `/hackathons/${hackathonId}/participants/me`
      );
      console.log("Registration status response:", response);
      setRegistrationStatus(response.data);
    } catch (error) {
      // Not registered or other error
      setRegistrationStatus(null);
    }
  };

  const handleWithdrawRegistration = async () => {
    setLoading(true);
    try {
      await apiClient.delete(
        `/hackathon-registration/${hackathonId}/registration`
      );
      toast.success("Successfully withdrawn from hackathon");
      setRegistrationStatus(null);
      setWithdrawDialogOpen(false);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error(
        error.response?.data?.error || "Failed to withdraw registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRegistrationType = async (newType) => {
    setLoading(true);
    try {
      await apiClient.put(
        `/hackathon-registration/${hackathonId}/registration`,
        {
          participationType: newType,
        }
      );
      toast.success(`Successfully changed to ${newType} participation`);
      setRegistrationStatus({
        ...registrationStatus,
        participationType: newType,
      });
      setChangeTypeDialogOpen(false);
    } catch (error) {
      console.error("Update registration error:", error);
      toast.error(
        error.response?.data?.error || "Failed to update registration"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Add Open Graph meta tags dynamically
  useEffect(() => {
    if (hackathon) {
      // Update page title
      document.title = `${hackathon.title} - Hack the Future`;

      // Remove existing meta tags
      const existingMeta = document.querySelectorAll(
        'meta[property^="og:"], meta[name="twitter:"], meta[name="description"]'
      );
      existingMeta.forEach((tag) => tag.remove());

      // Create new meta tags
      const metaTags = [
        { property: "og:title", content: hackathon.title },
        {
          property: "og:description",
          content:
            hackathon.description?.replace(/<[^>]*>/g, "") ||
            `Join ${hackathon.title} organized by ${hackathon.organizeBy}`,
        },
        {
          property: "og:image",
          content: hackathon.banner || "/default-hackathon-banner.jpg",
        },
        { property: "og:url", content: window.location.href },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Hack the Future" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: hackathon.title },
        {
          name: "twitter:description",
          content:
            hackathon.description?.replace(/<[^>]*>/g, "") ||
            `Join ${hackathon.title} organized by ${hackathon.organizeBy}`,
        },
        {
          name: "twitter:image",
          content: hackathon.banner || "/default-hackathon-banner.jpg",
        },
        {
          name: "description",
          content:
            hackathon.description?.replace(/<[^>]*>/g, "") ||
            `Join ${hackathon.title} organized by ${hackathon.organizeBy}`,
        },
      ];

      metaTags.forEach(({ property, name, content }) => {
        const meta = document.createElement("meta");
        if (property) meta.setAttribute("property", property);
        if (name) meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      });
    }

    // Cleanup function
    return () => {
      const metaToRemove = document.querySelectorAll(
        'meta[property^="og:"], meta[name="twitter:"]'
      );
      metaToRemove.forEach((tag) => tag.remove());
    };
  }, [hackathon]);

  const shareData = {
    title: hackathon?.title || "Hackathon",
    text: `Check out ${hackathon?.title} organized by ${hackathon?.organizeBy}! Join this exciting hackathon.`,
    url: currentUrl,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          fallbackCopyToClipboard();
        }
      }
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied!", {
        description: "The hackathon link has been copied to your clipboard.",
        richColors: true,
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Copy failed", {
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
        richColors: true,
        duration: 3000,
      });
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.text
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  if (!hackathon) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            Hackathon not found
          </h1>
          <p className="text-lg text-gray-600">
            The hackathon you are looking for does not exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "To be announced";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Avatar */}
      <div className="relative">
        {hackathon.banner ? (
          <div className="relative h-64 overflow-hidden">
            <img
              src={hackathon.banner}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-r from-primary to-primary/80"></div>
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex items-center gap-6 text-white">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarFallback className="text-2xl font-bold text-primary">
                  {hackathon.organizeBy?.charAt(0) || "H"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getStatusColor(hackathon.status)}>
                    {hackathon.status}
                  </Badge>
                  {hackathon.allowSoloParticipation && (
                    <Badge
                      variant="outline"
                      className="text-white border-white"
                    >
                      Solo Friendly
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">{hackathon.title}</h1>
                <p className="text-xl opacity-90">by {hackathon.organizeBy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats with Alert Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 -mt-16 relative z-10">
            <Alert className="bg-white shadow-lg border-l-4 border-l-primary">
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Registration ends:</strong>
                <br />
                {formatDate(hackathon.registrationDeadline)}
                {new Date() >
                  new Date(hackathon.registrationDeadline || new Date()) && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Closed
                  </Badge>
                )}
              </AlertDescription>
            </Alert>
            <Alert className="bg-white shadow-lg border-l-4 border-l-orange-500">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Submission deadline:</strong>
                <br />
                {formatDate(hackathon.submissionDeadline)}
                {new Date() >
                  new Date(hackathon.submissionDeadline || new Date()) && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Closed
                  </Badge>
                )}
              </AlertDescription>
            </Alert>
            <Alert className="bg-white shadow-lg border-l-4 border-l-green-500">
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Team size:</strong>
                <br />
                {hackathon.minTeamSize} - {hackathon.maxTeamSize} members
                {registrationStatus && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    You: {registrationStatus.participationType}
                  </Badge>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* Registration Status Banner */}
          {user && (
            <div className="mb-6">
              {registrationStatus ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="flex items-center justify-between">
                      <span>
                        ✅ You're registered as a{" "}
                        <strong>{registrationStatus.participationType}</strong>{" "}
                        participant
                        {registrationStatus.teamId && (
                          <span>
                            {" "}
                            with team ID: {registrationStatus.teamId}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-green-600">
                        Joined on{" "}
                        {new Date(
                          registrationStatus.joinedAt || new Date()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : new Date() <=
                new Date(hackathon.registrationDeadline || new Date()) ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    🎯 You haven't registered yet. Registration is open until{" "}
                    <strong>
                      {new Date(
                        hackathon.registrationDeadline
                      ).toLocaleDateString()}
                    </strong>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-50 border-red-200">
                  <Clock className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    ⏰ Registration has closed. This hackathon is no longer
                    accepting new participants.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-6 mb-8">
            {user ? (
              registrationStatus ? (
                // User is registered - show registered status and options
                <div className="w-full max-w-4xl">
                  {/* Registration Status Card */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-green-800">
                              Registration Confirmed
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {registrationStatus.participationType
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  registrationStatus.participationType?.slice(
                                    1
                                  )}{" "}
                                Participant
                              </Badge>
                              {/* {registrationStatus.teamId && (
                                <Badge
                                  variant="outline"
                                  className="text-green-700 border-green-300"
                                >
                                  Team: {registrationStatus.teamId}
                                </Badge>
                              )} */}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-green-700 text-center md:text-right">
                          <div>Registered on</div>
                          <div className="font-medium">
                            {new Date(
                              registrationStatus.joinedAt || new Date()
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Manage Registration */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full h-12"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Registration
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-56">
                        {/* Change registration type if possible */}
                        {new Date() <
                          new Date(hackathon.registrationDeadline) && (
                          <Dialog
                            open={changeTypeDialogOpen}
                            onOpenChange={setChangeTypeDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Change Participation Type
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Change Participation Type
                                </DialogTitle>
                                <DialogDescription>
                                  You are currently registered as a{" "}
                                  <strong>
                                    {registrationStatus.participationType}
                                  </strong>{" "}
                                  participant. Would you like to change your
                                  participation type?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {registrationStatus.participationType !==
                                  "solo" &&
                                  hackathon.allowSoloParticipation && (
                                    <Button
                                      className="w-full"
                                      variant="outline"
                                      onClick={() =>
                                        handleChangeRegistrationType("solo")
                                      }
                                      disabled={loading}
                                    >
                                      {loading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      <User className="w-4 h-4 mr-2" />
                                      Switch to Solo Participation
                                    </Button>
                                  )}
                                {registrationStatus.participationType !==
                                  "team" && (
                                  <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() =>
                                      handleChangeRegistrationType("team")
                                    }
                                    disabled={loading}
                                  >
                                    {loading && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Users className="w-4 h-4 mr-2" />
                                    Switch to Team Participation
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Team management for team participants */}
                        {registrationStatus.participationType === "team" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/hackathons/${hackathon.id}/teams/select`}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Manage Team
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/hackathons/${hackathon.id}/teams/browse`}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Browse Teams
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Withdraw registration */}
                        <Dialog
                          open={withdrawDialogOpen}
                          onOpenChange={setWithdrawDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Withdraw Registration
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Withdraw Registration</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to withdraw from this
                                hackathon? This action cannot be undone and you
                                may lose your team position.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setWithdrawDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleWithdrawRegistration}
                                disabled={loading}
                              >
                                {loading && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Withdraw
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Submit Project Button */}
                    {new Date() <=
                      new Date(hackathon.submissionDeadline || new Date()) && (
                      <Link
                        to={`/hackathons/${hackathon.id}/submit`}
                        className="w-full"
                      >
                        <Button size="lg" className="w-full h-12">
                          <Trophy className="w-4 h-4 mr-2" />
                          Submit Project
                        </Button>
                      </Link>
                    )}

                    {/* Team Management Buttons for Team Participants */}
                    {registrationStatus.participationType === "team" && (
                      <>
                        <Link
                          to={`/hackathons/${hackathon.id}/teams/${registrationStatus.teamId}`}
                          className="w-full"
                        >
                          <Button
                            variant="secondary"
                            size="lg"
                            className="w-full h-12"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            My Team
                          </Button>
                        </Link>
                        <Link
                          to={`/hackathons/${hackathon.id}/teams/browse`}
                          className="w-full"
                        >
                          <Button
                            variant="secondary"
                            size="lg"
                            className="w-full h-12"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Browse Teams
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // User is not registered - show register button
                <div className="w-full max-w-md">
                  <Link
                    to={`/hackathons/${hackathon.id}/apply`}
                    className="w-full"
                  >
                    <Button size="lg" className="w-full px-8 py-3 text-lg h-12">
                      Register Now
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              // User is not logged in - show register button
              <div className="w-full max-w-md">
                <Link
                  to={`/hackathons/${hackathon.id}/apply`}
                  className="w-full"
                >
                  <Button size="lg" className="w-full px-8 py-3 text-lg h-12">
                    Register Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Common buttons for all users */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-2xl">
              <Link
                to={`/hackathons/${hackathon.id}/projects`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full h-12">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleNativeShare}
                className="w-full sm:w-auto h-12"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="criteria" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Judging
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Hackathon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: hackathon.description }}
                  />

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-medium mb-3">Themes & Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {hackathon.themes?.map((theme, index) => (
                        <Badge key={index} variant="secondary">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  {hackathon.requirements && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: hackathon.requirements,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="criteria" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Judging Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hackathon.judgingCriteria && (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: hackathon.judgingCriteria,
                        }}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Judge Management - Only visible to organizers */}
                {user && hackathon.createdBy === user.id && (
                  <>
                    <JudgeManagement hackathonId={hackathon.id} />
                    <EvaluationResults hackathonId={hackathon.id} />
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="teams" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Team size: {hackathon.minTeamSize} -{" "}
                      {hackathon.maxTeamSize} members
                    </AlertDescription>
                  </Alert>

                  {hackathon.allowSoloParticipation && (
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        Solo participation is welcomed and encouraged!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Submissions</CardTitle>
                    <Link to={`/hackathons/${hackathon.id}/projects`}>
                      <Button variant="outline">View All Projects</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Projects & Submissions
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      View all project submissions for this hackathon
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link to={`/hackathons/${hackathon.id}/projects`}>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Browse Projects
                        </Button>
                      </Link>
                      {new Date() <=
                        new Date(
                          hackathon.submissionDeadline || new Date()
                        ) && (
                        <Link to={`/hackathons/${hackathon.id}/submit`}>
                          <Button>
                            <Trophy className="w-4 h-4 mr-2" />
                            Submit Project
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
