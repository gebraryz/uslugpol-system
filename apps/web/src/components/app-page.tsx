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
    <div className="@container/main flex flex-1 flex-col gap-2 md:px-8 px-4">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-bold text-3xl sm:text-4xl">{title}</h1>
          {headerAction ? (
            <div className="w-full sm:w-auto sm:shrink-0 *:w-full sm:*:w-auto">
              {headerAction}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  </>
);
