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
  component?: { id: string; props: Record<string, string | SimplifiedItem> };
  childs?: SimplifiedItem[];
  adv?: {
    js: string;
    jsBuilt: string;
  };
  padding?: any;
};

export const createItem = (arg: SimplifiedItem): any => {
  let component = undefined;

  if (arg.component && arg.component.id) {
    component = { id: arg.component.id, props: {} as any };

    if (arg.component.props) {
      for (const [k, v] of Object.entries(arg.component.props)) {
        if (typeof v === "object") {
          component.props[k] = {
            meta: {
              type: "content-element",
            },
            content: {
              id: createId(),
              dim: {
                h: "full",
                w: "full",
              },
              padding: arg.padding,
              type: "item",
              name: k,
              ...v,
            },
            value: "",
            valueBuilt: "",
          };
        } else {
          component.props[k] = {
            type: "string",
            value: JSON.stringify(v),
            valueBuilt: JSON.stringify(v),
          };
        }
      }
    }
  }

  return {
    id: createId(),
    dim: {
      h: "full",
      w: "full",
    },
    padding: arg.padding,
    name: arg.name || "item",
    type: "item",
    component,
    script: {
      ...arg.adv,
    },
    childs: arg.childs?.map(createItem),
  };
};
