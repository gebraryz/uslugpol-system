"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyToClipboardButtonProps {
  value: string;
  label: string;
}

export const CopyToClipboardButton = ({
  value,
  label,
}: CopyToClipboardButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-xs"
    aria-label={label}
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(value);
        toast.success("Skopiowano");
      } catch {
        toast.error("Nie udało się skopiować");
      }
    }}
  >
    <Copy />
  </Button>
);
