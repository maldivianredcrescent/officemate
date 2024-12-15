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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#ffffff"
                viewBox="0 0 256 256"
              >
                <path d="M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,65.78a88.18,88.18,0,0,1,11,13.48L167.55,119,139.63,40.78A87.34,87.34,0,0,1,190.23,65.78ZM155.59,133l-18.16,21.37-27.59-5L100.41,123l18.16-21.37,27.59,5ZM65.77,65.78a87.34,87.34,0,0,1,56.66-25.59l17.51,49L58.3,74.32A88,88,0,0,1,65.77,65.78ZM46.65,161.54a88.41,88.41,0,0,1,2.53-72.62l51.21,9.35Zm19.12,28.68a88.18,88.18,0,0,1-11-13.48L88.45,137l27.92,78.18A87.34,87.34,0,0,1,65.77,190.22Zm124.46,0a87.34,87.34,0,0,1-56.66,25.59l-17.51-49,81.64,14.91A88,88,0,0,1,190.23,190.22Zm-34.62-32.49,53.74-63.27a88.41,88.41,0,0,1-2.53,72.62Z"></path>
              </svg>
            </div>
            <span className="text-xl">Office Mate</span>
          </div>
        </div>
        <div>
          <blockquote className="text-lg mb-4 font-[400]">
            "This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before."
          </blockquote>
          <p>Sofia Davis</p>
        </div>
      </div>
      {/* Right side with form */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-md mx-auto lg:h-[80vh]">
          <div className="lg:hidden flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,65.78a88.18,88.18,0,0,1,11,13.48L167.55,119,139.63,40.78A87.34,87.34,0,0,1,190.23,65.78ZM155.59,133l-18.16,21.37-27.59-5L100.41,123l18.16-21.37,27.59,5ZM65.77,65.78a87.34,87.34,0,0,1,56.66-25.59l17.51,49L58.3,74.32A88,88,0,0,1,65.77,65.78ZM46.65,161.54a88.41,88.41,0,0,1,2.53-72.62l51.21,9.35Zm19.12,28.68a88.18,88.18,0,0,1-11-13.48L88.45,137l27.92,78.18A87.34,87.34,0,0,1,65.77,190.22Zm124.46,0a87.34,87.34,0,0,1-56.66,25.59l-17.51-49,81.64,14.91A88,88,0,0,1,190.23,190.22Zm-34.62-32.49,53.74-63.27a88.41,88.41,0,0,1-2.53,72.62Z"></path>
                </svg>
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
              By clicking continue, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
