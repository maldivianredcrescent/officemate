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
import SignaturePad from "@/components/ui/signature-pad";
import {
  submitRequestForApprovalAction,
  submitRequestForPaymentProcessingAction,
} from "@/actions/requestActions";
import { submitRequestForBudgetApprovalAction } from "@/actions/requestActions";
import { submitRequestForFinanceApprovalAction } from "@/actions/requestActions";
import { completedRequestAction } from "@/actions/requestActions";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const SignaturePopup = ({ onSuccess, onClose, isPopupOpen, request, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const { isPending: isSubmitPending, execute: submitRequestForApproval } =
    useAction(submitRequestForApprovalAction);
  const { isPending: isBudgetApprovedPending, execute: budgetApprovedRequest } =
    useAction(submitRequestForBudgetApprovalAction);
  const {
    isPending: isSubmitFinancePending,
    execute: submitRequestForFinanceApproval,
  } = useAction(submitRequestForFinanceApprovalAction);
  const { isPending: isCompletedPending, execute: completedRequest } =
    useAction(completedRequestAction);
  const {
    isPending: isPaymentProcessingPending,
    execute: submitRequestForPaymentProcessing,
  } = useAction(submitRequestForPaymentProcessingAction);

  const toast = useToast();

  useEffect(() => {
    setIsOpen(isPopupOpen);
    setSignature(user?.signatureUrl);
  }, [isPopupOpen, user?.signatureUrl]);

  const handleSubmit = async (s) => {
    setIsLoading(true);
    if (request.status === "created") {
      await submitRequestForApproval({
        id: request.id,
        signature: s,
      });
    }
    if (request.status === "submitted") {
      await budgetApprovedRequest({ id: request.id, signature: s });
    }
    if (request.status === "budget_approved") {
      await submitRequestForFinanceApproval({ id: request.id, signature: s });
    }
    if (request.status === "finance_approved") {
      await submitRequestForPaymentProcessing({ id: request.id, signature: s });
    }
    if (request.status === "payment_processing") {
      await completedRequest({ id: request.id, signature: s });
    }

    setIsLoading(false);
    onSuccess?.();
    setIsOpen(false);
  };

  const hasPermission = (status, role) => {
    if (status === "created") {
      return (
        role === "admin" ||
        role === "user" ||
        role === "budget_approver" ||
        role === "finance_approver" ||
        role === "payment_processor"
      );
    }
    if (status === "submitted") {
      return request.activity.project.userId === user.id || role === "admin";
    }
    if (status === "budget_approved") {
      return role === "finance_approver" || role === "admin";
    }
    if (status === "finance_approved") {
      return role === "payment_processor" || role === "admin";
    }
    if (status === "payment_processing") {
      return role === "payment_processor" || role === "admin";
    }
    if (status === "completed") {
      return role === "admin" || role === "payment_processor";
    }
    return false;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onClose?.();
      }}
    >
      <DialogTrigger
        className={cn(
          "text-sm bg-black text-white px-4 h-[42px] rounded-[--radius]",
          !hasPermission(request.status, user.role) && "hidden"
        )}
      >
        {request?.status === "created" && "Submit request"}
        {request?.status === "submitted" && "Approve budget"}
        {request?.status === "budget_approved" && "Approve finance"}
        {request?.status === "finance_approved" && "Payment processing"}
        {request?.status === "payment_processing" && "Complete request"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Sign</DialogTitle>
          <DialogDescription>
            Sign your name to confirm the request
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <img src={user?.signatureUrl} alt="signature" />
        </div>
        <DialogFooter>
          {signature && (
            <Button
              disabled={isLoading}
              onClick={() => {
                handleSubmit(signature);
              }}
            >
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
              Sign & {request?.status === "created" && "Submit"}
              {request?.status === "submitted" && "Approve budget"}
              {request?.status === "budget_approved" && "Approve finance"}
              {request?.status === "finance_approved" && "Payment processing"}
              {request?.status === "payment_processing" && "Complete request"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignaturePopup; // Updated export
