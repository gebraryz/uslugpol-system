export const CAR_RECOMMENDATION_REVIEW_STATES = [
  "UNREVIEWED",
  "REVIEWED",
] as const;

export type CarRecommendationReviewState =
  (typeof CAR_RECOMMENDATION_REVIEW_STATES)[number];

export const CAR_RECOMMENDATION_REVIEW_STATE_LABELS: Record<
  CarRecommendationReviewState,
  string
> = {
  UNREVIEWED: "Do rozpatrzenia",
  REVIEWED: "Rozpatrzone",
};
