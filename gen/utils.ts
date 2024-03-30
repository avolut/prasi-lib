import { createId } from "@paralleldrive/cuid2";
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

type SimplifiedItem = {
  name?: string;
  component?: { id: string; props: Record<string, any> };
  childs?: SimplifiedItem[];
};

export const createItem = (arg: SimplifiedItem): any => {
  let component = undefined;

  if (arg.component && arg.component.id) {
    component = { id: arg.component.id, props: {} as any };

    if (arg.component.props) {
      for (const [k, v] of Object.entries(arg.component.props)) {
        component.props[k] = {
          type: "string",
          value: JSON.stringify(v),
          valueBuilt: JSON.stringify(v),
        };
      }
    }
  }

  return {
    id: createId(),
    dim: {
      h: "full",
      w: "full",
    },
    name: arg.name || "item",
    type: "item",
    component,
    script: {},
    childs: arg.childs?.map(createItem),
  };
};
