import { AccountNavbar } from "@/modules/account/layouts/navbar";
import AccountSidebar from "@/modules/account/layouts/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return (
    <div>
      <AccountNavbar />

      <div className="content-container mx-auto w-full max-w-6xl my-10">
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2">
            <AccountSidebar />
          </div>

          <div className="col-span-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
