import { useState, useEffect, u } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import useHackathonStore from "@/store/hackathon-store";

export default function ThemesMultiSelect({ options }) {
  const placeholder = "Select themes";
  const setFilters = useHackathonStore((state) => state.setFilters);
  const filters = useHackathonStore((state) => state.filters);
  const themes = filters?.themes;
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Update URL query params as ?themes[]=theme1&themes[]=theme2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Remove all existing themes[] params
    params.delete("themes[]");
    // Add each selected theme as themes[]
    (themes || []).forEach((theme) => {
      params.append("themes[]", theme);
    });
    setSearchParams(params, { replace: true });
  }, [themes, setSearchParams]);

  const handleSelect = (theme) => {
    if (themes?.includes(theme)) {
      const newThemes = themes.filter((themelist) => themelist !== theme);
      setFilters({ ...filters, themes: newThemes });
    } else {
      themes.push(theme);
      setFilters({ ...filters, themes });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          variant="outline"
          className="w-full justify-start min-w-[180px] flex-wrap"
        >
          {placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search themes..." />
          <CommandList>
            {options.map((theme) => (
              <CommandItem
                key={theme}
                onSelect={() => handleSelect(theme)}
                className={`cursor-pointer ${
                  themes?.includes(theme)
                    ? "bg-primary/10 text-primary font-semibold"
                    : ""
                }`}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    themes?.includes(theme)
                      ? "opacity-100 text-primary"
                      : "opacity-0"
                  }`}
                />
                {theme}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
