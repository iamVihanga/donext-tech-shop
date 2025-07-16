"use client";

import {
  IconBox,
  IconBuilding,
  IconCamera,
  IconDashboard,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavStore } from "@/components/dashboard/nav-store";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@repo/ui/components/sidebar";
import Link from "next/link";
import { Logo } from "../logo";
import { NavSecondary } from "./nav-secondary";

const data = {
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
      isActive: false,
      url: "/admin/products",
      items: [
        {
          title: "New Product",
          url: "/admin/products/new"
        },
        {
          title: "Categories",
          url: "/admin/products/categories"
        },
        {
          title: "Brands",
          url: "/admin/brands"
        }
      ]
    },
    {
      title: "Orders",
      icon: IconBox,
      isActive: false,
      url: "/admin/orders",
      items: []
    },
    {
      title: "Customers",
      icon: IconUsers,
      isActive: false,
      url: "/admin/customers",
      items: []
    },
    {
      title: "Inventory",
      icon: IconBuilding,
      url: "/admin/inventory",
      isActive: false,
      items: [
        // {
        //   title: "Reserved",
        //   url: "/admin/inventory/reserved"
        // }
      ]
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
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
              {/* <a href="#">
                <ComputerIcon className="!size-5" />
                <span className="text-sm text-muted-foreground font-heading font-bold">{`${SITE_NAME} | Admin`}</span>
              </a> */}
              <Link href="/">
                <Logo />
              </Link>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
