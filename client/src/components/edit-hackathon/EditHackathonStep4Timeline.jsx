import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EditHackathonStep4Timeline({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Registration Deadline</Label>
        <Input
          type="date"
          value={formData.registrationDeadline?? ""}
          onChange={(e) =>
            setFormData((f) => ({
              ...f,
              registrationDeadline: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <Label>Submission Deadline</Label>
        <Input
          type="date"
          value={formData.submissionDeadline?? ""}
          onChange={(e) =>
            setFormData((f) => ({
              ...f,
              submissionDeadline: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
}
