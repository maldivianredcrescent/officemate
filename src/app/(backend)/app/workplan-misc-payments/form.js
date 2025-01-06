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
import {
  createWorkplanMiscPaymentAction,
  updateWorkplanMiscPaymentAction,
} from "@/actions/workplaneMiscPaymentActions"; // Updated action imports
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkplanMiscPaymentForm = ({
  workplan,
  workplanMiscPayment,
  onSuccess,
  onClose,
  activities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, { message: "Payment name is required" }),
        amount: z.number().min(0, { message: "Amount must be greater than 0" }),
        description: z.string().optional(),
        activityId: z.string().optional(),
      })
    ),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (workplanMiscPayment) {
      form.setValue("name", workplanMiscPayment.name);
      form.setValue("amount", workplanMiscPayment.amount);
      form.setValue("description", workplanMiscPayment.description);
      form.setValue("activityId", workplanMiscPayment.activityId);
      setIsOpen(true);
    }
  }, [workplanMiscPayment]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    var result;
    if (workplanMiscPayment) {
      result = await updateWorkplanMiscPaymentAction({
        ...data,
        id: workplanMiscPayment.id,
      });
    } else {
      result = await createWorkplanMiscPaymentAction({
        ...data,
        workplanId: workplan.id,
      });
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.workplanMiscPayment);
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
        {workplanMiscPayment ? "Edit Payment" : "Add Payment"}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {workplanMiscPayment ? "Edit Payment" : "Add Payment"}
              </DialogTitle>
              <DialogDescription>
                {workplanMiscPayment
                  ? "You are currently editing an existing payment's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new payment, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our payments."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter payment name" />
                      </FormControl>
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
                        <Input {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Line</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          placeholder="Select a budget line"
                          onValueChange={(value) => field.onChange(value)} // Ensure the selected value updates the form state
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a budget line" />
                          </SelectTrigger>
                          <SelectContent>
                            {activities.map((activity) => (
                              <SelectItem key={activity.id} value={activity.id}>
                                {activity.name}
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter amount"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default WorkplanMiscPaymentForm; // Updated export
