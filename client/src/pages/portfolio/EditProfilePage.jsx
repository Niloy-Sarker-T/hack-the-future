import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { apiService } from "@/lib/api-services";
import userStore from "@/store/user-store";
import { toast } from "sonner";
import ProfileTab from "@/components/portfolio/ProfileTab";
import SocialLinksTab from "@/components/portfolio/SocialLinksTab";
import SkillsTab from "@/components/portfolio/SkillsTab";
import InterestsTab from "@/components/portfolio/InterestsTab";
import ProfileTabsSidebar from "@/components/portfolio/ProfileTabsSidebar";

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "social-links", label: "Social Links" },
  { value: "skills", label: "Skills" },
  { value: "interests", label: "Interests" },
];

export default function EditProfilePage() {
  const query = new URLSearchParams(window.location.search);
  const urlTab = query.get("tab");
  const [tab, setTab] = useState(urlTab ?? "profile");
  const user = userStore.getState().user;
  const updateUser = userStore((state) => state.updateUser);

  // update url with the selected tab
  const updateUrlWithTab = (newTab) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", newTab);
    window.history.replaceState({}, "", newUrl);
  };

  // For previewing new profile picture
  const [preview, setPreview] = useState(
    user?.avatarUrl !== "avatar"
      ? user?.avatarUrl || user?.fullName[0]
      : user?.fullName?.[0] || "U"
  );

  const [formState, setFormState] = useState({
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    email: user?.email || "",
    bio: user?.bio || "",
    userName: user?.userName || "",
    location: user?.location || "",
    skills: user?.skills || [],
    interests: user?.interests || [],
    socialLinks: user?.socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const filteredSocialLinks = Object.fromEntries(
      Object.entries(formState.socialLinks).filter(
        ([_, v]) => v && v.trim() !== ""
      )
    );

    const submitData = {
      ...formState,
      socialLinks: filteredSocialLinks,
    };

    try {
      const res = await apiService.updateUserProfile(user.id, submitData);
      setSuccess("Profile updated!");

      toast.success("Profile updated!", {
        description:
          res.message || "Your profile information was saved successfully.",
        action: {
          label: "x",
          onClick: () => toast.dismiss(),
        },
        richColors: true,
        duration: 3000,
      });
      updateUser(res?.data?.user || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
      toast.error("Update failed", {
        description: err.response?.data?.message || "Failed to update profile.",
        action: {
          label: "x",
          onClick: () => toast.dismiss(),
        },
        richColors: true,
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setSuccess("");
      setError("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="mb-2">
          <CardTitle className="text-xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <ProfileTabsSidebar
              tab={tab}
              setTab={setTab}
              TABS={TABS}
              updateUrlWithTab={updateUrlWithTab}
            />
            {/* Tab Content */}
            <div className="md:w-3/4 w-full">
              <Tabs value={tab} className="w-full">
                <TabsContent value="profile">
                  <ProfileTab
                    formState={formState}
                    setFormState={setFormState}
                    handleProfileSubmit={handleProfileSubmit}
                    loading={loading}
                    error={error}
                    success={success}
                    preview={preview}
                    setPreview={setPreview}
                    user={user}
                  />
                </TabsContent>
                <TabsContent value="social-links">
                  <SocialLinksTab
                    formState={formState}
                    setFormState={setFormState}
                    handleProfileSubmit={handleProfileSubmit}
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsTab
                    formState={formState}
                    setFormState={setFormState}
                    handleProfileSubmit={handleProfileSubmit}
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="interests">
                  <InterestsTab
                    formState={formState}
                    setFormState={setFormState}
                    handleProfileSubmit={handleProfileSubmit}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
