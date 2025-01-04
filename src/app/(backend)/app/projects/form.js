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
import { projectSchema } from "@/schemas/projectSchemas"; // Updated to projectSchema
import {
  createProjectAction,
  updateProjectAction,
} from "@/actions/projectActions"; // Updated to projectActions
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ProjectForm = ({ project, onSuccess, onClose, donors, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema), // Updated to projectSchema
    defaultValues: {
      name: "",
      code: "",
      start_year: "", // Added start_year
      end_year: "", // Added end_year
      donorId: "", // Added donorId
      strategicCode: "", // Added strategicCode
      amount: "", // Added amount
      file: "", // Added file
      userId: "", // Added userId
    },
  });

  useEffect(() => {
    if (project) {
      form.setValue("name", project.name);
      form.setValue("code", project.code);
      form.setValue("start_year", project.start_year); // Set start_year
      form.setValue("end_year", project.end_year); // Set end_year
      form.setValue("donorId", project.donorId); // Set donorId
      form.setValue("strategicCode", project.strategicCode); // Set strategicCode
      form.setValue("amount", project.amount); // Set amount
      form.setValue("file", project.file); // Set file
      form.setValue("userId", project.userId); // Set userId
    }
  }, [project]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    let result;
    if (project) {
      result = await updateProjectAction({ ...data, id: project.id });
    } else {
      result = await createProjectAction(data);
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.project);
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
        {project ? "Edit Project" : "Create Project"}
      </DialogTrigger>
      <DialogContent className="lg:max-h-[90vh] h-[100vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {project ? "Edit Project" : "Create Project"}
              </DialogTitle>
              <DialogDescription>
                {project
                  ? "You are currently editing an existing project's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new project, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our projects."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. National Disaster Management Authority"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Code</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. NDMA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 2023"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        } // Change to int after setting
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 2024"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        } // Change to int after setting
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        placeholder="Select a donor"
                        onValueChange={(value) => field.onChange(value)} // Ensure the selected value updates the form state
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a donor" />
                        </SelectTrigger>
                        <SelectContent>
                          {donors.map((donor) => (
                            <SelectItem key={donor.id} value={donor.id}>
                              {donor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strategicCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategic Code</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 001"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        } // Change to int after setting
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 10000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value, 10))
                        } // Change to int after setting
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Holder</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
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

export default ProjectForm;
