"use client";

import { Button } from "@repo/ui/components/button";
import { CheckIcon, ShareIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

export function ShareButton({
  className = "border-neutral-600 hover:border-amber-500",
  size = "lg",
  variant = "outline"
}: Props) {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;

      // Try to use the modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      // Show success state briefly
      setIsShared(true);
      toast.success("Product link copied to clipboard!", {
        description: "You can now share this product with others."
      });

      // Reset the icon after 2 seconds
      setTimeout(() => {
        setIsShared(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy link", {
        description: "Please try again or copy the URL manually."
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
      title="Share this product"
    >
      {isShared ? (
        <CheckIcon className="w-5 h-5 text-green-400" />
      ) : (
        <ShareIcon className="w-5 h-5" />
      )}
    </Button>
  );
}
