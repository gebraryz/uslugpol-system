"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { decideCarRecommendationAction } from "../actions/decide-recommendation";
import type { CrossSellDecisionStatus } from "@uslugpol/car-service/enums";

interface CarRecommendationDecisionActionsProps {
  recommendationId: string;
  status: CrossSellDecisionStatus;
}

export const CarRecommendationDecisionActions = ({
  recommendationId,
  status,
}: CarRecommendationDecisionActionsProps) => {
  const router = useRouter();
  const { execute, isExecuting } = useAction(decideCarRecommendationAction, {
    onSuccess: ({ data }) => {
      if (data?.alreadyDecided) {
        toast.info("Ta rekomendacja została już rozpatrzona");
      } else if (data?.sentToCore) {
        toast.success("Decyzja została zapisana i wysłana do Centrum");
      } else {
        toast.warning(
          "Decyzja została zapisana lokalnie, ale nie została wysłana do Centrum",
        );
      }

      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Nie udało się zapisać decyzji");
    },
  });

  if (status !== "PENDING") {
    return <span className="text-muted-foreground text-sm">Rozpatrzono</span>;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="default"
        disabled={isExecuting}
        onClick={() =>
          execute({
            recommendationId,
            decision: "ACCEPTED",
          })
        }
      >
        Akceptuj
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isExecuting}
        onClick={() =>
          execute({
            recommendationId,
            decision: "DECLINED",
          })
        }
      >
        Odrzuć
      </Button>
    </div>
  );
};
