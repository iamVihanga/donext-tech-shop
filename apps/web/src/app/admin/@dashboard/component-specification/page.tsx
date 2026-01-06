"use client";

import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import { NewSpecificationForm } from "@/features/component-specifications/components/new-specification-form";
import SpecificationsListing from "@/features/component-specifications/components/specification-listing";

export default function ComponentSpecificationPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Component Specifications"
          description="Manage PC component technical specifications here."
          actionComponent={<NewSpecificationForm />}
        />

        <Separator />

        <SpecificationsListing />
      </div>
    </PageContainer>
  );
}
