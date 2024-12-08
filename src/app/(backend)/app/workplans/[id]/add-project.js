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
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workPlanSchema } from "@/schemas/workPlanSchemas";
import { addProjectToWorkplanAction } from "@/actions/workplaneActions";
import { useToast } from "@/hooks/use-toast";
const AddProjectForm = ({ workplan, onSuccess, onClose, projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(z.object({ projectId: z.string() })),
    defaultValues: {
      projectId: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await addProjectToWorkplanAction({
      ...data,
      workplanId: workplan.id,
    });

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.workplanProject);
    } else {
      result.data?.error &&
        toast({
          variant: "destructive",
          title: "Oops! something went wrong",
          description: result.data.error,
        });
    }
  };

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        !open && form.reset();
        onClose?.();
        setIsOpen(open);
      }}
    >
      <DialogTrigger className="text-sm bg-black text-white px-4 h-[42px] rounded-lg">
        Add Project
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                Add New Project
              </DialogTitle>
              <DialogDescription>
                Please note that adding a project to this workplan is a
                significant action. Ensure that you have reviewed all project
                details and are ready to proceed before continuing.
              </DialogDescription>
            </DialogHeader>
            <div>
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectForm;
