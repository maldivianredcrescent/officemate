"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { activitySchema } from "@/schemas/activitySchemas"; // Updated to activitySchema
import {
  createActivityAction,
  updateActivityAction,
} from "@/actions/activityActions"; // Updated to activityActions
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ActivityForm = ({ activity, onSuccess, onClose, projects, workplan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(activitySchema), // Updated to activitySchema
    defaultValues: {
      code: "",
      name: "",
      budget: "",
      projectId: "",
    },
  });

  useEffect(() => {
    if (activity) {
      form.setValue("name", activity.name);
      form.setValue("code", activity.code);
      form.setValue("budget", activity.budget); // Set budget
      form.setValue("projectId", activity.projectId); // Set projectId
      form.setValue("workplanId", activity.workplanId); // Set workplanId
      setIsOpen(true);
    }
  }, [activity]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    let result;
    if (activity) {
      result = await updateActivityAction({
        ...data,
        id: activity.id,
      });
    } else {
      result = await createActivityAction({ ...data, workplanId: workplan.id });
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.activity);
    } else {
      result.data?.error &&
        toast({
          variant: "destructive",
          title: "Oops! something went wrong",
          description: result.data.error,
        });
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        !open && form.reset();
        onClose?.();
        setIsOpen(open);
      }}
    >
      <DialogTrigger className="text-sm bg-black text-white px-4 h-[42px] rounded-[--radius]">
        {activity ? "Edit Activity" : "Create Activity"}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {activity ? "Edit Activity" : "Create Activity"}
              </DialogTitle>
              <DialogDescription>
                {activity
                  ? "You are currently editing an existing activity's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new activity, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our activities."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Code</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. 171" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Line</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. Emergency Response Fund"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 5000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value, 10))
                        } // Change to float after setting
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        placeholder="Select a project"
                        onValueChange={(value) => field.onChange(value)} // Ensure the selected value updates the form state
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
