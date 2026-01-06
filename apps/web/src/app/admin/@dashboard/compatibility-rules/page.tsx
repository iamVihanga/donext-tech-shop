"use client";

import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import { NewRuleForm } from "@/features/compatibility-rules/components/new-rules-form";
import RulesListing from "@/features/compatibility-rules/components/rules-listing";

export default function CompatibilityRulesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Compatibility Rules"
          description="Manage PC component compatibility rules and validation logic."
          actionComponent={<NewRuleForm />}
        />

        <Separator />

        <RulesListing />
      </div>
    </PageContainer>
  );
}
