import { Badge } from "@/components/ui/badge";

export default function HackathonThemeChips({ themes }) {
  if (!themes || !themes.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mb-1">
      {themes.map((theme) => (
        <Badge key={theme} variant="secondary" className="text-xs">
          {theme}
        </Badge>
      ))}
    </div>
  );
}
