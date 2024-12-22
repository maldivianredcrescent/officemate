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
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "next-safe-action/hooks";
import {
  createClearanceAction,
  rejectClearanceAction,
  updateClearanceAction,
} from "@/actions/clearanceActions";
import { z } from "zod";

const ClearanceForm = ({ clearance, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isPending: isRejectPending, execute: rejectClearance } = useAction(
    rejectClearanceAction
  );
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        remarks: z.string().optional(),
      })
    ),
    defaultValues: {
      remarks: "",
    },
  });

  useEffect(() => {
    if (clearance) {
      form.setValue("remarks", clearance.remarks);
    }
  }, [clearance]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    var result;
    if (clearance) {
      result = await updateClearanceAction({ ...data, id: clearance.id });
    } else {
      result = await createClearanceAction(data);
    }

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
      <DialogTrigger className="text-sm text-[--primary] font-[400] underline rounded-[--radius]">
        {clearance ? "Edit" : "Create"}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {clearance ? "Edit Clearance" : "Create Clearance"}
              </DialogTitle>
              <DialogDescription>
                {clearance
                  ? "You are currently editing an existing request's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new request, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our requests."}{" "}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
            <DialogFooter>
              {clearance && (
                <div
                  disabled={isRejectPending}
                  variant="destructive"
                  type="submit"
                  className="flex items-center gap-2 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-[--radius]"
                  onClick={async () => {
                    await rejectClearance({ id: clearance.id });
                    setIsOpen(false);
                    onSuccess?.();
                  }}
                >
                  {isRejectPending && (
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
                  Reject
                </div>
              )}
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

export default ClearanceForm;
