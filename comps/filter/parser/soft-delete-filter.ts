import { isEmptyString } from "lib/utils/is-empty-string";

export const softDeleteFilter = (
  where: any,
  soft: {
    field: string;
    type: "boolean" | "nullable";
    feature: Array<string>;
  }
) => {
  const feature = soft.feature || [];
  if (!feature.find((e) => e === "soft_delete")) return where;
  const defaultParam = typeof where === "object" ? where : {};

  if (isEmptyString(soft.field) || isEmptyString(soft.type))
    return defaultParam;

  const result = {
    AND: [
      typeof defaultParam === "object" ? { ...defaultParam } : {},
      {
        [soft.field]: soft.type === "boolean" ? false : null,
      },
    ],
  };
  return result;
};
