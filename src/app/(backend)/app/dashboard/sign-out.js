"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/", // Optional: Redirect after sign out
    });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
