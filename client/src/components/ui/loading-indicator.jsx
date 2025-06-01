import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingIndicator({
  message = "Loading...",
  fullScreen = true,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        fullScreen ? "min-h-screen" : "py-10",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
