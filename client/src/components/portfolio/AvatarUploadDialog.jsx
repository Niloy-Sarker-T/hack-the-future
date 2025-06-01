import { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { apiService } from "@/lib/api-services";
import { toast } from "sonner";
import userStore from "@/store/user-store";
import { compressFile } from "@/lib/compress-file";

export default function AvatarUploadDialog({
  currentAvatar,
  userName,
  userId,
  onUploaded,
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(currentAvatar || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const updateUser = userStore((state) => state.updateUser);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
      setOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressFile(file);
      const res = await apiService.uploadUserAvatar(userId, compressed);

      toast.success("Profile picture updated!", {
        description: "Your new avatar has been uploaded.",
        richColors: true,
        duration: 3000,
        action: {
          label: "x",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      updateUser({
        avatarUrl: res?.data?.avatarUrl,
      });
      if (onUploaded) onUploaded(preview);
      setOpen(false);
      setFile(null);
    } catch (err) {
      toast.error("Upload failed", {
        description:
          err.response?.data?.message ||
          err.message ||
          "Failed to upload avatar.",
        richColors: true,
        duration: 3000,
        action: {
          label: "x",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <Avatar
        onClick={() => fileInputRef.current?.click()}
        className="w-24 h-24"
      >
        <AvatarImage src={currentAvatar} alt={userName || "Profile"} />
        <AvatarFallback>{userName?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload New Picture
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Avatar Upload</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col items-center gap-4 mt-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={preview} alt={userName || "Profile"} />
                  <AvatarFallback>{userName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span>
                  Are you sure you want to upload this as your new profile
                  picture?
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => {
                setOpen(false);
                setFile(null);
                setPreview(currentAvatar || "");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="button" disabled={loading} onClick={handleUpload}>
              {loading ? "Uploading..." : "Confirm & Upload"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
