import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/general/sidebar";
import { Header } from "@/components/general/header";
import { ThemeProvider } from "@/components/theme-provider";

const font = Google_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Forge Fitness",
  description: "Train Harder. Recover Better.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", font.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <main className="p-12">{children}</main>
            </SidebarInset>
          </SidebarProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
