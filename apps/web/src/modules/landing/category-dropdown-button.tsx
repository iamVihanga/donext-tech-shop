"use client";

import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { ChevronDownIcon, LayoutGridIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryNavbar } from "./category-navbar";

export function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <Button
        variant="ghost"
        className="h-9 px-3 hover:bg-zinc-100 dark:hover:bg-amber-500 dark:hover:text-background"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-2">
          <LayoutGridIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </Button>

      {/* Category Navbar */}
      <CategoryNavbar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
}
