import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useHackathonStore from "@/store/hackathon-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditHackathonStep2Markdown from "@/components/edit-hackathon/EditHackathonStep2Markdown";
import EditHackathonStep3Team from "@/components/edit-hackathon/EditHackathonStep3Team";
import EditHackathonStep4Timeline from "@/components/edit-hackathon/EditHackathonStep4Timeline";
import EditHackathonJudges from "@/components/edit-hackathon/EditHackathonJudges";
import userStore from "@/store/user-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { THEMES } from "@/constants/themes";
import { set } from "date-fns";

const TAB_KEYS = ["basic", "details", "team", "timeline", "judges"];

export default function EditHackathonPage() {
  const {
    loading,
    currentHackathon,
    setCurrentHackathon,
    getHackathonById,
    updateHackathon,
    uploadImage,
  } = useHackathonStore();
  const user = userStore((state) => state.user);

  const { hackathonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromUrl && TAB_KEYS.includes(tabFromUrl) ? tabFromUrl : "basic"
  );

  const [imageDialog, setImageDialog] = useState({
    open: false,
    type: null,
    file: null,
    preview: null,
  });
  const fileInputRef = useRef();

  // Theme options for the hackathon
  const THEME_OPTIONS = THEMES;

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
        const res = await getHackathonById(hackathonId);
        if (!res.success) {
          toast.error("Hackathon not found", {
            richColors: true,
          });
          return;
        }
        if (res.data && res.data.createdBy !== user?.id) {
          window.location.replace("/");
        }
        const hackathon = res.data;
        setFormData({
          ...hackathon,
        });
        await setCurrentHackathon({ ...res.data });
      }
    }
    loadHackathon();
  }, [hackathonId]);

  const [formData, setFormData] = useState({
    ...currentHackathon,
  });

  const [images, setImages] = useState({
    banner: "",
  });

  // Update images state when currentHackathon changes
  useEffect(() => {
    if (currentHackathon) {
      setImages({
        banner: currentHackathon.banner || "",
      });
    }
  }, [currentHackathon]);
  console.log("formData", formData);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageInputClick = (type) => {
    setImageDialog({ open: false, type: null, file: null, preview: null });
    fileInputRef.current.type = "file";
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageDialog({
          open: true,
          type,
          file,
          preview: URL.createObjectURL(file),
        });
      }
    };
    fileInputRef.current.click();
  };

  const handleImageDialogUpload = async () => {
    if (!imageDialog.file || !imageDialog.type) return;

    try {
      const res = await uploadImage(
        imageDialog.file,
        imageDialog.type,
        hackathonId
      );

      console.log("Image upload response:", res);
      console.log("Hackathon ID:", hackathonId);

      // Update local images state to reflect the new upload
      if (res.success) {
        setImages((prev) => ({
          ...prev,
          [imageDialog.type]: res.data?.url,
        }));

        setCurrentHackathon((prev) => ({
          ...prev,
          [imageDialog.type]: res.data?.url,
        }));

        setImageDialog({ open: false, type: null, file: null, preview: null });

        toast.success("Image uploaded successfully!", {
          richColors: true,
        });
      } else {
        toast.error(
          res.message || "Failed to upload image. Please try again.",
          {
            richColors: true,
          }
        );
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.", {
        richColors: true,
      });
    }
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      registrationDeadline: new Date(formData.registrationDeadline) || null,
      submissionDeadline: new Date(formData.submissionDeadline) || null,
      themes: Array.isArray(formData.themes) ? formData.themes : [],
    };
    // if any keys value is null or undefined, then change it to empty string
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        value === null || value === undefined ? "" : value,
      ])
    );
    const res = await updateHackathon(formData.id, filteredPayload);
    if (!res.success) {
      toast.error(res.message || "Failed to update hackathon", {
        richColors: true,
      });
      console.error("Update Hackathon Error:", res);
      return;
    }
    setCurrentHackathon({ ...res.data });
    toast.success(res.message || "Hackathon updated successfully", {
      richColors: true,
    });
    console.log("Updated Hackathon:", res.data);
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
          <TabsTrigger value="judges">Judges</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab - Simplified with banner upload */}
        <TabsContent value="basic" className="space-y-6">
          <div>
            <Label className="block mb-2 font-medium">Hackathon Title</Label>
            <Input
              value={formData?.title ?? ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter hackathon title"
              className="w-full"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">Organized By</Label>
            <Input
              value={formData?.organizeBy ?? ""}
              onChange={(e) => handleChange("organizeBy", e.target.value)}
              placeholder="Enter organizer name"
              className="w-full"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">Themes</Label>
            <div className="flex flex-wrap gap-2">
              {THEME_OPTIONS.map((theme) => (
                <Button
                  key={theme}
                  type="button"
                  variant={
                    formData.themes?.includes(theme) ? "default" : "outline"
                  }
                  onClick={() => {
                    const themes = formData.themes || [];
                    const newThemes = themes.includes(theme)
                      ? themes.filter((t) => t !== theme)
                      : themes.length < 3
                      ? [...themes, theme]
                      : themes; // Limit to 3 themes
                    setFormData({
                      ...formData,
                      themes: newThemes,
                    });
                  }}
                  className={
                    formData.themes?.includes(theme)
                      ? "bg-primary text-white"
                      : ""
                  }
                  disabled={
                    !formData.themes?.includes(theme) &&
                    formData.themes?.length >= 3
                  }
                >
                  {theme}
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Select up to 3 themes ({formData.themes?.length || 0}/3 selected)
            </div>
          </div>

          <div>
            <Label className="block mb-2 font-medium">Banner Image</Label>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleImageInputClick("banner")}
                className="w-full md:w-auto"
              >
                {images.banner ? "Change Banner Image" : "Upload Banner Image"}
              </Button>

              {/* Current uploaded banner image */}
              {images.banner && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Current Banner:
                  </div>
                  <img
                    src={images.banner}
                    alt="Current Banner"
                    className="w-full max-w-md h-40 object-cover rounded border"
                  />
                </div>
              )}

              {/* Preview of selected image (before upload) */}
              {imageDialog.type === "banner" && imageDialog.preview && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Preview (not saved yet):
                  </div>
                  <img
                    src={imageDialog.preview}
                    alt="Banner Preview"
                    className="w-full max-w-md h-40 object-cover rounded border-2 border-dashed border-primary"
                  />
                </div>
              )}
            </div>
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
            setFormData={setFormData}
          />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <EditHackathonStep4Timeline
            formData={formData}
            setFormData={setFormData}
          />
        </TabsContent>

        {/* Judges Tab */}
        <TabsContent value="judges" className="space-y-6">
          <EditHackathonJudges hackathonId={hackathonId} />
        </TabsContent>
      </Tabs>

      {/* Hidden file input for image uploads */}
      <input ref={fileInputRef} type="file" className="hidden" />

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialog.open}
        onOpenChange={(open) => setImageDialog((d) => ({ ...d, open }))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Banner Image</DialogTitle>
          </DialogHeader>
          {imageDialog.preview && (
            <div className="space-y-3">
              <img
                src={imageDialog.preview}
                alt="Image Preview"
                className="w-full h-48 object-cover rounded border"
              />
              <p className="text-sm text-muted-foreground">
                Preview of your selected image. Click "Upload" to save it.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setImageDialog({
                  open: false,
                  type: null,
                  file: null,
                  preview: null,
                })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleImageDialogUpload}>Upload Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button onClick={handleSave} className="mt-6 w-full md:w-auto self-end">
        Save Changes
      </Button>
    </div>
  );
}
