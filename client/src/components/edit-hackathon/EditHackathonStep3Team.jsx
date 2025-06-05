import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function EditHackathonStep3Team({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Minimum Team Size</Label>
        <Input
          type="number"
          min={1}
          max={formData.maxTeamSize}
          value={formData.minTeamSize}
          onChange={(e) =>
            setFormData((f) => ({
              ...f,
              minTeamSize: Number(e.target.value),
            }))
          }
        />
      </div>
      <div>
        <Label>Maximum Team Size</Label>
        <Input
          type="number"
          min={formData.minTeamSize}
          value={formData.maxTeamSize}
          onChange={(e) =>
            setFormData((f) => ({
              ...f,
              maxTeamSize: Number(e.target.value),
            }))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={formData.allowSoloParticipation}
          onCheckedChange={(checked) =>
            setFormData((f) => ({
              ...f,
              allowSoloParticipation: checked,
            }))
          }
        />
        <Label>Allow Solo Participation</Label>
      </div>
    </div>
  );
}
