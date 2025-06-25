"use client";

import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconSettings
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavStore } from "@/components/dashboard/nav-store";
import { NavUser } from "@/components/dashboard/nav-user";
import { SITE_NAME } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@repo/ui/components/sidebar";
import { ComputerIcon } from "lucide-react";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard
    }
  ],
  navStore: [
    {
      title: "Products",
      icon: IconCamera,
      isActive: true,
      url: "/admin/dashboard/products",
      items: [
        {
          title: "Categories",
          url: "/admin/dashboard/categories"
        }
      ]
    },
    {
      title: "Orders",
      icon: IconFileDescription,
      url: "/admin/dashboard/orders",
      items: []
    },
    {
      title: "Inventory",
      icon: IconFileAi,
      url: "/admin/dashboard/inventory",
      items: [
        {
          title: "Reserved",
          url: "/admin/dashboard/inventory/reserved"
        }
      ]
    },
    {
      title: "Customers",
      icon: IconFileDescription,
      url: "/admin/dashboard/customers",
      items: []
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: IconSettings
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ComputerIcon className="!size-5" />
                <span className="text-sm text-muted-foreground font-heading font-bold">{`${SITE_NAME} | Admin`}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavStore items={data.navStore} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
