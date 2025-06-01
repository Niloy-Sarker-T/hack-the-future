import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AvatarUploadDialog from "@/components/portfolio/AvatarUploadDialog";
import { Button } from "@/components/ui/button";

export default function ProfileTab({
  formState,
  setFormState,
  handleProfileSubmit,
  loading,
  error,
  success,
  preview,
  setPreview,
  user,
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
      <div className="flex items-center gap-4">
        <AvatarUploadDialog
          currentAvatar={preview}
          userName={user?.fullName}
          userId={user.id}
          onUploaded={setPreview}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="First Name"
          value={formState.firstName}
          onChange={(e) =>
            setFormState({ ...formState, firstName: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Last Name"
          value={formState.lastName}
          onChange={(e) =>
            setFormState({ ...formState, lastName: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
          disabled
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formState.bio}
          onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="userName">Username</Label>
        <Input
          id="userName"
          placeholder="Username"
          value={formState.userName}
          onChange={(e) =>
            setFormState({ ...formState, userName: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Location"
          value={formState.location}
          onChange={(e) =>
            setFormState({ ...formState, location: e.target.value })
          }
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <Button type="submit" className="self-end btn" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
