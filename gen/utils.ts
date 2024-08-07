import { createId } from "@paralleldrive/cuid2";
import capitalize from "lodash.capitalize";

export type GenFn<T> = (modify: (data: any) => void, data: any, arg: T) => any;

export type PropOptRaw = (string | { value: string; checked: string[] })[];
export const parseGenField = (fields: PropOptRaw) => {
  const result = [] as GFCol[];
  for (const f of fields) {
    if (typeof f === "string") {
      try {
        const field = JSON.parse(f);
        field["value"] = f;
        result.push(field);
      } catch (e) {}
    } else {
      const field = JSON.parse(f.value);
      field.relation.fields = parseGenField(f.checked);
      field["value"] = f;
      result.push(field);
    }
  }
  return result;
};

export const parseOpt = <T>(gens: PropOptRaw) => {
  const should_gen = {};
  for (const gen of gens) {
    if (typeof gen !== "string") {
      (should_gen as any)[gen.value] = {};
      for (const c of gen.checked) {
        (should_gen as any)[gen.value][c] = true;
      }
    } else {
      (should_gen as any)[gen] = true;
    }
  }
  return should_gen as T;
};

export type GFCol = {
  name: string;
  type: string;
  is_pk: boolean;
  optional: boolean;
  relation?: {
    from: { table: string; fields: string[] };
    to: { table: string; fields: string[] };
    fields: GFCol[];
  };
  value: Array<string> | string;
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
  component?: {
    id: string;
    props: Record<
      string,
      string | SimplifiedItem | [any] | [any, any] | undefined
    >;
  };
  childs?: SimplifiedItem[];
  adv?: {
    css?: string;
    js?: string;
    jsBuilt?: string;
  };
  padding?: any;
  dim?: any;
  layout?: any;
  border?: any;
  hidden?: string;
};

export const createItem = (arg: SimplifiedItem): any => {
  let component = undefined;

  if (arg.component && arg.component.id) {
    component = { id: arg.component.id, props: {} as any };

    if (arg.component.props) {
      for (const [k, v] of Object.entries(arg.component.props)) {
        if (v === undefined) continue;
        if (typeof v === "object") {
          if (Array.isArray(v) && v.length === 1) {
            component.props[k] = {
              meta: { type: "text" },
              type: "string",
              value: v[0],
            };
          } else if (Array.isArray(v) && v.length === 2) {
            component.props[k] = {
              meta: { type: "text" },
              type: "string",
              value: v[0],
              valueBuilt: v[1],
            };
          } else {
            if ((v as any)?.meta?.type) {
              component.props[k] = v;
            } else {
              let newItem = createItem(v);
              component.props[k] = {
                meta: {
                  type: "content-element",
                },
                content: newItem,
                value: "",
                valueBuilt: "",
              };
            }
          }
        } else {
          component.props[k] = {
            meta: { type: "text" },
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
    dim: arg.dim
      ? arg.dim
      : {
          h: "full",
          w: "full",
        },
    padding: arg.padding,
    layout: arg.layout,
    border: arg.border,
    name: arg.name || "item",
    type: "item",
    component,
    adv: arg.adv,
    hidden: arg.hidden,
    childs: arg.childs?.map(createItem) || [],
  };
};
