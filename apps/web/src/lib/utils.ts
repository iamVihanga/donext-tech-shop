import { clsx, type Classexport const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  return cleaned;
};

export const createPhoneLink = (phoneNumber: string) => {
  const formatted = formatPhoneNumber(phoneNumber);
  return `tel:${formatted}`;
};from "clsx";
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

export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2
  }).format(num);
};
