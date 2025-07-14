import { AccountNavbar } from "@/modules/account/layouts/navbar";
import AccountSidebar from "@/modules/account/layouts/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return (
    <div>
      <AccountNavbar />

      <div className="content-container mx-auto w-full max-w-6xl my-4 md:my-10">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 md:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <AccountSidebar />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
