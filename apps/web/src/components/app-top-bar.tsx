import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { SidebarTrigger } from "./ui/sidebar";

interface AppTopBarProps {
  breadcrumbs: { name: string; path: string }[];
}

export const AppTopBar = ({ breadcrumbs }: AppTopBarProps) => (
  <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-2">
    <SidebarTrigger />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">UsługPOL</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbs.map((breadcrumb) => (
          <Fragment key={breadcrumb.path}>
            <BreadcrumbItem key={breadcrumb.path}>
              <BreadcrumbLink href={breadcrumb.path}>
                {breadcrumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumb.path !== breadcrumbs[breadcrumbs.length - 1]?.path && (
              <BreadcrumbSeparator />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  </header>
);
