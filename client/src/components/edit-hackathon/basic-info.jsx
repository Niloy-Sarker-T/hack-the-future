import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditHackathonStep1Basic({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((f) => ({ ...f, title: e.target.value }))
          }
          placeholder="Hackathon Title"
          required
        />
      </div>
      <div>
        <Label>
          Organizer <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.organizeBy}
          onChange={(e) =>
            setFormData((f) => ({ ...f, organizeBy: e.target.value }))
          }
          placeholder="Organizer Name"
          required
        />
      </div>
      <div>
        <Label>Banner Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData((f) => ({ ...f, banner: URL.createObjectURL(file) }));
            }
          }}
        />
        {formData.banner && (
          <img
            src={formData.banner}
            alt="Banner"
            className="mt-2 w-full max-h-40 object-cover rounded"
          />
        )}
      </div>
      <div>
        <Label>Thumbnail Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData((f) => ({
                ...f,
                thumbnail: URL.createObjectURL(file),
              }));
            }
          }}
        />
        {formData.thumbnail && (
          <img
            src={formData.thumbnail}
            alt="Thumbnail"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
}
