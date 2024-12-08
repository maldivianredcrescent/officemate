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
import { donorSchema } from "@/schemas/donorSchemas";
import { createDonorAction, updateDonorAction } from "@/actions/donorActions";

const DonorForm = ({ donor, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (donor) {
      form.setValue("name", donor.name);
      form.setValue("code", donor.code);
    }
  }, [donor]);

  const onSubmit = async (data) => {
    var result;
    if (donor) {
      result = await updateDonorAction({ ...data, id: donor.id });
    } else {
      result = await createDonorAction(data);
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.donor);
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
        {donor ? "Edit Donor" : "Create Donor"}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {donor ? "Edit Donor" : "Create Donor"}
              </DialogTitle>
              <DialogDescription>
                {donor
                  ? "You are currently editing an existing donor's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new donor, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our donors."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor Name</FormLabel>
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
                    <FormLabel>Donor Code</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. NDMA" {...field} />
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

export default DonorForm;
