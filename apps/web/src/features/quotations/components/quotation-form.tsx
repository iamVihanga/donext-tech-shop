"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@repo/ui/components/tabs";
import { useState } from "react";
import { CustomerInfoForm } from "./customer-info-form";
import { ProductSearch } from "./product-search";
import { QuotationActions } from "./quotation-actions";
import { QuotationItems } from "./quotation-items";
import { QuotationSummary } from "./quotation-summary";

export function QuotationForm() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Products</CardTitle>
                <CardDescription>
                  Search and add products to your quotation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductSearch />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Products</CardTitle>
                <CardDescription>
                  Review and modify your selected products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationItems />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter customer details for the quotation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerInfoForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
                <CardDescription>
                  Add additional information about the quotation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Quotation Details Form - will implement next */}
                <div className="text-center py-8 text-muted-foreground">
                  Quotation details form coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <QuotationSummary />
        <QuotationActions onTabChangeAction={setActiveTab} />
      </div>
    </div>
  );
}
