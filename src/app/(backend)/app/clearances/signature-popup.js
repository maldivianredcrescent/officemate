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
import { submitClearanceForApprovalAction } from "@/actions/clearanceActions";
import { submitClearanceForBudgetApprovalAction } from "@/actions/clearanceActions";
import { submitClearanceForFinanceApprovalAction } from "@/actions/clearanceActions";
import { completeClearanceAction } from "@/actions/clearanceActions";
import { useAction } from "next-safe-action/hooks";

const SignaturePopup = ({ onSuccess, onClose, isPopupOpen, request }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const { isPending: isSubmitPending, execute: submitClearanceForApproval } =
    useAction(submitClearanceForApprovalAction);
  const { isPending: isBudgetApprovedPending, execute: budgetApprovedRequest } =
    useAction(submitClearanceForBudgetApprovalAction);
  const {
    isPending: isSubmitFinancePending,
    execute: submitClearanceForFinanceApproval,
  } = useAction(submitClearanceForFinanceApprovalAction);
  const { isPending: isCompletedPending, execute: completedClearance } =
    useAction(completeClearanceAction);

  useEffect(() => {
    setIsOpen(isPopupOpen);
  }, [isPopupOpen]);

  const handleSubmit = async (s) => {
    setIsLoading(true);
    if (request.status === "created") {
      console.log(request.id);
      await submitClearanceForApproval({
        id: request.id,
        signature: s,
      });
    }
    if (request.status === "submitted") {
      await budgetApprovedRequest({ id: request.id, signature: s });
    }
    if (request.status === "budget_approved") {
      await submitClearanceForFinanceApproval({ id: request.id, signature: s });
    }
    if (request.status === "finance_approved") {
      await completedClearance({ id: request.id, signature: s });
    }
    setIsLoading(false);
    onSuccess?.();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onClose?.();
      }}
    >
      <DialogTrigger className="text-sm bg-black text-white px-4 h-[42px] rounded-lg">
        {request?.status === "created" && "Submit request"}
        {request?.status === "submitted" && "Approve budget"}
        {request?.status === "budget_approved" && "Approve finance"}
        {request?.status === "finance_approved" && "Complete request"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Sign</DialogTitle>
          <DialogDescription>
            Sign your name to confirm the request
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <SignaturePad
            onChange={(signature) => {
              setSignature(signature);
              console.log(signature);
            }}
          />
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
              {request?.status === "created" && "Submit"}
              {request?.status === "submitted" && "Approve budget"}
              {request?.status === "budget_approved" && "Approve finance"}
              {request?.status === "finance_approved" && "Complete request"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6"
                color={"#ffffff"}
                fill={"none"}
              >
                <path
                  d="M20.0001 11.9998L4.00012 11.9998"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignaturePopup; // Updated export
