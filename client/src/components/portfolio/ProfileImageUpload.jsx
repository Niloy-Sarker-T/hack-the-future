import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios-setup";

export default function ProfileImageUpload({ onSuccess, onClose }) {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axiosInstance.post(
        "/api/auth/profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (onSuccess) onSuccess(res.data.data.avatarUrl);
      if (onClose) onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block text-sm font-medium text-white">
        Select new profile image
      </label>
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={loading}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover border mx-auto"
        />
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
