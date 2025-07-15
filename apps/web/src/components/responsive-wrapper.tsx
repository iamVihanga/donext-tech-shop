"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@repo/ui/lib/utils";
import React, { JSX } from "react";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ResponsiveWrapper({
  children,
  className,
  mobileClassName,
  desktopClassName,
  as: Component = "div"
}: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();

  const combinedClassName = cn(
    className,
    isMobile ? mobileClassName : desktopClassName
  );

  return <Component className={combinedClassName}>{children}</Component>;
}

// Hook for responsive values
export function useResponsiveValue<T>(mobileValue: T, desktopValue: T): T {
  const isMobile = useIsMobile();
  return isMobile ? mobileValue : desktopValue;
}

// Component for conditional rendering based on screen size
interface ResponsiveShowProps {
  children: React.ReactNode;
  breakpoint?: "sm" | "md" | "lg" | "xl";
  above?: boolean;
}

export function ResponsiveShow({
  children,
  breakpoint = "md",
  above = true
}: ResponsiveShowProps) {
  const isMobile = useIsMobile();

  // For mobile hook (< 768px), we show content based on the above prop
  const shouldShow = above ? !isMobile : isMobile;

  return shouldShow ? <>{children}</> : null;
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 4, tablet: 6, desktop: 8 }
}: ResponsiveGridProps) {
  const gridClassName = cn(
    "grid",
    `grid-cols-${cols.mobile}`,
    `sm:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`,
    `gap-${gap.mobile}`,
    `sm:gap-${gap.tablet}`,
    `lg:gap-${gap.desktop}`,
    className
  );

  return <div className={gridClassName}>{children}</div>;
}
