import { generateSelect } from "lib/comps/md/gen/md-select";
import { on_load } from "lib/comps/md/gen/tbl-list/on_load";
import { createItem, parseGenField } from "lib/gen/utils";
import capitalize from "lodash.capitalize";
import { ArrowBigDown } from "lucide-react";
import { on_load_rel } from "./on_load_rel";
import { createId } from "@paralleldrive/cuid2";
import { gen_label } from "./gen-label";
import { get_value } from "./get-value";
import { set_value } from "./set-value";
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
};
export const newField = (
  arg: GFCol,
  opt: { parent_table: string; value: Array<string> }
) => {
  let type = "input";
  if (["int", "string", "text"].includes(arg.type)) {
    if (["int"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type,
            sub_type: "number",
            child: {
              childs: [],
            },
          },
        },
      });
    } else {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type,
            sub_type: "text",
            child: {
              childs: [],
            },
          },
        },
      });
    }
  } else if (["timestamptz", "date"].includes(arg.type) && arg.relation) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          type: "date",
          sub_type: "datetime",
          child: {
            childs: [],
          },
        },
      },
    });
  } else if (["has-many", "has-one"].includes(arg.type) && arg.relation) {
    const fields = parseGenField(opt.value);
    const res = generateSelect(fields);
    const load = on_load_rel({
      pk: res.pk,
      table: arg.name,
      select: res.select,
      pks: {},
    });
    // console.log("halo");
    if (["has-one"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "single-option",
            sub_type: "dropdown",
            rel__gen_table: arg.name,
            opt__on_load: [load],
            opt__label: [
              gen_label({
                pk: res.pk,
                table: arg.name,
                select: res.select,
              }),
            ],
            opt__get_value: [
              get_value({
                pk: res.pk,
                table: arg.name,
                select: res.select,
              }),
            ],
            opt__set_value: [
              set_value({
                pk: res.pk,
                table: arg.name,
                select: res.select,
              }),
            ],
            child: {
              childs: [],
            },
          },
        },
      });
    } else {
      return {
        id: createId(),
        name: "item",
        type: "item",
        childs: [],
        edit: null as any,
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: {
              type: "string",
              value: arg.name,
            },
            label: {
              type: "string",
              value: formatName(arg.name),
            },
            sub_type: {
              type: "string",
              value: "single-option",
            },
            rel__gen_table: {
              type: "string",
              value: arg.name,
            },
            opt__on_load: {
              type: "raw",
              value: `\
              ${load}
              `,
            },
          },
        },
      };
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "single-option",
            sub_type: "dropdown",
            rel__gen_table: arg.name,
            // rel__gen_fields: [`[${opt.value.join(",")}]`],
            opt__on_load: [
              `\
            ${load}
            `,
            ],
            child: {
              childs: [],
            },
          },
        },
      });
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "date",
            sub_type: "datetime",
            child: {
              childs: [],
            },
          },
        },
      });
    }
  } else {
    // type not found,
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          type,
          sub_type: "text",
          child: {
            childs: [],
          },
        },
      },
    });
  }
};
export const formatName = (name: string) => {
  return (name || "")
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
