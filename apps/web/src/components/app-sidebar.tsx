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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
import { AccessContextSwitcher } from "@/components/access-context-switcher";
import type { AccessContext } from "@/constants/access-context";

const NAVIGATION_ITEMS = [
  {
    name: "Centrum leadów",
    path: ROUTES.core.leads,
    context: "core",
    icon: IconTargetArrow,
  },
  {
    name: "Organizacja imprez",
    path: ROUTES.events.leads,
    context: "event",
    icon: IconConfetti,
  },
  {
    name: "Wynajem aut",
    path: ROUTES.vehicles.index,
    context: "car",
    icon: IconCar,
    children: [
      {
        name: "Leady",
        path: ROUTES.vehicles.leads,
      },
      {
        name: "Rekomendacje",
        path: ROUTES.vehicles.recommendations,
      },
    ],
  },
  {
    name: "Sprzątanie",
    path: ROUTES.cleaning.index,
    context: "cleaning",
    icon: IconBoom,
    badge: "MVP",
  },
] satisfies {
  name: string;
  path: string;
  context: AccessContext;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  badge?: string;
  children?: {
    name: string;
    path: string;
  }[];
}[];

const MODULE_PATHS = [
  ROUTES.events.leads,
  ROUTES.vehicles.index,
  ROUTES.cleaning.index,
];

interface AppSidebarProps {
  initialAccessContext: AccessContext;
}

export const AppSidebar = ({ initialAccessContext }: AppSidebarProps) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const visibleItems = NAVIGATION_ITEMS.filter(
    (item) => item.context === initialAccessContext,
  );

  const isModulePath = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const isActiveItem = (path: string) => {
    if (path === ROUTES.core.leads) {
      return !MODULE_PATHS.some(isModulePath);
    }

    return isModulePath(path);
  };

  return (
    <Sidebar
      variant="floating"
      className="[&_[data-slot=sidebar-inner]]:bg-white"
    >
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
              {visibleItems.map((item) => {
                const itemActive = isActiveItem(item.path);

                return (
                  <SidebarMenuItem key={item.path}>
                    {item.children ? (
                      <>
                        <SidebarMenuButton
                          size="lg"
                          isActive={itemActive}
                          className={itemActive ? "font-semibold" : undefined}
                        >
                          <item.icon size={22} stroke={1.5} />
                          <span className="text-base font-medium">{item.name}</span>
                        </SidebarMenuButton>

                        <SidebarMenuSub>
                          {item.children.map((child) => {
                            const childActive = isActiveItem(child.path);

                            return (
                              <SidebarMenuSubItem key={child.path}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={childActive}
                                  className={childActive ? "font-semibold" : undefined}
                                >
                                  <Link
                                    href={child.path}
                                    onClick={() => {
                                      if (isMobile) {
                                        setOpenMobile(false);
                                      }
                                    }}
                                  >
                                    <span>{child.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        isActive={itemActive}
                        className={itemActive ? "font-semibold" : undefined}
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
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border bg-white">
        <AccessContextSwitcher initialContext={initialAccessContext} />
      </SidebarFooter>
    </Sidebar>
  );
};
