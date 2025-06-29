"use client";

import { Separator } from "@repo/ui/components/separator";

import {
  getAllTabs,
  getTabName,
  getTabStatus,
  setActiveTab,
  useActiveTab
} from "@/features/products/store/helpers";
import { Button } from "@repo/ui/components/button";
import { PublishProductButton } from "./publish-product-button";

export default function NewProductTabBar() {
  const activeTab = useActiveTab();

  return (
    <div className="mt-1 ">
      <Separator className="w-full" />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getAllTabs().map((tab, index) => (
            <div key={tab} className="flex items-center h-12">
              {index !== 0 && (
                <Separator orientation="vertical" className="h-full" />
              )}

              <Button
                variant="ghost"
                className={`h-full rounded-none cursor-pointer ${
                  activeTab === tab
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                }}
              >
                {getTabStatus(tab) === "valid" && (
                  <span className="size-2 bg-teal-500 rounded-full" />
                )}

                {getTabName(tab)}
              </Button>
            </div>
          ))}
        </div>

        <PublishProductButton />
      </div>

      <Separator className="w-full" />
    </div>
  );
}
