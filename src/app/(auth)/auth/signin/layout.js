import React from "react";
import "../../../globals.css";
import { Inter } from "next/font/google";
import { Lora } from "next/font/google";
import { Manrope } from "next/font/google";

// Configure Inter font with specific weights and subsets
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-inter", // Optional: create a CSS variable
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lora",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const Layout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
};

export default Layout;
