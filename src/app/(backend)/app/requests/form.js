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
import { requestSchema } from "@/schemas/requestSchemas"; // Updated import to requestSchema
import {
  createRequestAction,
  updateRequestAction,
} from "@/actions/requestActions";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { SearchActivity } from "./search-activity";
import { z } from "zod";

const RequestForm = ({
  request,
  onSuccess,
  onClose,
  activities,
  donors,
  projects,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(
      requestSchema.extend({
        donorId: z.string(),
        projectId: z.string(),
      })
    ),
    defaultValues: {
      type: "",
      activityId: "",
      remarks: "",
      title: "",
      statusNote: "",
      donorId: "",
      projectId: "",
    },
  });

  useEffect(() => {
    if (request) {
      form.setValue("type", request.type);
      form.setValue("activityId", request.activityId);
      form.setValue("remarks", request.remarks);
      form.setValue("title", request.title);
      form.setValue("statusNote", request.statusNote);
      form.setValue("donorId", request.activity?.project?.donor?.id);
      form.setValue("projectId", request.activity?.project?.id);
    }
  }, [request, activities]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    var result;
    if (request) {
      result = await updateRequestAction({ ...data, id: request.id });
    } else {
      result = await createRequestAction(data);
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.request);
      if (!request) {
        router.push(`/app/requests/${result.data.request.id}`);
      }
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
      modal={false}
      open={isOpen}
      onOpenChange={(open) => {
        !open && !request && form.reset();
        onClose?.();
        setIsOpen(open);
      }}
    >
      <DialogTrigger className="text-sm bg-black text-white px-4 h-[42px] rounded-[--radius]">
        {request ? "Edit Request" : "Create Request"}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {request ? "Edit Request" : "Create Request"}
              </DialogTitle>
              <DialogDescription>
                {request
                  ? "You are currently editing an existing request's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new request, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our requests."}{" "}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        placeholder="Select a request type"
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="goods" value="goods">
                            Goods
                          </SelectItem>
                          <SelectItem key="service" value="service">
                            Service
                          </SelectItem>
                          <SelectItem
                            key="working_advance"
                            value="working_advance"
                          >
                            Working Advance
                          </SelectItem>
                          <SelectItem
                            key="working_advance_excess"
                            value="working_advance_excess"
                          >
                            Work advance Excess
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                        onValueChange={(value) => field.onChange(value)}
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
              {form.watch("donorId") && (
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
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects
                              .filter(
                                (project) =>
                                  project.donorId === form.watch("donorId")
                              )
                              .map((project) => (
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
              )}
              {form.watch("projectId") && (
                <FormField
                  control={form.control}
                  name="activityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Line</FormLabel>
                      <FormControl>
                        <SearchActivity
                          allActivities={activities}
                          onSelect={(value) => {
                            console.log(value);
                            form.setValue("activityId", value);
                          }}
                          activities={
                            form.watch("projectId")
                              ? activities.filter(
                                  (activity) =>
                                    activity.project?.id ===
                                    form.getValues("projectId")
                                )
                              : activities
                          }
                          defaultActivity={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {request && (
                <FormField
                  control={form.control}
                  name="statusNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Note</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter status note" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter remarks" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.watch("donorId") &&
              form.watch("projectId") &&
              form.watch("activityId") && (
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
              )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm; // Updated export
