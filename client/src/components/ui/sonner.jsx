import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  // For now, use dark theme by default. You can implement theme context later if needed
  const theme = "dark";

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
};

export { Toaster };
