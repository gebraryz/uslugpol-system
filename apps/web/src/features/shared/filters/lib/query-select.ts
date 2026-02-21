export interface QuerySelectOption {
  value: string;
  label: string;
}

export const toQueryOptionsStructure = (
  values: readonly string[],
  labels: Record<string, string>,
) => values.map((value) => ({ value, label: labels[value] || value }));
