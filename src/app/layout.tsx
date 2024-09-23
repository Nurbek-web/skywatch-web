import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
// import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Skywatch",
  description: "Autonomous ai powered agrodrone",
};

// const navItems = [
//   {
//     name: "Home",
//     link: "/",
//     icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
//   },
//   {
//     name: "About",
//     link: "/about",
//     icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
//   },
//   {
//     name: "Contact",
//     link: "/contact",
//     icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
//   },
// ];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <FloatingNav navItems={navItems} /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
