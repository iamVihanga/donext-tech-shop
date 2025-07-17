import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  rightContent?: React.ReactNode;
};

export default function LandingSectionTitle({
  className,
  title,
  description,
  rightContent
}: Props) {
  return (
    <div
      className={cn(
        "mb-2 pb-3 border-b w-full border-amber-500 flex items-center justify-between",
        className
      )}
    >
      <div className="">
        <h2 className="text-2xl text-foreground font-heading font-extrabold uppercase">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {rightContent && <div className="ml-auto">{rightContent}</div>}
    </div>
  );
}
