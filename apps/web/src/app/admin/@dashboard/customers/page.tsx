"use client";

import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import UsersListing from "@/features/users/components/users-listing";
import { UsersTableActions } from "@/features/users/components/users-table/users-table-actions";

export default function StudentsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Customers"
          description={`Manage all customers registered on the platform`}
          actionComponent={<></>}
        />

        <Separator />

        <UsersTableActions />

        <UsersListing />
      </div>
    </PageContainer>
  );
}
