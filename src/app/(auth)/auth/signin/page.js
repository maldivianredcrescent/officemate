"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle email sign in logic here
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/app/dashboard",
    });

    if (result.status === 200) {
      router.push("/app/dashboard");
    } else {
      toast({
        title: "Oops! Authentication failed",
        description: "Could not sign in with credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen font-manrope">
      {/* Left side with testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white lg:p-12 p-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img src="/whitelogo.svg" alt="Logo" />
            </div>
            <span className="text-xl">Office Mate</span>
          </div>
        </div>
        <div>
          <blockquote className="text-md mb-4 font-[400]">
            "The only way to do great work is to love what you do. It is through
            passion and dedication that we can truly excel in our endeavors,
            pushing the boundaries of what we believe is possible and achieving
            greatness in our respective fields."
          </blockquote>
          <p>Steve Jobs</p>
        </div>
      </div>
      {/* Right side with form */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-md mx-auto lg:h-[80vh]">
          <div className="lg:hidden flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img src="/logo.svg" alt="Logo" />
              </div>
              <span className="text-xl">Office Mate</span>
            </div>
          </div>
          <div className="h-[80vh] flex flex-col justify-center items-center">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2 text-center">
                Login to your account
              </h1>
              <p className="opacity-50 text-sm text-center">
                Enter your email and password below to login to your account
              </p>
            </div>
            <form onSubmit={handleEmailSignIn} className="space-y-4 w-full">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <Button disabled={isLoading} type="submit" className="w-full">
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
                Sign In with Email
              </Button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-6">
              All rights reserved. © Office Mate 2025 by Maldivian Red Crescent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
