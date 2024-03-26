import capitalize from "lodash.capitalize";

export type GFCol = {
  name: string;
  type: string;
  is_pk: boolean;
  optional: boolean;
  relation?: {
    table: string;
    pk: string;
  };
};

export const formatName = (name: string) => {
  return (name || "")
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
