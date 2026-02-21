import { ReactNode } from "react";
import { AppTopBar } from "./app-top-bar";

interface AppPageProps {
  title: string;
  breadcrumbs: { name: string; path: string }[];
  headerAction?: ReactNode;
  children: ReactNode;
}

export const AppPage = ({
  title,
  headerAction,
  breadcrumbs,
  children,
}: AppPageProps) => (
  <>
    <AppTopBar breadcrumbs={breadcrumbs} />
    <div className="@container/main flex flex-1 flex-col gap-2 px-12">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-bold text-4xl">{title}</h1>
          {headerAction}
        </div>
        {children}
      </div>
    </div>
  </>
);
