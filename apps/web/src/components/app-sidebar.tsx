import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";

const NAVIGATION_ITEMS = [
  {
    name: "Centrum leadów",
    path: ROUTES.core.leads,
  },
  {
    name: "Organizacja imprez",
    path: ROUTES.events.leads,
  },
  {
    name: "Wynajem aut",
    path: ROUTES.vehicles.rental,
  },
  {
    name: "Sprzątanie",
    path: ROUTES.cleaning.index,
  },
] satisfies { name: string; path: string }[];

export const AppSidebar = () => {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">UsługPOL</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton tooltip={item.name} asChild>
                    <Link href={item.path}>
                      {/* {item.icon && <item.icon />} */}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
