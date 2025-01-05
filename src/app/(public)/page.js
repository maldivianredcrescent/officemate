"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex justify-center items-center mb-6">
        <img src="/logo.svg" alt="Office Mate Logo" className="w-[60px]" />
      </div>
      <h1 className="text-2xl font-bold">Welcome to Office Mate!</h1>
      <p className="text-sm text-gray-500 max-w-[400px] text-center">
        Office Mate is a comprehensive platform designed to enhance workplace
        efficiency and collaboration. This page serves as the entry point for
        users, providing essential information and guiding them to sign in for
        access to a suite of powerful features tailored for modern office
        environments.
      </p>
      <Button
        className="mt-4 px-4 py-2 bg-black text-white"
        onClick={() => {
          router.push("/auth/signin");
        }}
      >
        Sign In
      </Button>
    </div>
  );
}
