"use client";

import {
  ACCESS_CONTEXT_LABELS,
  ACCESS_CONTEXTS,
  type AccessContext,
} from "@/constants/access-context";
import { setAccessContextAction } from "@/features/access/actions/set-access-context";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AccessContextSwitcherProps {
  initialContext: AccessContext;
}

export const AccessContextSwitcher = ({
  initialContext,
}: AccessContextSwitcherProps) => {
  const router = useRouter();
  const [value, setValue] = useState<AccessContext>(initialContext);

  const { execute, isExecuting } = useAction(setAccessContextAction, {
    onSuccess: ({ data }) => {
      if (!data) return;

      router.replace(data.redirectTo);
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Nie udało się zmienić kontekstu");
      setValue(initialContext);
    },
  });

  return (
    <div className="px-2 py-3">
      <p className="text-muted-foreground mb-2 text-xs font-medium">
        Kontekst widoku
      </p>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          const context = nextValue as AccessContext;
          setValue(context);
          execute({ context });
        }}
        disabled={isExecuting}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Wybierz kontekst" />
        </SelectTrigger>
        <SelectContent>
          {ACCESS_CONTEXTS.map((context) => (
            <SelectItem key={context} value={context}>
              {ACCESS_CONTEXT_LABELS[context]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
