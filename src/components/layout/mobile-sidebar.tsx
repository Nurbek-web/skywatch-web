"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/data/data";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Utility for conditional class names

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sheet (Sidebar) for mobile view */}
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Trigger for opening the sidebar */}
        <SheetTrigger asChild>
          <MenuIcon
            className={cn(
              "cursor-pointer text-foreground", // Ensure the icon color adapts to the theme
              className
            )}
            size={24} // Adjust size as needed
          />
        </SheetTrigger>

        {/* Sidebar content */}
        <SheetContent
          side="left"
          className={cn(
            "!px-0 bg-background text-foreground", // Ensure background and text color adapt to the theme
            className
          )}
        >
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {/* Sidebar Title */}
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>

              {/* Navigation Items */}
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen} // Close sidebar on item click
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
