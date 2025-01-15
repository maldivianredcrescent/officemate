"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SearchActivity({
  activities,
  allActivities,
  onSelect,
  defaultActivity,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    defaultActivity && setValue(defaultActivity);
  }, [defaultActivity]);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between flex w-full overflow-hidden"
        >
          <div className="truncate overflow-hidden text-left w-[300px]">
            {value &&
              allActivities.find((activity) => activity.id === value)
                ?.code}{" "}
            -{" "}
            {value
              ? allActivities.find((activity) => activity.id === value)?.name
              : "Select budget line..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Search budget line..." />
          <CommandList>
            <CommandEmpty>No budget line found.</CommandEmpty>
            <CommandGroup>
              {activities.map((activity) => (
                <CommandItem
                  key={activity.id}
                  value={activity.name}
                  onSelect={(currentValue) => {
                    onSelect(
                      allActivities.find(
                        (activity) => activity.name === currentValue
                      )?.id
                    );
                    setValue(
                      allActivities.find(
                        (activity) => activity.name === currentValue
                      )?.id
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === activity.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {activity.code} - {activity.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
