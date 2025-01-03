"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p className="text-sm text-gray-500 max-w-[400px] text-center">
        This page serves as the entry point for users, providing a brief
        introduction and guiding them to sign in for access to additional
        features.
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
