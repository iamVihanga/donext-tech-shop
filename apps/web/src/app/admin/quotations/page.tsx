import { redirect } from "next/navigation";

export default function AdminQuotationsPage() {
  redirect("/admin?tab=quotations");
}
