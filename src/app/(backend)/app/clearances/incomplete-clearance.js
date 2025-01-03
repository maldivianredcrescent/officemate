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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { incompleteClearanceAction } from "@/actions/clearanceActions"; // Import the incomplete clearance action
import { z } from "zod";

const IncompleteClearanceForm = ({ clearance, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        incompleteRemarks: z.string().min(1, "Remarks are required"), // Ensure remarks are provided
      })
    ),
    defaultValues: {
      incompleteRemarks: "",
    },
  });

  useEffect(() => {
    if (clearance) {
      form.setValue("incompleteRemarks", clearance.incompleteRemarks);
    }
  }, [clearance]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await incompleteClearanceAction({
      ...data,
      id: clearance.id,
    }); // Call the incomplete clearance action

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.clearance);
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
      <DialogTrigger className="text-sm bg-gray-200 text-gray-900 px-4 h-[42px] rounded-[--radius]">
        Mark as Incomplete
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                Mark Clearance as Incomplete
              </DialogTitle>
              <DialogDescription>
                Please provide remarks for marking this clearance as incomplete.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="incompleteRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incomplete Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter incomplete remarks"
                      />
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
                Mark as Incomplete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IncompleteClearanceForm; // Updated export
