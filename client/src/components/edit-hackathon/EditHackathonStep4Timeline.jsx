import { Label } from "@/components/ui/label";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function EditHackathonStep4Timeline({ formData, setFormData }) {
  // Helper to safely parse date string
  const getDate = (dateStr) => {
    if (!dateStr) return undefined;
    const d = parseISO(dateStr);
    return isValid(d) ? d : undefined;
  };

  console.log("Form data", formData);

  return (
    <div className="space-y-6">
      <div>
        <Label>Registration Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData?.registrationDeadline &&
              getDate(formData.registrationDeadline) ? (
                format(getDate(formData.registrationDeadline), "PPP")
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getDate(formData?.registrationDeadline)}
              onSelect={(date) =>
                setFormData(
                  "registrationDeadline",
                  date ? date.toISOString().slice(0, 10) : null
                )
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Submission Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData?.submissionDeadline &&
              getDate(formData.submissionDeadline) ? (
                format(getDate(formData.submissionDeadline), "PPP")
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getDate(formData?.submissionDeadline)}
              onSelect={(date) =>
                setFormData(
                  "submissionDeadline",
                  date ? date.toISOString().slice(0, 10) : null
                )
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
