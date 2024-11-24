import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default async function Layout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex w-full h-full">
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">{children}</main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
