import { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import useHackathonStore from "@/store/hackathon-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditHackathonStep2Markdown from "@/components/edit-hackathon/EditHackathonStep2Markdown";
import EditHackathonStep3Team from "@/components/edit-hackathon/EditHackathonStep3Team";
import EditHackathonStep4Timeline from "@/components/edit-hackathon/EditHackathonStep4Timeline";
import userStore from "@/store/user-store";

const TAB_KEYS = ["basic", "details", "team", "timeline"];

export default function EditHackathonPage() {
  const { currentHackathon, setCurrentHackathon, updateHackathon } =
    useHackathonStore();
  const user = userStore((state) => state.user);

  const [formData, setFormData] = useState({
    ...currentHackathon,
  });
  const { hackathonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromUrl && TAB_KEYS.includes(tabFromUrl) ? tabFromUrl : "basic"
  );

  // Sync tab with URL
  useEffect(() => {
    if (
      tabFromUrl &&
      TAB_KEYS.includes(tabFromUrl) &&
      tabFromUrl !== activeTab
    ) {
      setActiveTab(tabFromUrl);
    }
    // eslint-disable-next-line
  }, [tabFromUrl]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== tabFromUrl) {
      searchParams.set("tab", activeTab);
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    async function loadHackathon() {
      if (!currentHackathon) {
        setCurrentHackathon({});
      }
      if (hackathonId) {
        const hackathon = await useHackathonStore
          .getState()
          .getHackathonById(hackathonId);
        setCurrentHackathon(hackathon);
        setFormData(hackathon);
      }
    }
    loadHackathon();
    if (currentHackathon && currentHackathon.createdBy !== user?.id) {
      return <Navigate to="/login" replace />;
    }
    // eslint-disable-next-line
  }, [hackathonId, setCurrentHackathon]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (type, url) => {
    setCurrentHackathon({ ...currentHackathon, [type]: url });
    setFormData({ ...formData, [type]: url });
  };

  const handleSave = async () => {
    await updateHackathon(formData.id, formData);
    // Add toast or navigation as needed
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Edit Hackathon</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 overflow-x-auto">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team Rules</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Input
            label="Title"
            value={formData?.title ?? ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Hackathon Title"
          />
          <Input
            label="Organizer"
            value={formData?.organizeBy ?? ""}
            onChange={(e) => handleChange("organizeBy", e.target.value)}
            placeholder="Organizer Name"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              type="banner"
              currentImage={formData?.banner}
              onUpload={(url) => handleImageUpload("banner", url)}
            />
            <ImageUpload
              type="thumbnail"
              currentImage={formData?.thumbnail}
              onUpload={(url) => handleImageUpload("thumbnail", url)}
            />
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <EditHackathonStep2Markdown
            formData={formData}
            setFormData={setFormData}
          />
        </TabsContent>

        {/* Team Rules Tab */}
        <TabsContent value="team" className="space-y-6">
          <EditHackathonStep3Team
            formData={formData}
            setFormData={handleChange}
          />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <EditHackathonStep4Timeline
            formData={formData}
            setFormData={handleChange}
          />
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-6 w-full md:w-auto self-end">
        Save Changes
      </Button>
    </div>
  );
}
