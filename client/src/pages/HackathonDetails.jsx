import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useHackathonStore from "@/store/hackathon-store";
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
} from "lucide-react";
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
  const hackathonId = useParams().hackathonId;
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (hackathonId) {
      getHackathonById(hackathonId)
        .then((res) => {
          if (res.success) {
            setCurrentHackathon(res.data);
          } else {
            console.error("Failed to fetch hackathon details:", res.error);
          }
        })
        .catch((error) => {
          setCurrentHackathon({
            id: "57f6fda0-e2f6-4f64-90f3-c2ce1bc4b424",
            title: "Javafest",
            description: "<p>Build an web application using Java.</p>",
            requirements: "<p>We encourage to build AI application.</p>",
            judgingCriteria: "<p>Creativity(50%) expert(50%</p>",
            themes: ["Beginner Friendly", "Machine Learning/AI", "Web"],
            thumbnail: null,
            banner:
              "https://res.cloudinary.com/aznath/image/upload/v1749327507/hackathons/hackathon-57f6fda0-e2f6-4f64-90f3-c2ce1bc4b424.png",
            status: "upcoming",
            maxTeamSize: 4,
            minTeamSize: 1,
            allowSoloParticipation: true,
            organizeBy: "Therap",
            createdBy: "e0554a25-89b7-4b63-9a48-59a07cfa57b2",
            createdAt: "2025-06-02T18:43:41.005Z",
            updatedAt: "2025-06-07T20:18:28.885Z",
            registrationDeadline: "2025-06-13T18:00:00.000Z",
            submissionDeadline: "2025-06-22T18:00:00.000Z",
          });
          console.error("Error fetching hackathon details:", error);
        });
    }
  }, [hackathonId, getHackathonById, setCurrentHackathon]);

  console.log("Current Hackathon: ", hackathon);

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
              </AlertDescription>
            </Alert>
            <Alert className="bg-white shadow-lg border-l-4 border-l-orange-500">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Submission deadline:</strong>
                <br />
                {formatDate(hackathon.submissionDeadline)}
              </AlertDescription>
            </Alert>
            <Alert className="bg-white shadow-lg border-l-4 border-l-green-500">
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Team size:</strong>
                <br />
                {hackathon.minTeamSize} - {hackathon.maxTeamSize} members
              </AlertDescription>
            </Alert>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link to={`/hackathons/${hackathon.id}/apply`}>
              <Button size="lg" className="px-8">
                Register Now
              </Button>
            </Link>
            <Link to={`/hackathons/${hackathon.id}/projects`}>
              <Button variant="outline" size="lg">
                <Trophy className="w-4 h-4 mr-2" />
                View Projects
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleNativeShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
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
