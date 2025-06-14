"use client";
import React from "react";

import { Button } from "@repo/ui/components/button";
import { IconSlideshow } from "@tabler/icons-react";
import { UploadIcon } from "lucide-react";
import { ActiveTab } from "../gallery-view";

type Props = {
  currentTab: ActiveTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
};

export default function UploadTab({ currentTab, setCurrentTab }: Props) {
  if (currentTab !== "upload") {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[250px] flex-1 rounded-sm bg-zinc-50/40 flex items-center justify-center flex-col">
      <IconSlideshow className="size-16 text-primary mb-2" />

      <div className="mt-3 text-center space-y-1">
        <h3 className="text-lg font-semibold text-primary">
          Upload your media files
        </h3>
        <p className="text-sm text-primary/70">
          Drag and drop files here or click to select files from your device.
        </p>

        <Button className="mt-2" icon={<UploadIcon />}>
          Choose Files
        </Button>
      </div>
    </div>
  );
}
