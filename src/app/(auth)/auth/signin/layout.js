import React from "react";
import "../../../globals.css";
import { Inter } from "next/font/google";
import { Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

// Configure Inter font with specific weights and subsets
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-inter", // Optional: create a CSS variable
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const Layout = ({ children }) => {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <div className="w-full">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
};

export default Layout;
