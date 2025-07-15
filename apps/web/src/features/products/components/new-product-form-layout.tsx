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
import { AdditionalInfoForm } from "./forms/additional-form";
import { BasicInformationsForm } from "./forms/basic-informations";
import CategoriesForm from "./forms/categories-form";
import { InventoryForm } from "./forms/inventory-form";
import { MediaForm } from "./forms/media-form";
import { PricingForm } from "./forms/pricing-form";
import { SummaryView } from "./forms/summary-view";

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
          {activeTab === Tabs.CATEGORIES && <CategoriesForm />}
          {activeTab === Tabs.MEDIA && <MediaForm />}
          {activeTab === Tabs.INVENTORY && <InventoryForm />}
          {activeTab === Tabs.PRICING && <PricingForm />}
          {activeTab === Tabs.ADDITIONAL && <AdditionalInfoForm />}
          {activeTab === Tabs.SUMMARY && <SummaryView />}
        </CardContent>
      </Card>
    </div>
  );
}
