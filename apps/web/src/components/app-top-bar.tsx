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
  <header className="flex border-b items-center p-2 gap-x-2">
    <SidebarTrigger />
    <Breadcrumb>
      <BreadcrumbList>
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
