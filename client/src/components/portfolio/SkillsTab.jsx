import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function SkillsTab({
  formState,
  setFormState,
  handleProfileSubmit,
  loading,
}) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !formState.skills.includes(skill)) {
      setFormState({
        ...formState,
        skills: [...formState.skills, skill],
      });
    }
    setInputValue("");
  };

  const removeSkill = (idx) => {
    setFormState({
      ...formState,
      skills: formState.skills.filter((_, i) => i !== idx),
    });
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleProfileSubmit(e);
      }}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="skills">Skills</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formState.skills.map((skill, idx) => (
            <Badge
              key={idx}
              variant="default"
              className="flex items-center gap-1 bg-primary/30 text-foreground/70"
            >
              {skill}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeSkill(idx)}
                aria-label={`Remove ${skill}`}
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>
        <Input
          id="skills"
          placeholder="Type a skill and press Space or Enter to add"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
              e.preventDefault();
              addSkill();
            }
          }}
        />
      </div>
      <Button type="submit" className="self-end btn" disabled={loading}>
        Save
      </Button>
    </form>
  );
}
