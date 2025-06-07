import { Badge } from "@/components/ui/badge";

export default function HackathonStatusChip({ status }) {
  let variant = "secondary";
  if (status === "ongoing") variant = "default";
  else if (status === "upcoming") variant = "secondary";
  else if (status === "ended") variant = "destructive";
  return (
    <Badge variant={variant} className="text-xs">
      {status}
    </Badge>
  );
}
