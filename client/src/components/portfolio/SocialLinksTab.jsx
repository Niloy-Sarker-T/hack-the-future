import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SocialLinksTab({
  formState,
  setFormState,
  handleProfileSubmit,
  loading,
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          placeholder="GitHub URL"
          value={formState.socialLinks.github}
          onChange={(e) =>
            setFormState({
              ...formState,
              socialLinks: { ...formState.socialLinks, github: e.target.value },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          placeholder="LinkedIn URL"
          value={formState.socialLinks.linkedin}
          onChange={(e) =>
            setFormState({
              ...formState,
              socialLinks: {
                ...formState.socialLinks,
                linkedin: e.target.value,
              },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          placeholder="Twitter URL"
          value={formState.socialLinks.twitter}
          onChange={(e) =>
            setFormState({
              ...formState,
              socialLinks: {
                ...formState.socialLinks,
                twitter: e.target.value,
              },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          placeholder="Website URL"
          value={formState.socialLinks.website}
          onChange={(e) =>
            setFormState({
              ...formState,
              socialLinks: {
                ...formState.socialLinks,
                website: e.target.value,
              },
            })
          }
        />
      </div>
      <Button type="submit" className="self-end btn" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
