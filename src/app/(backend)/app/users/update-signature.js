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
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { userSchema } from "@/schemas/userSchemas";
import { updateUserSignatureAction } from "@/actions/usersActions";
import FileUpload from "@/components/ui/file-upload";
import { z } from "zod";
import { useSession } from "next-auth/react";

const UpdateUserSignatureForm = ({ user, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [isSaving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        signatureUrl: z.string().min(1, "Signature URL is required"),
      })
    ),
    defaultValues: {
      signatureUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("signatureUrl", user.signatureUrl || "");
    }
  }, [user]);

  const onSubmit = async (data) => {
    setSaving(true);
    const result = await updateUserSignatureAction({
      ...data,
      id: user.id,
    });

    if (result.data && result.data.success && result.data.user) {
      form.reset();
      setIsOpen(false);
      onSuccess?.(result.data.user);
      toast({
        title: "Signature updated",
        description: "User signature updated successfully",
      });
      await update({ signatureUrl: result.data.user.signatureUrl });
    } else {
      result.data?.error &&
        toast({
          variant: "destructive",
          title: "Oops! something went wrong",
          description: result.data.error,
        });
    }
    setSaving(false);
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
      <DialogTrigger className="text-sm text-black bg-gray-100 px-3 h-[42px] rounded-[--radius] text-left flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          color={"#000000"}
          fill={"none"}
        >
          <path
            d="M22 12.6344C18 16.1465 17.4279 10.621 15.3496 11.0165C13 11.4637 11.5 16.4445 13 16.4445C14.5 16.4445 12.5 10.5 10.5 12.5556C8.5 14.6111 7.85936 17.2946 6.23526 15.3025C-1.5 5.81446 4.99998 -1.14994 8.16322 3.45685C10.1653 6.37256 6.5 16.9769 2 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Update Signature
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-semibold">
                Update Signature
              </DialogTitle>
              <DialogDescription>
                {user
                  ? "You are currently editing an existing user's signature. Please review the details below and make any necessary changes to ensure that all information is accurate and up-to-date."
                  : "Welcome! To create a new user, please fill in the required details in the form below. Make sure to provide all relevant information to help us maintain a comprehensive record of our users."}{" "}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FileUpload
                defaultValue={user?.signatureUrl}
                onSuccess={(url) => form.setValue("signatureUrl", url)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving && (
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

export default UpdateUserSignatureForm;
