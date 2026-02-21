import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ACCESS_CONTEXTS } from "@/constants/access-context";
import { LEAD_CATEGORY_MODULES } from "@/constants/lead/lead-category-modules";
import { ROUTES } from "@/constants/routes";
import { setAccessContextCookie } from "@/lib/access-context";
import {
  formatDate,
  formatJson,
  isObjectRecord,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import { redirect } from "next/navigation";
import type { CoreLeadDetailsLead } from "./lead-details.types";

interface CoreLeadDetailsExtensionsCardProps {
  lead: CoreLeadDetailsLead;
}

const EXTENSION_FIELD_LABELS = {
  eventDate: "Data wydarzenia",
  guestCount: "Liczba gości",
  budget: "Budżet",
  isOutdoor: "Wydarzenie plenerowe",
  data: "Dane rozszerzenia",
} as const;

const isIsoDateString = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
};

const toExtensionFieldLabel = (key: string): string => {
  if (key in EXTENSION_FIELD_LABELS) {
    return EXTENSION_FIELD_LABELS[key as keyof typeof EXTENSION_FIELD_LABELS];
  }

  return key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/^./, (value) => value.toUpperCase());
};

const formatExtensionValue = (key: string, value: unknown): string | null => {
  if (value === null || value === undefined) {
    return "Brak";
  }

  if (typeof value === "boolean") {
    return value ? "Tak" : "Nie";
  }

  if (typeof value === "number") {
    const formatted = new Intl.NumberFormat("pl-PL").format(value);
    return key === "budget" ? `${formatted} PLN` : formatted;
  }

  if (typeof value === "string") {
    const normalizedKey = key.toLowerCase();
    const isDateLike =
      normalizedKey.includes("date") || normalizedKey.endsWith("at");

    if (isDateLike && isIsoDateString(value)) {
      return formatDate(value);
    }

    return value;
  }

  return null;
};

const isNonCoreAccessContext = (
  value: FormDataEntryValue | null,
): value is Exclude<(typeof ACCESS_CONTEXTS)[number], "core"> =>
  typeof value === "string" &&
  value !== "core" &&
  (ACCESS_CONTEXTS as readonly string[]).includes(value);

const isSafePath = (value: FormDataEntryValue | null): value is string =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

const switchContextAndRedirect = async (formData: FormData) => {
  "use server";

  const context = formData.get("context");
  const href = formData.get("href");

  if (!isNonCoreAccessContext(context) || !isSafePath(href)) {
    redirect(ROUTES.core.leads);
  }

  await setAccessContextCookie(context);
  redirect(href);
};

export const CoreLeadDetailsExtensionsCard = ({
  lead,
}: CoreLeadDetailsExtensionsCardProps) => {
  const extensionsEmptyState =
    LEAD_CATEGORY_MODULES[lead.category].extensionsEmptyState;
  const cta = extensionsEmptyState.cta;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rozszerzenia</CardTitle>
      </CardHeader>
      <CardContent>
        {lead.extensions.length === 0 ? (
          <Empty className="gap-4 rounded-md p-5 md:p-6">
            <EmptyHeader>
              <EmptyTitle>Brak rozszerzeń</EmptyTitle>
              <EmptyDescription>
                {extensionsEmptyState.message}
              </EmptyDescription>
            </EmptyHeader>
            {cta ? (
              <EmptyContent>
                <form action={switchContextAndRedirect}>
                  <input type="hidden" name="context" value={cta.context} />
                  <input type="hidden" name="href" value={cta.href(lead.id)} />
                  <button
                    type="submit"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    {cta.label}
                  </button>
                </form>
              </EmptyContent>
            ) : null}
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {lead.extensions.map((extension) => {
              const entries = isObjectRecord(extension.data)
                ? Object.entries(extension.data)
                : [["data", extension.data] as const];

              return (
                <Card key={extension.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <Badge variant="outline">
                      {toServiceLabelOrUnknown(extension.namespace)}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(extension.updatedAt)}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entries.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Brak danych rozszerzenia do wyświetlenia.
                      </p>
                    ) : (
                      <dl className="divide-y rounded-md border">
                        {entries.map(([key, value]) => {
                          const formattedValue = formatExtensionValue(
                            key,
                            value,
                          );

                          return (
                            <div
                              key={key}
                              className="grid gap-1 px-3 py-2 text-sm"
                            >
                              <dt className="text-muted-foreground text-xs">
                                {toExtensionFieldLabel(key)}
                              </dt>
                              <dd>
                                {formattedValue ? (
                                  <span>{formattedValue}</span>
                                ) : (
                                  <details className="text-sm">
                                    <summary className="cursor-pointer">
                                      Pokaż dane szczegółowe
                                    </summary>
                                    <pre className="bg-muted mt-2 max-w-md overflow-x-auto rounded-md p-2 text-xs">
                                      {formatJson(value)}
                                    </pre>
                                  </details>
                                )}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
