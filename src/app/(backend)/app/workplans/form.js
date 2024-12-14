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
import { Input } from "@/components/ui/input";
import { workPlanSchema } from "@/schemas/workPlanSchemas";
import {
  createWorkplanAction,
  updateWorkplanAction,
} from "@/actions/workplaneActions";
import { Textarea } from "@/components/ui/textarea";

const WorkplanForm = ({ workplan, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(workPlanSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (workplan) {
      form.setValue("name", workplan.name);
      form.setValue("description", workplan.description || "");
    }
  }, [workplan]);

  const onSubmit = async (data) => {
    let result;
    if (workplan) {
      result = await updateWorkplanAction({ ...data, id: workplan.id });
    } else {
      result = await createWorkplanAction(data);
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.workplan);
    } else {
      result.error && console.log(result.data.error);
    }
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
      <DialogTrigger className="text-sm bg-black text-white px-4 h-[42px] rounded-lg">
        {workplan ? "Edit Workplan" : "Create Workplan"}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {workplan ? "Edit Workplan" : "Create Workplan"}
              </DialogTitle>
              <DialogDescription>
                Please note that this action is irreversible and will lead to
                the deletion of your account along with all related data. Make
                sure to back up any critical information before proceeding.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Workplan Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your workplan name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description" {...field} />
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

export default WorkplanForm;
