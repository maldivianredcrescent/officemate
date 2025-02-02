import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AuthProvider from "@/lib/providers";

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

export const metadata = {
  title: "Office Mate",
  description:
    "Office Mate is a comprehensive platform designed to enhance workplace efficiency and collaboration.",
};

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased font-manrope">
        <div className="flex w-full h-full">
          <AuthProvider session={session}>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full overflow-hidden">{children}</main>
            </SidebarProvider>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
