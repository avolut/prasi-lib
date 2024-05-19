import { GFCol } from "@/gen/utils";
import get from "lodash.get";
import { FC } from "react";

export const fields_map = new Map<string, (GFCol & { checked?: GFCol[] })[]>();

export const GetValue: FC<{
  value: any;
  name: string;
}> = (prop) => {
  const { value, name } = prop;
  return get(value, name);
};
