import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_CONFIG } from "@/constants/app-config";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CSSProperties, ReactNode } from "react";
import "./globals.css";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: {
    absolute: APP_CONFIG.siteName,
    template: `%s | ${APP_CONFIG.siteName}`,
  },
};

const Layout = ({ children }: LayoutProps) => (
  <html lang="pl" className={cn(interFont.variable)}>
    <body>
      <TooltipProvider>
        <NuqsAdapter>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </NuqsAdapter>
      </TooltipProvider>
      <Toaster />
    </body>
  </html>
);

export default Layout;
