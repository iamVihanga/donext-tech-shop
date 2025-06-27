"use client";

import {
  getActiveTab,
  getTabName,
  Tabs,
  useActiveTab
} from "@/features/products/store/helpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { BasicInformationsForm } from "./forms/basic-informations";
import { MediaForm } from "./forms/media-form";

export function NewProductFormLayout() {
  const activeTab = useActiveTab();

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="w-full px-2 py-6 bg-muted/20 rounded-md">
        <CardHeader>
          <CardTitle className="text-xl">
            {getTabName(getActiveTab())}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {activeTab === Tabs.BASIC_INFORMATION && <BasicInformationsForm />}
          {activeTab === Tabs.MEDIA && <MediaForm />}
        </CardContent>
      </Card>
    </div>
  );
}
