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

const WorkplanForm = ({ workplan, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(workPlanSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (workplan) {
      form.setValue("name", workplan.name);
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
                Create Workplan
              </DialogTitle>
              <DialogDescription>
                Please be aware that this action is permanent and will result in
                the deletion of your account and all associated data. Ensure you
                have backed up any important information before continuing.
              </DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormDescription>This is your budget name.</FormDescription>
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
