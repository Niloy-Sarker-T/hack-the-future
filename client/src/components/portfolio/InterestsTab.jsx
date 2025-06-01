import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const INTEREST_OPTIONS = [
  "Beginner Friendly",
  "Machine Learning/AI",
  "Web",
  "Blockchain",
  "Mobile",
  "Health",
  "Education",
  "Gaming",
  "Fintech",
  "IoT",
  "Cybersecurity",
  "DevOps",
  "Productivity",
  "Design",
  "AR/VR",
  "Social Good",
];

export default function InterestsTab({
  formState,
  setFormState,
  handleProfileSubmit,
  loading,
}) {
  const maxSelections = 5;
  const selectedCount = formState.interests.length;

  const toggleInterest = (interest) => {
    setFormState({
      ...formState,
      interests: formState.interests.includes(interest)
        ? formState.interests.filter((i) => i !== interest)
        : [...formState.interests, interest],
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
        <Label htmlFor="interests">Interests</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = formState.interests.includes(interest);
            const isDisabled = !isSelected && selectedCount >= maxSelections;
            return (
              <Button
                type="button"
                key={interest}
                variant={isSelected ? "default" : "outline"}
                className={`justify-start ${
                  isSelected ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => toggleInterest(interest)}
                disabled={isDisabled}
              >
                {interest}
              </Button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {selectedCount} / {maxSelections} selected
        </div>
      </div>
      <Button type="submit" className="self-end btn" disabled={loading}>
        Save
      </Button>
    </form>
  );
}
