import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toKebabCase(str: string) {
  return (
    str
      // Add hyphen before capital letters that follow lowercase letters or digits
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove any non-alphanumeric characters (except hyphens)
      .replace(/[^\w\s-]/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Remove leading hyphen if present
      .replace(/^-/, "")
      // Replace multiple consecutive hyphens with a single one
      .replace(/-+/g, "-")
  );
}
