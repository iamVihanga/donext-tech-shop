"use client";

import {
  getAimport { Tabs } from "../store/helpers";
import BasicInformationForm from "./forms/basic-information-form";
import CategoriesForm from "./forms/categories-form";
import ImagesForm from "./forms/images-form";
import InventoryForm from "./forms/inventory-form";
import PricingForm from "./forms/pricing-form";
import AdditionalForm from "./forms/additional-form";
import SummaryForm from "./forms/summary-form";

export function NewProductFormLayout() {
  const activeTab = useActiveTab();

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="w-full px-2 py-6 bg-muted/20 rounded-md">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>

        <CardContent>
          {activeTab === Tabs.BASIC_INFORMATION && <BasicInformationForm />}
          {activeTab === Tabs.CATEGORIES && <CategoriesForm />}
          {activeTab === Tabs.MEDIA && <ImagesForm />}
          {activeTab === Tabs.INVENTORY && <InventoryForm />}
          {activeTab === Tabs.PRICING && <PricingForm />}
          {activeTab === Tabs.ADDITIONAL && <AdditionalForm />}
          {activeTab === Tabs.SUMMARY && <SummaryForm />}
        </CardContent>
      </Card>
    </div>
  );
},
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
