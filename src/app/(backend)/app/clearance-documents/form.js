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
  createClearanceDocumentAction,
  updateClearanceDocumentAction,
} from "@/actions/clearanceDocumentActions"; // Updated action imports
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const ClearanceDocumentForm = ({
  clearanceDocument,
  onSuccess,
  onClose,
  clearance,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, { message: "Document name is required" }),
        documentUrl: z.string().min(1, { message: "Document URL is required" }),
      })
    ),
    defaultValues: {
      name: "",
      documentUrl: "",
    },
  });

  useEffect(() => {
    if (clearanceDocument) {
      form.setValue("name", clearanceDocument.name);
      form.setValue("documentUrl", clearanceDocument.documentUrl);
      setIsOpen(true);
    }
  }, [clearanceDocument]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    var result;
    if (clearanceDocument) {
      result = await updateClearanceDocumentAction({
        ...data,
        id: clearanceDocument.id,
      });
    } else {
      result = await createClearanceDocumentAction({
        ...data,
        clearanceId: clearance.id,
      });
    }

    if (result.data && result.data.success) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.clearanceDocument);
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
        {clearanceDocument ? "Edit Document" : "Add Document"}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                {clearanceDocument ? "Edit Document" : "Add Document"}
              </DialogTitle>
              <DialogDescription>
                {clearanceDocument
                  ? "You are currently editing an existing clearance document's information. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new clearance document, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our clearance documents."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter document name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter document URL" />
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

export default ClearanceDocumentForm; // Updated export
