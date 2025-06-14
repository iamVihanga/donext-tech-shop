"use client";

import { useState } from "react";

import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { GalleryTabBar } from "./view-tabs/tab-bar";
import UploadTab from "./view-tabs/upload-tab";

export type ActiveTab = "upload" | "library";

type Props = {
  modal?: boolean;
  activeTab?: ActiveTab;
};

export default function GalleryView({ modal = false, activeTab }: Props) {
  const [currentTab, setCurrentTab] = useState<ActiveTab>(
    activeTab || "upload"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Media Gallery"
          description="Manage your media files here"
          actionComponent={<></>}
        />

        <div className="space-y-3 h-full flex-1">
          <GalleryTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />

          <div className="my-3 h-full flex-1">
            <UploadTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
