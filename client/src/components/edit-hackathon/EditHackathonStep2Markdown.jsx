import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function EditHackathonStep2Markdown({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div id="hackathon-description">
        <Label className="text-lg font-semibold mb-2">Description</Label>
        <RichTextEditor
          key={"description-editor"}
          placeholder="Describe your hackathon..."
          content={formData?.description ?? ""}
          onChange={(value) =>
            setFormData((f) => ({ ...f, ["description"]: value }))
          }
        />
      </div>
      <div id="hackathon-requirements">
        <Label className="text-lg font-semibold mb-2">Requirements</Label>
        <RichTextEditor
          key={"requirements-editor"}
          placeholder="Requirements..."
          content={formData?.requirements ?? ""}
          onChange={(value) =>
            setFormData((f) => ({ ...f, ["requirements"]: value }))
          }
        />
      </div>
      <div id="hackathon-judging-criteria">
        <Label className="text-lg font-semibold mb-2">Judging Criteria</Label>
        <RichTextEditor
          key={"judging-criteria-editor"}
          placeholder="Judging criteria..."
          content={formData?.judgingCriteria ?? ""}
          onChange={(value) =>
            setFormData((f) => ({ ...f, ["judgingCriteria"]: value }))
          }
        />
      </div>
    </div>
  );
}
