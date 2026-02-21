"use client";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import {
  IconTargetArrow,
  IconConfetti,
  IconCar,
  IconBoom,
} from "@tabler/icons-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAVIGATION_ITEMS = [
  {
    name: "Centrum leadów",
    path: ROUTES.core.leads,
    icon: IconTargetArrow,
  },
  {
    name: "Organizacja imprez",
    path: ROUTES.events.leads,
    icon: IconConfetti,
  },
  {
    name: "Wynajem aut",
    path: ROUTES.vehicles.rental,
    icon: IconCar,
  },
  {
    name: "Sprzątanie",
    path: ROUTES.cleaning.index,
    icon: IconBoom,
    badge: "MVP",
  },
] satisfies {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  badge?: string;
}[];

const MODULE_PATHS = [
  ROUTES.events.leads,
  ROUTES.vehicles.rental,
  ROUTES.cleaning.index,
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isModulePath = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const isActiveItem = (path: string) => {
    if (path === ROUTES.core.leads) {
      return !MODULE_PATHS.some(isModulePath);
    }

    return isModulePath(path);
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-4 px-2 py-3">
          <Image
            src="/logo.png"
            width={36}
            height={36}
            alt="Logo UsługPOL"
            className="rounded-full"
          />
          <span className="text-lg font-medium tracking-tight">
            System UsługPOL
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isActiveItem(item.path)}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center gap-3"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <item.icon size={22} stroke={1.5} />
                      <span className="text-base font-medium">{item.name}</span>
                      {item.badge ? (
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
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
